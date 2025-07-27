# 🔐 Edit Permissions Guide

## ⚠️ CRITICAL WARNING

Dashboard ini sudah **PRODUCTION-READY** dan dalam status **LOCKED**. Semua core functionality sudah completed dan tested. Perubahan apapun harus dilakukan dengan extreme caution.

---

## 🚫 FILES yang TIDAK BOLEH DIEDIT (LOCKED)

### 🏗️ Core Layout Components

#### `components/Sidebar.js` ❌
**REASON**: Role-based menu logic sudah perfect
```javascript
// JANGAN UBAH:
- Menu structure
- Role-based filtering logic
- Logo positioning dan styling
- Navigation functionality
- Collapse/expand behavior
```

#### `components/Header.js` ❌  
**REASON**: Layout dan functionality sudah sesuai requirements
```javascript
// JANGAN UBAH:
- Title positioning
- "Welcome, {username}" message
- Malaysia flag positioning
- Logout button styling dan functionality
- Header height (85px standard)
```

### 📊 Main Dashboard

#### `pages/index.js` ❌
**REASON**: KPI layout dan chart configuration sudah perfect
```javascript
// JANGAN UBAH:
- KPI cards layout (2x4 grid)
- Chart configurations
- Slicer functionality
- Data binding logic
- Responsive behavior
```

#### `pages/api/main-dashboard.js` ❌
**REASON**: Business logic formulas sudah validated
```javascript
// JANGAN UBAH:
- SQL queries
- KPI calculation formulas
- Data transformation logic
- Error handling
```

### 📈 Strategic Executive Dashboard

#### `pages/strategic-executive.js` ❌
**REASON**: Layout dan chart logic sudah sesuai Power BI requirements
```javascript
// JANGAN UBAH:
- 5 KPI cards layout
- 2-2-1 chart arrangement
- Sub-header styling
- Chart configurations
- Month slicer behavior (tidak affect charts)
```

#### `pages/api/strategic-executive.js` ❌
#### `pages/api/strategic-charts.js` ❌
**REASON**: Dummy data structure sudah consistent dengan frontend

### 🔐 Authentication & Security

#### `hooks/useAuth.js` ❌
**REASON**: Authentication logic sudah stable
```javascript
// JANGAN UBAH:
- JWT token handling
- User session management
- Login/logout flow
- Authentication checks
```

#### `lib/roles.js` ❌
**REASON**: Role definitions sudah precise sesuai requirements
```javascript
// JANGAN UBAH:
- ROLES constants
- PAGE_ACCESS configuration
- Helper functions
- Access control logic
```

#### `hooks/useRoleAccess.js` ❌
**REASON**: Page protection logic sudah working perfect

### 🗄️ Database & Business Logic

#### `lib/database.js` ❌
**REASON**: Connection pool configuration sudah optimized

#### `lib/business-logic.js` ❌ (PARTIALLY)
**REASON**: Core formulas sudah validated, tapi constants boleh adjust

### 🎨 Critical Styling

#### `styles/globals.css` ❌ (CORE PARTS)
**REASON**: Critical layout rules sudah locked
```css
/* JANGAN UBAH: */
.sidebar overflow rules
.header positioning
.sub-header standardization
.scroll behavior rules
```

---

## ✅ FILES yang BOLEH DIEDIT (dengan HATI-HATI)

### 📄 Placeholder Pages (Coming Soon Status)

#### `pages/business-flow.js` ✅ (CONTENT ONLY)
**REASON**: Currently placeholder, boleh develop content
```javascript
// BOLEH UBAH:
- Content area dalam main div
- Business flow charts/diagrams
- Page-specific functionality

// JANGAN UBAH:
- Header configuration
- Sub-header styling
- Sidebar props
- Layout structure
```

#### `pages/bgo.js` ✅
#### `pages/os.js` ✅
#### `pages/sr.js` ✅
#### `pages/xoo.js` ✅
**REASON**: Placeholder pages, boleh develop sepenuhnya
```javascript
// BOLEH UBAH:
- Seluruh content area
- Add charts dan KPIs
- Implement business logic

// MAINTAIN:
- Standard sub-header size
- Proper component props
- Role-based access
```

#### Transaction Pages ✅ (ALL)
- `pages/transaction/deposit.js`
- `pages/transaction/withdraw.js`
- `pages/transaction/exchange.js`
- `pages/transaction/headcount.js`
- `pages/transaction/adjustment.js`
- `pages/transaction/vip-program.js`
- `pages/transaction/new-depositor.js`
- `pages/transaction/member-report.js`

### 📊 Business Logic Constants

#### `lib/business-logic.js` ✅ (CONSTANTS ONLY)
**REASON**: Constants boleh adjust untuk business requirements
```javascript
// BOLEH UBAH:
export const BUSINESS_CONSTANTS = {
  DEFAULT_CURRENCY: 'MYR',
  COMMISSION_RATE: 0.15,
  VIP_THRESHOLD: 10000,
  // ... other constants
};

// JANGAN UBAH:
// Core calculation functions
// Data transformation utilities
// Error handling logic
```

### 🎨 Minor Styling Adjustments

#### Page-specific CSS ✅ (LIMITED)
**REASON**: Minor adjustments boleh untuk improve UX
```javascript
// BOLEH UBAH:
- Chart colors (maintain brand consistency)
- Button styling (non-critical buttons)
- Content area spacing
- Font sizes (non-critical elements)

// JANGAN UBAH:
- Layout dimensions
- Fixed positioning
- Overflow rules
- Critical component styling
```

---

## 🔗 FILE CORRELATIONS & DEPENDENCIES

### Core Dependency Chain:

```
useAuth.js
    ↓
useRoleAccess.js
    ↓
All Page Components
    ↓
Sidebar.js + Header.js
    ↓
API Endpoints
    ↓
Database.js + Business-Logic.js
```

### Critical Correlations:

#### 1. Role Changes Impact:
```
lib/roles.js → hooks/useRoleAccess.js → All Pages → components/Sidebar.js
```

#### 2. Authentication Changes Impact:
```
hooks/useAuth.js → pages/login.js → All Protected Pages
```

#### 3. Business Logic Changes Impact:
```
lib/business-logic.js → API Endpoints → Frontend Charts
```

#### 4. Styling Changes Impact:
```
styles/globals.css → All Components → All Pages
```

#### 5. Database Changes Impact:
```
lib/database.js → All API Endpoints → Frontend Data Display
```

### API Endpoint Dependencies:

```
/api/auth/* → useAuth.js
/api/main-dashboard → pages/index.js
/api/strategic-executive → pages/strategic-executive.js
/api/strategic-charts → pages/strategic-executive.js
/api/users/* → pages/users.js
/api/last-update → All Pages (via useLastUpdate.js)
```

---

## ⚠️ BEFORE MAKING ANY CHANGES

### 1. Pre-Change Checklist:
- [ ] Create backup of affected files
- [ ] Document the reason for change
- [ ] Identify all dependent files
- [ ] Plan rollback strategy

### 2. Testing Requirements:
- [ ] Test in development environment first
- [ ] Validate all role-based access still working
- [ ] Check all chart rendering properly
- [ ] Verify database connections stable
- [ ] Test responsive behavior

### 3. Post-Change Validation:
- [ ] All existing functionality still working
- [ ] No new errors in console
- [ ] Performance not degraded
- [ ] User experience improved (if applicable)

---

## 🚨 EMERGENCY ROLLBACK PROCEDURE

### If Changes Break System:

1. **IMMEDIATELY**:
   ```bash
   git checkout HEAD~1 -- affected-file.js
   # or restore from backup
   ```

2. **RESTART DEVELOPMENT SERVER**:
   ```bash
   npm run dev
   ```

3. **VALIDATE CORE FUNCTIONALITY**:
   - Login with different roles
   - Navigate to main dashboard
   - Check strategic executive page
   - Test user management (admin)

4. **NOTIFY PROJECT OWNER** if production impact

---

## 📝 CHANGE LOG REQUIREMENTS

### For ANY File Changes, Document:

```markdown
## Change Log Entry

**Date**: YYYY-MM-DD
**Files Modified**: 
- path/to/file1.js
- path/to/file2.js

**Reason for Change**: 
Brief description of why change was needed

**Changes Made**:
- Specific change 1
- Specific change 2

**Testing Done**:
- Test case 1 ✅
- Test case 2 ✅

**Dependencies Checked**:
- Dependent file 1 ✅
- Dependent file 2 ✅

**Rollback Plan**:
How to undo changes if needed

**Approval**: 
Project owner approval before production
```

---

**🔒 REMEMBER**: PRODUCTION-READY means STABLE. Changes should only improve, never break existing functionality! 