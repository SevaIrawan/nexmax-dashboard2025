# 🚀 **MIGRASI KE SUPABASE - NEXMAX DASHBOARD**

## 📋 **Status Migrasi Saat Ini**

### ✅ **SELESAI:**
- ✅ **FINAL BACKUP** - File backup `FINAL-BACKUP-SUPABASE-MIGRATION.json` (210MB)
- ✅ **Supabase Setup Script** - `scripts/supabase-setup.js`
- ✅ **Supabase Configuration** - `lib/supabase.js`
- ✅ **Updated Dependencies** - `package.json` dengan `@supabase/supabase-js`
- ✅ **Updated API Endpoints** - Login, Main Dashboard, Last Update
- ✅ **Environment Template** - `env.example`

### 🔄 **LANGKAH SELANJUTNYA:**

---

## 🛠️ **LANGKAH 1: Setup Supabase Project**

### 1.1 **Buat Supabase Project**
```bash
# 1. Buka https://supabase.com
# 2. Sign up/Login
# 3. Create New Project
# 4. Pilih region terdekat (Singapore/Asia)
# 5. Set database password yang kuat
```

### 1.2 **Dapatkan Credentials**
```bash
# Dari Supabase Dashboard:
# 1. Settings > API
# 2. Copy Project URL
# 3. Copy anon public key
# 4. Copy service_role secret key
```

### 1.3 **Setup Environment Variables**
```bash
# Copy env.example ke .env.local
cp env.example .env.local

# Edit .env.local dengan credentials Supabase:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
```

---

## 🗄️ **LANGKAH 2: Install Dependencies**

```bash
# Install Supabase dependencies
npm install @supabase/supabase-js bcryptjs jsonwebtoken

# Verify installation
npm list @supabase/supabase-js
```

---

## 🔧 **LANGKAH 3: Setup Database**

### 3.1 **Run Supabase Setup Script**
```bash
# Set environment variables
export SUPABASE_URL="your_supabase_url"
export SUPABASE_ANON_KEY="your_anon_key"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run setup script
node scripts/supabase-setup.js
```

### 3.2 **Verify Database Setup**
```bash
# Test connection
curl http://localhost:3000/api/health

# Expected response:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-XX..."
}
```

---

## 🔄 **LANGKAH 4: Migrate Data**

### 4.1 **Automatic Migration (via Script)**
```bash
# Script akan otomatis:
# 1. Create semua tables
# 2. Load data dari backup
# 3. Create indexes
# 4. Setup RLS policies

node scripts/supabase-setup.js
```

### 4.2 **Manual Verification**
```bash
# Check data di Supabase Dashboard:
# 1. Table Editor
# 2. Verify semua tables ada
# 3. Check record counts
# 4. Test queries
```

---

## 🧪 **LANGKAH 5: Testing**

### 5.1 **Test API Endpoints**
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Test main dashboard
curl http://localhost:3000/api/main-dashboard

# Test last update
curl http://localhost:3000/api/last-update
```

### 5.2 **Test Frontend**
```bash
# Start development server
npm run dev

# Test di browser:
# 1. Login page
# 2. Main dashboard
# 3. Strategic executive
# 4. All other pages
```

---

## 🔒 **LANGKAH 6: Security Setup**

### 6.1 **Row Level Security (RLS)**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_daily ENABLE ROW LEVEL SECURITY;
-- ... (semua tables)

-- Create policies
CREATE POLICY "Allow authenticated read" ON users 
FOR SELECT TO authenticated USING (true);
-- ... (semua tables)
```

### 6.2 **JWT Configuration**
```javascript
// Verify JWT_SECRET is set
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
```

---

## 🚀 **LANGKAH 7: Production Deployment**

### 7.1 **Environment Variables**
```bash
# Production .env
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_production_jwt_secret
```

### 7.2 **Build & Deploy**
```bash
# Build application
npm run build

# Test build
npm start

# Deploy ke platform pilihan:
# - Vercel
# - Netlify
# - Railway
# - DigitalOcean
```

---

## 📊 **VERIFICATION CHECKLIST**

### ✅ **Database**
- [ ] Supabase project created
- [ ] All tables created
- [ ] Data migrated successfully
- [ ] Indexes created
- [ ] RLS policies configured

### ✅ **API Endpoints**
- [ ] Login API working
- [ ] Main dashboard API working
- [ ] Last update API working
- [ ] All chart APIs working
- [ ] Error handling working

### ✅ **Frontend**
- [ ] Login page working
- [ ] Main dashboard loading
- [ ] Charts displaying data
- [ ] Navigation working
- [ ] Responsive design

### ✅ **Security**
- [ ] JWT authentication working
- [ ] RLS policies active
- [ ] Environment variables secure
- [ ] No hardcoded credentials

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues:**

#### 1. **Connection Error**
```bash
# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Test connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
supabase.from('users').select('count').then(console.log);
"
```

#### 2. **Data Migration Error**
```bash
# Check backup file
ls -la backups/FINAL-BACKUP-SUPABASE-MIGRATION.json

# Verify file integrity
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('backups/FINAL-BACKUP-SUPABASE-MIGRATION.json'));
console.log('Tables:', Object.keys(data.tables));
console.log('Total records:', Object.values(data.tables).reduce((sum, table) => sum + (table.recordCount || 0), 0));
"
```

#### 3. **API Error**
```bash
# Check logs
npm run dev

# Test individual endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/last-update
```

---

## 📞 **SUPPORT**

### **Jika ada masalah:**
1. **Check logs** - Console dan Network tab
2. **Verify credentials** - Supabase dashboard
3. **Test connection** - Manual curl commands
4. **Check data** - Supabase table editor

### **Contact:**
- **Backup file:** `backups/FINAL-BACKUP-SUPABASE-MIGRATION.json`
- **Setup script:** `scripts/supabase-setup.js`
- **Configuration:** `lib/supabase.js`

---

## 🎯 **NEXT STEPS**

Setelah migrasi selesai:
1. **Update semua API endpoints** untuk menggunakan Supabase
2. **Test semua fitur** dashboard
3. **Deploy ke production**
4. **Monitor performance**
5. **Setup monitoring** dan logging

**Status:** 🔄 **MIGRASI DALAM PROGRESS** - Siap untuk setup Supabase project! 