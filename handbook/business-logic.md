# 📊 Business Logic & Formula Documentation

## 🧮 Overview Business Logic

Dashboard NEXMAX menggunakan **Centralized Business Logic** di `lib/business-logic.js` untuk memastikan konsistensi perhitungan di seluruh aplikasi. Semua formula dan business rules terpusat di satu tempat untuk maintainability.

---

## 🔢 Core KPI Formulas

### 📈 Main Dashboard KPIs

#### 1. Deposit Amount
```sql
-- SQL Query
SELECT COALESCE(SUM(amount), 0) as total_deposit
FROM transactions 
WHERE type = 'deposit' 
  AND currency = ? 
  AND EXTRACT(YEAR FROM created_at) = ? 
  AND EXTRACT(MONTH FROM created_at) = ?;
```

```javascript
// Business Logic Implementation
export const calculateDepositAmount = (transactions) => {
  return transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
};
```

#### 2. Withdraw Amount
```sql
-- SQL Query  
SELECT COALESCE(SUM(amount), 0) as total_withdraw
FROM transactions 
WHERE type = 'withdraw'
  AND currency = ? 
  AND EXTRACT(YEAR FROM created_at) = ? 
  AND EXTRACT(MONTH FROM created_at) = ?;
```

```javascript
// Business Logic Implementation
export const calculateWithdrawAmount = (transactions) => {
  return transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
};
```

#### 3. Gross Profit (GGR - Gross Gaming Revenue)
```javascript
// Formula: Total Revenue - Direct Costs
export const calculateGrossProfit = (depositAmount, withdrawAmount, fees) => {
  const revenue = depositAmount + fees.commission + fees.service;
  const directCosts = withdrawAmount + fees.processing;
  return revenue - directCosts;
};
```

#### 4. Net Profit
```javascript
// Formula: Gross Profit - Operational Costs
export const calculateNetProfit = (grossProfit, operationalCosts) => {
  const costs = operationalCosts || {
    staff: 0,
    infrastructure: 0,
    marketing: 0,
    compliance: 0
  };
  
  const totalCosts = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  return grossProfit - totalCosts;
};
```

#### 5. New Depositor
```sql
-- SQL Query: First-time depositors in the period
SELECT COUNT(DISTINCT user_id) as new_depositors
FROM transactions t1
WHERE type = 'deposit'
  AND currency = ?
  AND EXTRACT(YEAR FROM created_at) = ?
  AND EXTRACT(MONTH FROM created_at) = ?
  AND NOT EXISTS (
    SELECT 1 FROM transactions t2 
    WHERE t2.user_id = t1.user_id 
      AND t2.type = 'deposit'
      AND t2.created_at < t1.created_at
  );
```

#### 6. Active Member
```sql
-- SQL Query: Users with activity in the period
SELECT COUNT(DISTINCT user_id) as active_members
FROM transactions 
WHERE currency = ?
  AND EXTRACT(YEAR FROM created_at) = ?
  AND EXTRACT(MONTH FROM created_at) = ?;
```

#### 7. Add Transaction
```sql
-- SQL Query: Sum of all positive transactions
SELECT COALESCE(SUM(amount), 0) as add_transactions
FROM transactions 
WHERE amount > 0
  AND currency = ?
  AND EXTRACT(YEAR FROM created_at) = ?
  AND EXTRACT(MONTH FROM created_at) = ?;
```

#### 8. Deduct Transaction  
```sql
-- SQL Query: Sum of all negative transactions (absolute value)
SELECT COALESCE(SUM(ABS(amount)), 0) as deduct_transactions
FROM transactions 
WHERE amount < 0
  AND currency = ?
  AND EXTRACT(YEAR FROM created_at) = ?
  AND EXTRACT(MONTH FROM created_at) = ?;
```

---

## 📊 Strategic Executive KPIs

### 🎯 Power BI Aligned Formulas

#### 1. Net Profit (Strategic)
```javascript
// Enhanced formula with department breakdown
export const calculateStrategicNetProfit = (data, filters) => {
  const { year, currency, departments } = filters;
  
  // Filter data by year and currency (Month tidak affect strategic charts)
  const filteredData = data.filter(item => 
    item.year === year && 
    item.currency === currency
  );
  
  // Calculate by department
  const departmentProfits = departments.map(dept => {
    const deptData = filteredData.filter(item => item.department === dept);
    return calculateNetProfit(deptData);
  });
  
  return departmentProfits.reduce((sum, profit) => sum + profit, 0);
};
```

#### 2. Customer Value per Headcount
```javascript
// Formula: Total Customer Value / Total Headcount
export const calculateCustomerValuePerHeadcount = (customerData, headcountData) => {
  const totalCustomerValue = customerData.reduce((sum, customer) => {
    return sum + (customer.lifetime_value || 0);
  }, 0);
  
  const totalHeadcount = headcountData.reduce((sum, dept) => {
    return sum + (dept.headcount || 0);
  }, 0);
  
  return totalHeadcount > 0 ? totalCustomerValue / totalHeadcount : 0;
};
```

#### 3. Customer Count vs Headcount Ratio
```javascript
// Formula: Active Customers / Total Headcount
export const calculateCustomerHeadcountRatio = (customerCount, totalHeadcount) => {
  return totalHeadcount > 0 ? customerCount / totalHeadcount : 0;
};
```

#### 4. Customer Volume by Department
```javascript
// Formula: Department-wise customer volume calculation
export const calculateCustomerVolumeByDept = (transactions, departments) => {
  return departments.map(dept => {
    const deptTransactions = transactions.filter(t => t.department === dept);
    
    const volume = deptTransactions.reduce((sum, t) => {
      return sum + parseFloat(t.amount || 0);
    }, 0);
    
    const customerCount = new Set(deptTransactions.map(t => t.user_id)).size;
    
    return {
      department: dept,
      volume: volume,
      customerCount: customerCount,
      avgVolumePerCustomer: customerCount > 0 ? volume / customerCount : 0
    };
  });
};
```

#### 5. Revenue vs Cost Analysis
```javascript
// Formula: Department-wise revenue and cost comparison
export const calculateRevenueCostAnalysis = (revenueData, costData) => {
  const analysis = {};
  
  // Revenue calculation
  revenueData.forEach(item => {
    if (!analysis[item.department]) {
      analysis[item.department] = { revenue: 0, cost: 0, profit: 0 };
    }
    analysis[item.department].revenue += parseFloat(item.amount || 0);
  });
  
  // Cost calculation
  costData.forEach(item => {
    if (!analysis[item.department]) {
      analysis[item.department] = { revenue: 0, cost: 0, profit: 0 };
    }
    analysis[item.department].cost += parseFloat(item.amount || 0);
  });
  
  // Profit calculation
  Object.keys(analysis).forEach(dept => {
    analysis[dept].profit = analysis[dept].revenue - analysis[dept].cost;
  });
  
  return analysis;
};
```

---

## 📈 Chart Data Processing

### Line Chart Data (Growth vs Profitability)

```javascript
export const processLineChartData = (rawData, filters) => {
  const { currency, year } = filters;
  
  // Filter by currency and year
  const filteredData = rawData.filter(item => 
    item.currency === currency && 
    item.year === year
  );
  
  // Group by month
  const monthlyData = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  months.forEach(month => {
    const monthData = filteredData.filter(item => item.month === month);
    
    monthlyData[month] = {
      netProfit: calculateNetProfit(monthData),
      newDepositor: calculateNewDepositor(monthData),
      totalRevenue: calculateTotalRevenue(monthData),
      totalCost: calculateTotalCost(monthData)
    };
  });
  
  // Transform for Chart.js format
  return {
    categories: months,
    series: [
      {
        name: 'Net Profit',
        data: months.map(month => monthlyData[month].netProfit || 0)
      },
      {
        name: 'New Depositor', 
        data: months.map(month => monthlyData[month].newDepositor || 0)
      },
      {
        name: 'Total Revenue',
        data: months.map(month => monthlyData[month].totalRevenue || 0)
      },
      {
        name: 'Total Cost',
        data: months.map(month => monthlyData[month].totalCost || 0)
      }
    ]
  };
};
```

### Bar Chart Data (Retention vs Churn & CLV)

```javascript
export const processBarChartData = (rawData, filters) => {
  const { currency, year } = filters;
  
  // Calculate retention rate
  const calculateRetentionRate = (monthData) => {
    const activeUsers = new Set(monthData.map(item => item.user_id));
    const returningUsers = monthData.filter(item => item.is_returning_user);
    
    return activeUsers.size > 0 ? 
      (returningUsers.length / activeUsers.size) * 100 : 0;
  };
  
  // Calculate churn rate  
  const calculateChurnRate = (monthData, previousMonthData) => {
    const currentUsers = new Set(monthData.map(item => item.user_id));
    const previousUsers = new Set(previousMonthData.map(item => item.user_id));
    
    const churnedUsers = [...previousUsers].filter(userId => !currentUsers.has(userId));
    
    return previousUsers.size > 0 ? 
      (churnedUsers.length / previousUsers.size) * 100 : 0;
  };
  
  // Calculate Customer Lifetime Value (CLV)
  const calculateCLV = (customerData) => {
    return customerData.reduce((sum, customer) => {
      const avgOrderValue = customer.total_spent / customer.order_count;
      const purchaseFrequency = customer.order_count / customer.lifetime_months;
      const customerLifetime = customer.lifetime_months;
      
      const clv = avgOrderValue * purchaseFrequency * customerLifetime;
      return sum + clv;
    }, 0) / customerData.length;
  };
  
  // Process monthly data
  const monthlyProcessing = processMonthlyData(rawData, filters);
  
  return {
    retentionVsChurn: {
      categories: monthlyProcessing.categories,
      series: [
        {
          name: 'Retention Rate (%)',
          data: monthlyProcessing.retention
        },
        {
          name: 'Churn Rate (%)',
          data: monthlyProcessing.churn
        }
      ]
    },
    clvData: {
      categories: monthlyProcessing.categories,
      series: [
        {
          name: 'Customer Lifetime Value',
          data: monthlyProcessing.clv
        },
        {
          name: 'Purchase Frequency',
          data: monthlyProcessing.frequency
        }
      ]
    }
  };
};
```

---

## 🔧 Utility Functions

### Currency Formatting
```javascript
export const formatCurrency = (amount, currency = 'MYR') => {
  const formats = {
    'MYR': { symbol: 'RM', locale: 'ms-MY' },
    'SGD': { symbol: 'S$', locale: 'en-SG' },
    'USD': { symbol: '$', locale: 'en-US' }
  };
  
  const format = formats[currency] || formats['MYR'];
  
  return new Intl.NumberFormat(format.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
```

### Number Formatting  
```javascript
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};
```

### Percentage Formatting
```javascript
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0.0%';
  
  return `${formatNumber(value, decimals)}%`;
};
```

### Date Processing
```javascript
export const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || 'Invalid Month';
};

export const getCurrentFinancialYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  // Assuming financial year starts in January
  return currentMonth >= 1 ? currentYear : currentYear - 1;
};
```

---

## 📊 Data Validation Rules

### Input Validation
```javascript
export const validateKPIInput = (data) => {
  const errors = [];
  
  // Required fields validation
  if (!data.currency) errors.push('Currency is required');
  if (!data.year) errors.push('Year is required'); 
  if (!data.month) errors.push('Month is required');
  
  // Data type validation
  if (data.year && !Number.isInteger(data.year)) {
    errors.push('Year must be an integer');
  }
  
  if (data.year && (data.year < 2020 || data.year > 2030)) {
    errors.push('Year must be between 2020 and 2030');
  }
  
  // Currency validation
  const supportedCurrencies = ['MYR', 'SGD'];
  if (data.currency && !supportedCurrencies.includes(data.currency)) {
    errors.push('Currency must be MYR or SGD');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};
```

### Data Consistency Checks
```javascript
export const validateDataConsistency = (currentData, previousData) => {
  const warnings = [];
  
  // Check for unusual variance
  const varianceThreshold = 0.5; // 50% variance threshold
  
  if (previousData) {
    const netProfitVariance = Math.abs(
      (currentData.netProfit - previousData.netProfit) / previousData.netProfit
    );
    
    if (netProfitVariance > varianceThreshold) {
      warnings.push(`Net profit variance ${(netProfitVariance * 100).toFixed(1)}% exceeds threshold`);
    }
    
    // Check for negative trends
    if (currentData.activeMember < previousData.activeMember * 0.8) {
      warnings.push('Active member count dropped by more than 20%');
    }
  }
  
  return warnings;
};
```

---

## 🚨 Business Rules & Constraints

### Critical Business Rules:

#### 1. Currency Consistency
```javascript
// RULE: All calculations in same session must use same currency
// ENFORCEMENT: API level validation
export const enforceCurrencyConsistency = (requests) => {
  const currencies = [...new Set(requests.map(r => r.currency))];
  if (currencies.length > 1) {
    throw new Error('Mixed currencies not allowed in single calculation');
  }
};
```

#### 2. Data Integrity Rules
```javascript
// RULE: Deposit amount cannot be negative
// RULE: Withdraw amount cannot be negative  
// RULE: Active members cannot exceed total registered users
export const validateBusinessRules = (kpiData) => {
  const violations = [];
  
  if (kpiData.depositAmount < 0) {
    violations.push('Deposit amount cannot be negative');
  }
  
  if (kpiData.withdrawAmount < 0) {
    violations.push('Withdraw amount cannot be negative');
  }
  
  if (kpiData.activeMember > kpiData.totalUsers) {
    violations.push('Active members cannot exceed total users');
  }
  
  return violations;
};
```

#### 3. Strategic Executive Rules
```javascript
// RULE: Strategic charts tidak terpengaruh oleh Month slicer
// RULE: Strategic KPIs hanya filter berdasarkan Year dan Currency
export const applyStrategicFiltering = (data, filters) => {
  // Month filter diabaikan untuk strategic charts
  const { year, currency } = filters;
  
  return data.filter(item => 
    item.year === year && 
    item.currency === currency
    // month filter intentionally omitted
  );
};
```

---

## 🔄 Business Logic Updates

### Safe Updates:
- ✅ Constants dan thresholds
- ✅ Formatting functions
- ✅ New utility functions
- ✅ Additional validation rules

### Dangerous Updates:
- ❌ Core KPI calculation formulas
- ❌ Database query logic
- ❌ Strategic chart filtering rules
- ❌ Currency conversion rates

### Update Process:
1. **Backup** current business logic
2. **Test** changes in development
3. **Validate** against historical data
4. **Document** formula changes
5. **Get approval** from business stakeholders

---

**⚠️ CRITICAL**: Business logic changes dapat mempengaruhi historical data consistency. Always validate terhadap known data points sebelum deploy! 