# 🎯 STANDAR TAMPILAN TRANSACTION PAGES

## 📋 **Standar Sorting Database**

### **1. Standar Sorting Utama**
```sql
ORDER BY date DESC, year DESC, month DESC
```

### **2. Standar Sorting Alternatif**
```sql
ORDER BY year DESC, month DESC
```

### **3. Implementasi di Semua API**
Semua API transaction pages menggunakan sorting yang konsisten:

- **Data Fetching:** `ORDER BY date DESC, year DESC, month DESC LIMIT $param OFFSET $param`
- **Export:** `ORDER BY date DESC, year DESC, month DESC`

## 🎨 **Standar Tampilan UI**

### **1. Layout Konsisten**
```jsx
<div className="dashboard-container">
  <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
  <div className={`dashboard-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
    <Header title="📊 Page Title" user={user} />
    
    {/* Sub Header - Standard Size */}
    <div className="sub-header">
      <div className="sub-header-title">
        Filter & Actions ({totalRecords} records)
      </div>
      <div className="sub-header-actions">
        {/* Slicers dan Buttons */}
      </div>
    </div>
    
    {/* Content Area */}
    <div className="content-area">
      {/* Data Table */}
    </div>
  </div>
</div>
```

### **2. Standar Slicer Components**
```jsx
{/* YEAR SLICER */}
<select className="slicer-select" value={year} onChange={(e) => setYear(e.target.value)}>
  <option value="ALL">All Years</option>
  {slicerOptions.years.map(yr => (
    <option key={yr} value={yr}>{yr}</option>
  ))}
</select>

{/* CURRENCY SLICER */}
<select className="slicer-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
  <option value="ALL">All Currencies</option>
  {slicerOptions.currencies.map(curr => (
    <option key={curr} value={curr}>{curr}</option>
  ))}
</select>

{/* MONTH SLICER */}
<select className="slicer-select" value={month} onChange={(e) => setMonth(e.target.value)}>
  <option value="ALL">All Months</option>
  {slicerOptions.months.map(mo => (
    <option key={mo.value} value={mo.value}>{mo.label}</option>
  ))}
</select>
```

### **3. Standar Button Components**
```jsx
{/* INPUT BUTTON */}
<button className="btn-primary" onClick={handleInputClick} disabled={isReadOnly}>
  {showInputForm ? '❌ Cancel' : '➕ Input Data'}
</button>

{/* EXPORT BUTTON */}
<button className="btn-success" onClick={handleExport} disabled={!canExportData || exporting}>
  {exporting ? '⏳ Exporting...' : '📥 Export Excel'}
</button>
```

### **4. Standar Data Table**
```jsx
<div className="data-table-container">
  <div className="table-header">
    <h2>Page Title Data (Page {pagination.currentPage} of {pagination.totalPages})</h2>
    <p>Showing {data.length} of {pagination.totalRecords.toLocaleString()} records</p>
  </div>
  
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          {data.length > 0 && Object.keys(data[0]).map((column, index) => (
            <th key={index}>{column.replace(/_/g, ' ').toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className={editingRow === rowIndex ? 'editing-row' : ''}>
            {Object.values(row).map((value, colIndex) => (
              <td key={colIndex}>
                {value !== null && value !== undefined ? String(value) : '-'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  {/* Pagination Controls */}
  {pagination.totalPages > 1 && (
    <div className="pagination-controls">
      <button className="pagination-btn" disabled={!pagination.hasPrevPage}>
        ← Previous
      </button>
      <span className="pagination-info">
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      <button className="pagination-btn" disabled={!pagination.hasNextPage}>
        Next →
      </button>
    </div>
  )}
</div>
```

## 📊 **Daftar Halaman Transaction**

### **1. Deposit** - `/transaction/deposit`
- **Table:** `deposit_daily`
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Currency, Month, Date Range Toggle

### **2. Withdraw** - `/transaction/withdraw`
- **Table:** `withdraw_daily`
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Currency, Month, Date Range Toggle

### **3. Exchange** - `/transaction/exchange`
- **Table:** `exchange_rate`
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Month, Date Range Toggle

### **4. Headcount** - `/transaction/headcount`
- **Table:** `headcountdep`
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Currency, Month
- **Special:** Edit functionality with auto-generation

### **5. New Register** - `/transaction/new-register`
- **Table:** `new_register`
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Currency, Month, Date Range Toggle

### **6. New Depositor** - `/transaction/new-depositor`
- **Table:** `new_depositor`
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Currency, Month, Date Range Toggle

### **7. Member Report** - `/transaction/member-report`
- **Table:** `member_report_daily`
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Currency, Month, Date Range Toggle

### **8. Adjustment** - `/transaction/adjustment`
- **Table:** `adjusment_daily`
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Currency, Month, Date Range Toggle

### **9. VIP Program** - `/transaction/vip-program`
- **Table:** `vip_program` (placeholder)
- **Sorting:** `ORDER BY date DESC, year DESC, month DESC`
- **Slicers:** Year, Currency, Month, Date Range Toggle

## 🔧 **Standar API Endpoints**

### **Setiap Halaman Memiliki:**
1. **`/api/[page]/data.js`** - Fetch data dengan sorting standar
2. **`/api/[page]/slicer-options.js`** - Fetch slicer options
3. **`/api/[page]/export.js`** - Export data dengan sorting standar

### **Halaman Khusus:**
- **Headcount:** Tambahan `/api/headcount/structure.js`, `/api/headcount/save.js`, `/api/headcount/update.js`
- **Exchange:** Tambahan `/api/exchange/structure.js`, `/api/exchange/save.js`, `/api/exchange/update.js`

## 🎨 **CSS Classes Standar**

### **Import CSS:**
```jsx
import '../../styles/transaction-pages.css';
```

### **Classes yang Tersedia:**
- `.dashboard-container` - Container utama
- `.sub-header` - Header dengan slicers
- `.slicer-select` - Styling untuk dropdown slicers
- `.btn-primary` - Button biru untuk input
- `.btn-success` - Button hijau untuk export
- `.data-table-container` - Container tabel
- `.data-table` - Tabel data
- `.editing-row` - Row yang sedang diedit
- `.pagination-controls` - Container pagination
- `.loading-container` - Loading state
- `.empty-container` - Empty state

## 📱 **Responsive Design**

### **Mobile Breakpoint:**
```css
@media (max-width: 768px) {
  .table-wrapper {
    height: calc(100vh - 450px);
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 12px;
    font-size: 12px;
  }
}
```

## ✅ **Checklist Implementasi**

### **Untuk Setiap Halaman Baru:**
- [ ] Import CSS standar
- [ ] Implementasi layout konsisten
- [ ] Gunakan sorting standar di API
- [ ] Implementasi slicer components
- [ ] Implementasi data table dengan pagination
- [ ] Implementasi export functionality
- [ ] Test responsive design
- [ ] Test sorting functionality

## 🚀 **Keuntungan Standarisasi**

1. **Konsistensi UI/UX** - Semua halaman terlihat sama
2. **Maintenance Mudah** - Perubahan CSS otomatis berlaku ke semua halaman
3. **Sorting Konsisten** - Data selalu terurut dengan rapi
4. **Responsive Design** - Bekerja di semua device
5. **Performance** - CSS yang dioptimasi
6. **Developer Experience** - Template yang mudah digunakan

---

**Last Updated:** 2025-01-23  
**Version:** 1.0  
**Author:** NEXMAX Dashboard Team 