# Business Flow Page Implementation

## Overview
Business Flow Page diimplementasikan dengan struktur 4 module terpisah, masing-masing dengan frame konten sendiri dan scroll behavior yang dinamis.

## Struktur Module

### 1. PPC Service Module
- **Title:** "PPC Service Module"
- **Subtitle:** "New customer acquisition and group join metrics"
- **Content:**
  - Row 1: 3 StatCard (New Customer Conversion Rate, Total New Customers, Customer Group Join Volume)
  - Row 2: 3 Chart (1 Line + 2 Bar Charts)

### 2. First Depositor Module
- **Title:** "First Depositor Module"
- **Subtitle:** "2nd deposit rates comparison between group and non-group members"
- **Content:**
  - Row 1: 4 StatCard (2nd Deposit Rate In Group, 2nd Deposits In Group, 2nd Deposit Rate Not In Group, 2nd Deposits Not In Group)
  - Row 2: 3 Chart (1 Line + 2 Bar Charts)

### 3. Old Member Module
- **Title:** "Old Member Module"
- **Subtitle:** "Engagement, NPS, upgrade and churn metrics by tier"
- **Content:**
  - Row 1: 2 StatCard (Total Upgraded Members, Total Churned Members)
  - Row 2: 3 Bar Charts (Customer Count by Tier, Upgraded Members by Tier, Churned Members by Tier)
  - Row 3: 2 Line Charts (Group Engagement by Tier, NPS by Tier)
  - Row 4: 1 Bar Chart + 1 Line Chart (Tier Upgrade Rate, Tier Churn Rate Trend)
  - **Special:** Scroll container untuk konten yang panjang

### 4. Traffic Executive Module
- **Title:** "Traffic Executive Module"
- **Subtitle:** "Customer reactivation and transfer success metrics"
- **Content:**
  - Row 1: 3 StatCard (Customer Transfer Success Rate, Target Completion, Total Reactivated Customers)
  - Row 2: 3 Chart (1 Line + 1 Bar + 1 Donut Chart)

## Fitur Implementasi

### 1. Scroll Behavior
- **Scroll down** → Frame muncul satu per satu
- **Title & Subtitle** → Otomatis update di Sub Header sesuai module yang aktif
- **Scroll tracking** → Menggunakan `useRef` dan `useEffect` untuk tracking posisi scroll

### 2. Dynamic Data Logic
- **Filter-based data generation** → Data berubah berdasarkan Year, Month, Currency
- **Multiplier system** → Data disesuaikan dengan filter yang dipilih
- **Database ready** → Logic siap untuk di-sync dengan PostgreSQL

### 3. Layout System
- **StandardKPIGrid** → Untuk StatCard dengan auto-adjust width
- **StandardChartGrid** → Untuk Chart dengan berbagai layout:
  - `3x1`: 3 charts dalam 1 row
  - `complex`: Multiple rows untuk Old Member Module
  - `2x2`, `1x2`, `2x1`, `1x1`: Layout standar

### 4. Special Features
- **Old Member Module Scroll** → Container dengan max-height dan scroll untuk konten panjang
- **Donut Chart Support** → Component DonutChart untuk Traffic Executive Module
- **Error Handling** → Try-catch blocks dan error state management
- **Loading States** → Skeleton loading untuk UX yang smooth

## File Structure

```
pages/
├── business-flow.js          # Main Business Flow Page
components/
├── StandardKPIGrid.js        # KPI Cards Grid
├── StandardChartGrid.js      # Charts Grid dengan layout options
├── StandardChart.js          # Chart wrapper dengan type support
├── DonutChart.js            # Donut chart component
├── BarChart.js              # Bar chart component
├── LineChart.js             # Line chart component
styles/
├── dashboard-components.css  # CSS untuk semua components
```

## Database Integration Points

### 1. Data Sources (akan di-implement)
- `ppc_service_data` → PPC Service Module
- `first_depositor_data` → First Depositor Module  
- `old_member_data` → Old Member Module
- `traffic_executive_data` → Traffic Executive Module

### 2. Filter Integration
- **Year filter** → `year` column
- **Month filter** → `month` column  
- **Currency filter** → `currency` column

### 3. Dynamic Query System
```javascript
// Example query structure
const generateDynamicData = async (moduleName, year, month, currency) => {
  const query = `
    SELECT * FROM ${moduleName.toLowerCase()}_data 
    WHERE year = $1 AND month = $2 AND currency = $3
    ORDER BY date DESC
  `;
  // Implementation akan ditambahkan
};
```

## Responsive Design

### Desktop (1024px+)
- Full layout dengan semua charts visible
- 3 columns untuk KPI cards
- Complex layout untuk Old Member Module

### Tablet (768px - 1024px)
- 2 columns untuk charts
- Adjusted spacing dan font sizes
- Scroll behavior tetap smooth

### Mobile (768px-)
- 1 column layout
- Stacked charts dan KPI cards
- Touch-friendly scroll

## Performance Optimizations

### 1. Lazy Loading
- Module content hanya di-render saat visible
- Chart components dengan lazy loading

### 2. Scroll Optimization
- Debounced scroll events
- Efficient DOM queries dengan useRef

### 3. Data Caching
- Dynamic data caching per filter combination
- Memoized chart data generation

## Future Enhancements

### 1. Real-time Updates
- WebSocket integration untuk live data
- Auto-refresh pada interval tertentu

### 2. Advanced Filtering
- Date range picker
- Custom date ranges
- Multiple currency selection

### 3. Export Features
- PDF export per module
- Excel export dengan filtered data
- Screenshot functionality

### 4. Interactive Features
- Drill-down capabilities
- Chart interactions
- Data point highlighting

## Testing Strategy

### 1. Unit Tests
- Component rendering tests
- Data generation logic tests
- Filter functionality tests

### 2. Integration Tests
- Scroll behavior testing
- Module switching tests
- Error handling tests

### 3. Performance Tests
- Large dataset handling
- Scroll performance
- Memory usage optimization

## Deployment Notes

### 1. Environment Variables
```env
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_postgresql_url
```

### 2. Build Optimization
- Code splitting untuk setiap module
- Tree shaking untuk unused components
- Image optimization untuk icons

### 3. Monitoring
- Error tracking dengan Sentry
- Performance monitoring
- User interaction analytics 