# 🔧 Maintenance & Logic Guide

## 📋 Overview Maintenance

Dashboard NEXMAX memerlukan maintenance berkala untuk memastikan:
- ✅ **Data Accuracy** - Konsistensi formula dan perhitungan
- ✅ **Performance Optimization** - Query database yang efficient
- ✅ **User Experience** - Interface yang smooth dan responsive
- ✅ **Security** - Access control yang proper

---

## 🔍 Business Logic Maintenance

### 📊 Centralized Business Logic (`lib/business-logic.js`)

#### Key Functions yang Perlu Dimonitor:

```javascript
// KPI Calculations
export const calculateKPIs = (data) => {
  // Formula untuk Active Member
  const activeMember = data.filter(item => item.status === 'active').length;
  
  // Formula untuk GGR (Gross Gaming Revenue)
  const ggr = data.reduce((sum, item) => sum + item.revenue, 0);
  
  // Formula untuk Net Profit
  const netProfit = ggr - totalCosts;
  
  return { activeMember, ggr, netProfit };
};
```

#### ⚠️ CRITICAL RULES untuk Business Logic:
1. **JANGAN UBAH FORMULA** tanpa testing comprehensive
2. **SELALU BACKUP** sebelum modify logic
3. **TEST DI DEVELOPMENT** environment dulu
4. **VALIDASI RESULTS** dengan data historical

### 🗄️ Database Logic Maintenance

#### Connection Pool Monitoring (`lib/database.js`):
```javascript
// Monitor connection pool health
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

#### Query Performance Monitoring:
- Monitor slow queries (>1000ms)
- Check connection pool usage
- Validate data consistency
- Monitor memory usage

---

## 🔒 Role-Based Access Control Maintenance

### Role Definition Updates (`lib/roles.js`):

```javascript
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  EXECUTIVE: 'executive',
  OPERATOR: 'operator',
  USER: 'user'
};

export const PAGE_ACCESS = {
  [ROLES.ADMIN]: {
    pages: ['*'], // All pages
    canManageUsers: true,
    isReadOnly: false,
    canExportData: true
  },
  [ROLES.MANAGER]: {
    pages: ['/', '/strategic-executive', '/business-flow'],
    canManageUsers: false,
    isReadOnly: false, 
    canExportData: false
  }
  // ... other roles
};
```

#### ⚠️ MAINTENANCE CHECKLIST untuk Roles:
- [ ] Test semua role access setelah perubahan
- [ ] Validate menu visibility untuk setiap role
- [ ] Check page-level protection working
- [ ] Verify export functionality per role

---

## 📊 Chart & Data Maintenance

### Chart Configuration Updates:

#### Line Charts (`pages/index.js`):
```javascript
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom', // JANGAN UBAH - Boss requirement
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return formatCurrency(value); // Consistent formatting
        }
      }
    }
  }
};
```

#### ⚠️ CHART MAINTENANCE RULES:
- Legend position: **ALWAYS "bottom center"**
- Currency formatting: **ALWAYS consistent**
- Color scheme: **MAINTAIN brand colors**
- Responsive behavior: **TEST on multiple devices**

### Data Validation Logic:

```javascript
// Validate data before chart rendering
const validateChartData = (data) => {
  if (!data || !Array.isArray(data.categories)) {
    console.warn('Invalid chart data structure');
    return getFallbackData();
  }
  
  if (data.categories.length === 0) {
    console.warn('Empty data categories');
    return getDummyData();
  }
  
  return data;
};
```

---

## 🎨 UI/UX Maintenance

### Sub-Header Consistency (`CRITICAL - Jangan Ubah!`):

```javascript
// STANDARD Sub-Header Style - LOCKED
const subHeaderStyle = {
  position: 'fixed',
  top: '85px',
  left: sidebarExpanded ? '0px' : '0px', // Boss specific requirement
  right: '0',
  minHeight: '100px',
  background: 'white',
  borderBottom: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px 48px',
  zIndex: 1000,
  transition: 'left 0.3s ease',
  overflow: 'hidden' // NO SCROLL rule
};
```

### Scroll Behavior Rules (`CRITICAL`):

```css
/* NO SCROLL zones */
.sidebar,
.sidebar *,
.nav-menu,
.nav-menu * {
  overflow: hidden !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

/* SCROLL ONLY in content area */
.content-area {
  height: calc(100vh - 185px);
  overflowY: auto;
  overflowX: hidden;
}
```

---

## 🚨 Troubleshooting Common Issues

### Issue 1: Sidebar Menu Hilang
**Symptoms**: Menu items tidak tampil untuk specific roles
**Solution**:
```javascript
// Check Sidebar.js props
<Sidebar user={user} onExpandedChange={setSidebarExpanded} />

// NOT the old way:
<Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
```

### Issue 2: Charts Tidak Load
**Symptoms**: Blank charts atau loading forever
**Solution**:
```javascript
// Add fallback data
const chartData = apiData || {
  categories: [],
  series: [{ name: 'No Data', data: [] }]
};
```

### Issue 3: Role Access Tidak Working
**Symptoms**: Users dapat access pages yang seharusnya restricted
**Solution**:
```javascript
// Check useRoleAccess implementation
const { canAccess, isReadOnly } = useRoleAccess('/target-page');

if (!canAccess) {
  router.push('/');
  return null;
}
```

### Issue 4: Database Connection Issues
**Symptoms**: API timeout atau connection errors
**Solution**:
```javascript
// Check connection pool
const client = await pool.connect();
try {
  // Your query
} finally {
  client.release(); // ALWAYS release connection
}
```

---

## 📅 Maintenance Schedule

### Daily Checks:
- [ ] Monitor server logs untuk errors
- [ ] Check database connection status
- [ ] Validate critical user journeys

### Weekly Checks:
- [ ] Database performance review
- [ ] User access audit
- [ ] Chart data accuracy validation
- [ ] Backup verification

### Monthly Checks:
- [ ] Security audit
- [ ] Performance optimization review
- [ ] User feedback analysis
- [ ] System health comprehensive check

### Quarterly Checks:
- [ ] Full system backup
- [ ] Dependency updates review
- [ ] Architecture review
- [ ] Documentation updates

---

## 🔧 Tools untuk Maintenance

### Development Tools:
```bash
# Performance monitoring
npm run dev -- --turbo

# Database debugging
psql -h localhost -d nexmax_db -U username

# Code quality check
npm run lint
```

### Production Monitoring:
- **PM2** untuk process management
- **PostgreSQL logs** untuk database monitoring
- **Next.js built-in analytics** untuk performance
- **Custom logging** untuk business logic errors

---

## ⚠️ EMERGENCY PROCEDURES

### Database Recovery:
1. Stop application server
2. Restore from latest backup
3. Verify data integrity
4. Restart services
5. Validate all functionality

### Application Recovery:
1. Revert to last known good version
2. Clear cache dan restart
3. Test critical functions
4. Monitor for issues

### Security Incident:
1. Immediately revoke suspicious user access
2. Review audit logs
3. Change database credentials if needed
4. Notify stakeholders
5. Document incident

---

**🚨 EMERGENCY CONTACT**: Notify project owner immediately untuk critical issues! 