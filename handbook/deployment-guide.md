# 🚀 Deployment Guide

## 📋 Production Deployment Overview

Dashboard NEXMAX sudah **PRODUCTION-READY** dan dapat di-deploy ke production environment. Guide ini menjelaskan langkah-langkah deployment yang aman dan best practices.

---

## 🛠️ Pre-Deployment Checklist

### ✅ Code Quality Validation
```bash
# 1. Run linting
npm run lint

# 2. Check for unused dependencies
npm audit

# 3. Run type checking (if using TypeScript)
npm run type-check

# 4. Test build process
npm run build
```

### ✅ Functionality Testing
- [ ] **Authentication**: Login/logout working untuk semua roles
- [ ] **Role-based Access**: Setiap role hanya dapat access pages yang sesuai
- [ ] **Main Dashboard**: KPI cards dan charts loading dengan benar
- [ ] **Strategic Executive**: Charts dan data konsisten
- [ ] **User Management**: Admin dapat manage users
- [ ] **Database Connection**: Queries berjalan dengan normal
- [ ] **Responsive Design**: Interface working di mobile dan desktop

### ✅ Security Validation
- [ ] **Environment Variables**: Sensitive data tidak hardcoded
- [ ] **JWT Secrets**: Strong secret keys configured
- [ ] **Database Credentials**: Proper authentication setup
- [ ] **API Endpoints**: Proper authorization checks
- [ ] **File Permissions**: Appropriate file access controls

---

## 🗄️ Database Setup

### PostgreSQL Production Configuration

#### 1. Database Creation:
```sql
-- Create production database
CREATE DATABASE nexmax_production;

-- Create user with limited privileges
CREATE USER nexmax_app WITH PASSWORD 'strong_password_here';

-- Grant necessary privileges
GRANT CONNECT ON DATABASE nexmax_production TO nexmax_app;
GRANT USAGE ON SCHEMA public TO nexmax_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nexmax_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nexmax_app;
```

#### 2. Tables Creation:
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'executive', 'operator', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  department VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_currency_date (currency, created_at),
  INDEX idx_user_type (user_id, type),
  INDEX idx_date_range (created_at)
);

-- Headcount table
CREATE TABLE headcountdep (
  id SERIAL PRIMARY KEY,
  department VARCHAR(50) NOT NULL,
  headcount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL,
  year INTEGER NOT NULL,
  month VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Initial Data:
```sql
-- Insert default admin user
INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$12$hashed_password_here', 'admin');

-- Insert sample data (optional for production)
-- Add your production data here
```

---

## 🌐 Environment Configuration

### Production Environment Variables (`.env.production`):

```bash
# Database Configuration
DATABASE_URL=postgresql://nexmax_app:password@localhost:5432/nexmax_production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=nexmax_production
DB_USER=nexmax_app
DB_PASSWORD=your-secure-password

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# Application Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Security Headers
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Monitoring & Logging
LOG_LEVEL=info
ENABLE_LOGGING=true
ERROR_TRACKING_DSN=your-error-tracking-dsn

# Performance
MAX_REQUEST_SIZE=10mb
REQUEST_TIMEOUT=30000
```

### Security Best Practices:
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Hash passwords properly
# Use bcrypt with minimum 12 rounds
BCRYPT_ROUNDS=12
```

---

## 🏗️ Deployment Methods

### Option 1: PM2 Process Manager (Recommended)

#### Install PM2:
```bash
npm install -g pm2
```

#### PM2 Configuration (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'nexmax-dashboard',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    restart_delay: 4000,
    watch: false,
    max_memory_restart: '2G',
    node_args: '--max-old-space-size=4096'
  }]
};
```

#### Deployment Commands:
```bash
# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor application
pm2 monit

# View logs
pm2 logs nexmax-dashboard
```

### Option 2: Docker Deployment

#### Dockerfile:
```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### Docker Compose (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  nexmax-dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://nexmax_app:password@postgres:5432/nexmax_production
    depends_on:
      - postgres
    restart: unless-stopped
    volumes:
      - ./logs:/usr/src/app/logs

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=nexmax_production
      - POSTGRES_USER=nexmax_app
      - POSTGRES_PASSWORD=your-secure-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - nexmax-dashboard
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## 🔒 Security Configuration

### Nginx Reverse Proxy (`nginx.conf`):
```nginx
events {
    worker_connections 1024;
}

http {
    upstream nexmax {
        server nexmax-dashboard:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Rate limiting
        location /api/auth/login {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://nexmax;
        }

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://nexmax;
        }

        location / {
            proxy_pass http://nexmax;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### SSL Certificate Setup:
```bash
# Using Let's Encrypt
sudo apt install certbot
certbot certonly --standalone -d your-domain.com

# Copy certificates
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
```

---

## 📊 Monitoring & Logging

### Application Monitoring:

#### Health Check Endpoint (`pages/api/health.js`):
```javascript
export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Check database connection
      const dbStatus = await checkDatabaseConnection();
      
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: error.message
      });
    }
  }
}
```

#### Logging Configuration:
```javascript
// lib/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: './logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: './logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Database Monitoring:
```sql
-- Create monitoring queries
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor connections
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

---

## 🔄 Backup & Recovery

### Database Backup:
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/nexmax"
DB_NAME="nexmax_production"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U nexmax_app -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### Application Backup:
```bash
# Application files backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/nexmax-dashboard"
BACKUP_DIR="/backups/nexmax-app"

# Create backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR .

# Remove old backups
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +7 -delete
```

### Recovery Procedures:
```bash
# Database recovery
gunzip backup_YYYYMMDD_HHMMSS.sql.gz
psql -h localhost -U nexmax_app -d nexmax_production < backup_YYYYMMDD_HHMMSS.sql

# Application recovery
tar -xzf app_backup_YYYYMMDD_HHMMSS.tar.gz -C /var/www/nexmax-dashboard
pm2 restart nexmax-dashboard
```

---

## 🚀 Deployment Automation

### CI/CD Pipeline (GitHub Actions):
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/nexmax-dashboard
          git pull origin main
          npm ci --production
          npm run build
          pm2 reload nexmax-dashboard
```

---

## 🔍 Post-Deployment Validation

### Validation Checklist:
```bash
# 1. Check application status
pm2 status nexmax-dashboard

# 2. Test health endpoint
curl https://your-domain.com/api/health

# 3. Test authentication
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 4. Check database connectivity
psql -h localhost -U nexmax_app -d nexmax_production -c "SELECT COUNT(*) FROM users;"

# 5. Monitor logs
pm2 logs nexmax-dashboard --lines 50

# 6. Check resource usage
pm2 monit
```

### Performance Testing:
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://your-domain.com/

# Database performance test
time psql -h localhost -U nexmax_app -d nexmax_production -c "SELECT * FROM transactions LIMIT 1000;"
```

---

## 🚨 Troubleshooting

### Common Issues:

#### Issue 1: Application Won't Start
```bash
# Check logs
pm2 logs nexmax-dashboard

# Check port availability
netstat -tlnp | grep :3000

# Restart application
pm2 restart nexmax-dashboard
```

#### Issue 2: Database Connection Failed
```bash
# Test database connection
psql -h localhost -U nexmax_app -d nexmax_production

# Check database service
systemctl status postgresql

# Review connection string
echo $DATABASE_URL
```

#### Issue 3: High Memory Usage
```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart nexmax-dashboard

# Adjust memory limit in ecosystem.config.js
max_memory_restart: '1G'
```

---

**🎯 PRODUCTION READY**: Dashboard sudah siap untuk production deployment dengan semua best practices dan security measures! 