# ⚙️ Settings & Configuration Guide

## 🎛️ Dashboard Configuration Overview

Dashboard NEXMAX memiliki berbagai settings yang dapat disesuaikan untuk memenuhi business requirements. Namun, tidak semua settings boleh diubah karena sudah dalam status PRODUCTION-READY.

---

## ✅ SAFE Configuration Adjustments

### 📊 Business Logic Constants (`lib/business-logic.js`)

#### KPI Calculation Parameters:
```javascript
// BOLEH DIUBAH - Business Constants
export const BUSINESS_CONSTANTS = {
  // Currency Settings
  DEFAULT_CURRENCY: 'MYR',           // Default currency display
  SUPPORTED_CURRENCIES: ['MYR', 'SGD'], // Available currencies
  
  // Financial Calculations
  COMMISSION_RATE: 0.15,             // 15% commission rate
  VIP_THRESHOLD: 10000,              // VIP member threshold
  HIGH_VALUE_TRANSACTION: 5000,      // High value transaction limit
  
  // Time Settings
  DEFAULT_YEAR: new Date().getFullYear(),
  DEFAULT_MONTH: 'July',
  TIMEZONE: 'Asia/Kuala_Lumpur',
  
  // Performance Settings
  CHART_ANIMATION_DURATION: 1000,   // Chart animation time (ms)
  API_TIMEOUT: 5000,                // API request timeout (ms)
  CACHE_DURATION: 300000,           // Cache duration (5 minutes)
  
  // UI Settings
  CHART_COLORS: {
    PRIMARY: '#3b82f6',
    SUCCESS: '#10b981', 
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#6366f1'
  },
  
  // Pagination
  USERS_PER_PAGE: 10,               // User management pagination
  TRANSACTIONS_PER_PAGE: 25,        // Transaction list pagination
};
```

#### How to Modify:
```javascript
// Example: Change commission rate
export const BUSINESS_CONSTANTS = {
  // ... other constants
  COMMISSION_RATE: 0.18,  // Changed from 15% to 18%
  // ... other constants
};
```

### 🎨 Chart Configuration

#### Chart.js Options (`pages/index.js`, `pages/strategic-executive.js`):
```javascript
// BOLEH DIUBAH - Chart appearance
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',  // LOCKED - Boss requirement
      labels: {
        color: '#374151',   // BOLEH DIUBAH - Legend text color
        font: {
          size: 12,         // BOLEH DIUBAH - Legend font size
          weight: 'normal'  // BOLEH DIUBAH - Legend font weight
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',  // BOLEH DIUBAH
      titleColor: '#ffffff',                   // BOLEH DIUBAH
      bodyColor: '#ffffff',                    // BOLEH DIUBAH
      borderColor: '#3b82f6',                  // BOLEH DIUBAH
      borderWidth: 1                           // BOLEH DIUBAH
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',  // BOLEH DIUBAH - Grid color
        borderColor: '#e5e7eb'         // BOLEH DIUBAH - Border color
      },
      ticks: {
        color: '#6b7280',              // BOLEH DIUBAH - Axis label color
        font: {
          size: 11                     // BOLEH DIUBAH - Axis label size
        }
      }
    },
    y: {
      beginAtZero: true,               // LOCKED - Always start from zero
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',  // BOLEH DIUBAH
        borderColor: '#e5e7eb'         // BOLEH DIUBAH
      },
      ticks: {
        color: '#6b7280',              // BOLEH DIUBAH
        font: {
          size: 11                     // BOLEH DIUBAH
        }
      }
    }
  }
};
```

### 🗄️ Database Configuration (`lib/database.js`)

#### Connection Pool Settings:
```javascript
// BOLEH DIUBAH - Performance tuning
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // BOLEH DIUBAH - Max connections
  min: 5,                     // BOLEH DIUBAH - Min connections
  idleTimeoutMillis: 30000,   // BOLEH DIUBAH - Idle timeout
  connectionTimeoutMillis: 2000, // BOLEH DIUBAH - Connection timeout
  acquireTimeoutMillis: 60000,   // BOLEH DIUBAH - Acquire timeout
});
```

### 🔐 Authentication Settings

#### JWT Configuration (Environment Variables):
```bash
# .env.local - BOLEH DIUBAH
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=24h                    # Token expiration
BCRYPT_ROUNDS=12                      # Password hashing rounds
```

#### Session Settings:
```javascript
// pages/api/auth/login.js - BOLEH DIUBAH
const token = jwt.sign(
  { userId: user.id, username: user.username, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }  // BOLEH DIUBAH
);
```

---

## ⚠️ LIMITED Configuration Changes

### 🎯 Role-Based Settings (`lib/roles.js`)

#### Page Access - CAREFUL CHANGES ONLY:
```javascript
// HATI-HATI - Business logic impact
export const PAGE_ACCESS = {
  [ROLES.ADMIN]: {
    pages: ['*'],                 // LOCKED - Full access
    canManageUsers: true,         // LOCKED - User management
    isReadOnly: false,            // BOLEH DIUBAH - Read permissions
    canExportData: true          // BOLEH DIUBAH - Export permissions
  },
  [ROLES.MANAGER]: {
    pages: ['/', '/strategic-executive', '/business-flow'], // LOCKED
    canManageUsers: false,        // LOCKED
    isReadOnly: false,            // BOLEH DIUBAH
    canExportData: false         // BOLEH DIUBAH - untuk business needs
  },
  [ROLES.OPERATOR]: {
    pages: ['/', '/strategic-executive', '/business-flow', '/bgo', '/os', '/sr', '/xoo', '/transaction/*'],
    canManageUsers: false,        // LOCKED
    isReadOnly: true,             // BOLEH DIUBAH - jika perlu write access
    canExportData: true          // LOCKED - Export permission for operators
  }
};
```

### 📱 Responsive Breakpoints

#### CSS Media Queries - MINOR ADJUSTMENTS ONLY:
```css
/* styles/globals.css - BOLEH ADJUST */
@media (max-width: 768px) {
  .dashboard-content {
    margin-left: 0 !important;    /* LOCKED - Mobile behavior */
  }
  
  .kpi-grid {
    grid-template-columns: 1fr 1fr; /* BOLEH DIUBAH - Grid layout */
    gap: 16px;                      /* BOLEH DIUBAH - Spacing */
  }
}

@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;     /* BOLEH DIUBAH - Single column */
    gap: 12px;                      /* BOLEH DIUBAH - Smaller spacing */
  }
}
```

---

## 🚫 LOCKED Configuration (DO NOT CHANGE)

### 🏗️ Critical Layout Settings

#### Sub-Header Dimensions - LOCKED:
```javascript
// JANGAN UBAH - Boss specific requirements
const SUB_HEADER_CONFIG = {
  position: 'fixed',
  top: '85px',                    // LOCKED - Standard height
  left: sidebarExpanded ? '0px' : '0px', // LOCKED - Boss requirement  
  minHeight: '100px',             // LOCKED - Standard size
  padding: '15px 48px',           // LOCKED - Standard padding
  zIndex: 1000,                   // LOCKED - Layer order
  overflow: 'hidden'              // LOCKED - No scroll rule
};
```

#### Header Configuration - LOCKED:
```javascript
// JANGAN UBAH - Functionality locked
const HEADER_CONFIG = {
  height: '85px',                 // LOCKED - Standard header height
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  zIndex: 1001,                   // LOCKED - Above sub-header
  position: 'fixed',              // LOCKED - Fixed positioning
  overflow: 'hidden'              // LOCKED - No scroll rule
};
```

#### Sidebar Configuration - LOCKED:
```javascript
// JANGAN UBAH - Navigation locked
const SIDEBAR_CONFIG = {
  expandedWidth: '280px',         // LOCKED - Expanded width
  collapsedWidth: '75px',         // LOCKED - Collapsed width
  transition: 'all 0.3s ease',   // LOCKED - Animation timing
  zIndex: 999,                    // LOCKED - Layer order
  overflow: 'hidden'              // LOCKED - No scroll rule
};
```

### 🔐 Security Settings - LOCKED

#### Role Definitions:
```javascript
// JANGAN UBAH - Access control foundation
export const ROLES = {
  ADMIN: 'admin',                 // LOCKED
  MANAGER: 'manager',             // LOCKED  
  EXECUTIVE: 'executive',         // LOCKED
  OPERATOR: 'operator',           // LOCKED
  USER: 'user'                    // LOCKED
};
```

#### Core Page Access Rules:
```javascript
// JANGAN UBAH - Boss requirements
const CORE_ACCESS_RULES = {
  ADMIN: 'All pages + User Management',
  MANAGER: 'Overview + Strategic Executive + Business Flow ONLY',
  EXECUTIVE: 'Overview + Strategic Executive + Business Flow ONLY',
  OPERATOR: 'All pages except User Management + Read Only',
  USER: 'All pages except User Management + Read Only'
};
```

---

## 🛠️ How to Apply Configuration Changes

### 1. Development Environment:
```bash
# 1. Backup current configuration
cp lib/business-logic.js lib/business-logic.js.backup

# 2. Make changes to configuration
# Edit the file with your changes

# 3. Test changes
npm run dev

# 4. Validate functionality
# Test all affected components
```

### 2. Testing Checklist:
```bash
# After configuration changes, test:
- [ ] All roles can access their permitted pages
- [ ] Charts render correctly with new settings  
- [ ] Database connections remain stable
- [ ] Performance not degraded
- [ ] No console errors
- [ ] Responsive behavior intact
```

### 3. Production Deployment:
```bash
# 1. Backup production environment
# 2. Deploy changes during low-traffic period
# 3. Monitor system health
# 4. Rollback plan ready
```

---

## 📊 Configuration Templates

### New Currency Support:
```javascript
// lib/business-logic.js
export const BUSINESS_CONSTANTS = {
  // Add new currency
  SUPPORTED_CURRENCIES: ['MYR', 'SGD', 'USD'], // Added USD
  
  // Currency formatting
  CURRENCY_FORMATS: {
    'MYR': { symbol: 'RM', decimals: 2 },
    'SGD': { symbol: 'S$', decimals: 2 },
    'USD': { symbol: '$', decimals: 2 }  // New currency format
  }
};
```

### New Chart Color Theme:
```javascript
// Chart color configuration
const CHART_THEMES = {
  default: {
    PRIMARY: '#3b82f6',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444'
  },
  corporate: {
    PRIMARY: '#1e40af',
    SUCCESS: '#059669', 
    WARNING: '#d97706',
    DANGER: '#dc2626'
  },
  dark: {
    PRIMARY: '#60a5fa',
    SUCCESS: '#34d399',
    WARNING: '#fbbf24', 
    DANGER: '#f87171'
  }
};
```

### Performance Optimization Settings:
```javascript
// Database performance tuning
const PERFORMANCE_CONFIG = {
  // Query optimization
  QUERY_TIMEOUT: 10000,           // 10 seconds
  CONNECTION_POOL_MAX: 25,        // Increase for high traffic
  CACHE_TTL: 600,                 // 10 minutes cache
  
  // Frontend optimization  
  CHART_ANIMATION_ENABLED: true,  // Disable for better performance
  LAZY_LOADING_ENABLED: true,     // Enable lazy loading
  DEBOUNCE_DELAY: 300            // Search debounce delay
};
```

---

## 🚨 Configuration Change Warnings

### High Risk Changes:
- **Role definitions** - Can break entire access control
- **Database connection settings** - Can cause outages
- **Layout dimensions** - Can break responsive design
- **Authentication settings** - Can lock users out

### Medium Risk Changes:
- **Chart configurations** - Can affect data visualization
- **Business constants** - Can change calculation results
- **Performance settings** - Can impact user experience

### Low Risk Changes:
- **Colors and themes** - Visual changes only
- **Animation settings** - UX improvements
- **Pagination settings** - Minor UX changes

---

**⚠️ REMEMBER**: Test all configuration changes thoroughly in development before applying to production! 