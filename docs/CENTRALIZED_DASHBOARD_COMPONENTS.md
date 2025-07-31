# 🎨 Centralized Dashboard Components System

## 📋 Overview

Sistem terpusat untuk semua StatCard/KPI Card dan Chart components agar tampil seragam di seluruh dashboard. Mengikuti standar Main Dashboard dan Strategic Executive.

## 🏗️ File Structure

```
styles/
├── dashboard-components.css          # CSS terpusat untuk semua komponen
components/
├── StandardStatCard.js              # Komponen KPI Card terstandarisasi
├── StandardChart.js                 # Komponen Chart terstandarisasi
├── StandardKPIGrid.js              # Grid KPI Cards terstandarisasi
└── StandardChartGrid.js            # Grid Charts terstandarisasi
```

## 🎯 Standard Components

### 1. StandardStatCard
Komponen KPI Card dengan standar yang sama seperti Main Dashboard dan Strategic Executive.

**Props:**
- `title`: Judul KPI
- `value`: Nilai KPI
- `subtitle`: Subtitle (biasanya persentase perubahan)
- `color`: Warna judul
- `icon`: Icon emoji
- `isAmount`: Boolean untuk menampilkan currency logo
- `currencyLogo`: Logo currency (RM, SGD, USC)

**Usage:**
```jsx
import StandardStatCard from '../components/StandardStatCard';

<StandardStatCard
  title="Net Profit"
  value="693,053.48"
  subtitle="+24.8% vs last month"
  color="#10B981"
  icon="💰"
  isAmount={true}
  currencyLogo="RM"
/>
```

### 2. StandardChart
Komponen Chart dengan standar yang sama untuk Bar dan Line charts.

**Props:**
- `type`: 'bar' atau 'line'
- `series`: Data series untuk chart
- `categories`: Kategori data
- `title`: Judul chart
- `currency`: Currency untuk formatting
- `loading`: Boolean untuk loading state
- `placeholder`: Text placeholder jika tidak ada data

**Usage:**
```jsx
import StandardChart from '../components/StandardChart';

<StandardChart
  type="line"
  series={[{ name: 'Revenue', data: [450000, 520000, 480000] }]}
  categories={['Jan', 'Feb', 'Mar']}
  title="Revenue Trend"
  currency="MYR"
/>
```

### 3. StandardKPIGrid
Grid untuk menampilkan multiple KPI Cards dengan loading skeleton.

**Props:**
- `data`: Array of KPI data objects
- `loading`: Boolean untuk loading state
- `columns`: Jumlah kolom (default: 6)

**Usage:**
```jsx
import StandardKPIGrid from '../components/StandardKPIGrid';

const kpiData = [
  {
    title: "Net Profit",
    value: "693,053.48",
    subtitle: "+24.8% vs last month",
    color: "#10B981",
    icon: "💰",
    isAmount: true,
    currencyLogo: "RM"
  },
  // ... more KPI data
];

<StandardKPIGrid data={kpiData} loading={false} />
```

### 4. StandardChartGrid
Grid untuk menampilkan multiple Charts dengan berbagai layout.

**Props:**
- `charts`: Array of chart data objects
- `loading`: Boolean untuk loading state
- `layout`: Layout type ('2x2', '1x2', '2x1', '1x1')

**Usage:**
```jsx
import StandardChartGrid from '../components/StandardChartGrid';

const chartData = [
  {
    type: "line",
    series: [{ name: 'Revenue', data: [450000, 520000, 480000] }],
    categories: ['Jan', 'Feb', 'Mar'],
    title: "Revenue Trend",
    currency: "MYR"
  },
  // ... more chart data
];

<StandardChartGrid charts={chartData} layout="2x2" />
```

## 🎨 CSS Classes

### KPI Card Classes
- `.kpi-grid-standard`: Grid container untuk KPI cards
- `.kpi-card-standard`: Individual KPI card
- `.kpi-icon-standard`: Icon di KPI card
- `.kpi-content-standard`: Content area KPI card
- `.kpi-title-standard`: Title KPI card
- `.kpi-value-standard`: Value KPI card
- `.kpi-change-standard`: Change indicator KPI card

### Chart Classes
- `.charts-grid-standard`: Grid container untuk charts
- `.chart-container-standard`: Individual chart container
- `.chart-title-standard`: Chart title
- `.line-charts-section-standard`: Section untuk line charts

### Skeleton Loading Classes
- `.kpi-card-skeleton-standard`: Skeleton untuk KPI card
- `.chart-skeleton-standard`: Skeleton untuk chart
- `.skeleton-icon-standard`: Skeleton untuk icon
- `.skeleton-title-standard`: Skeleton untuk title
- `.skeleton-value-standard`: Skeleton untuk value
- `.skeleton-change-standard`: Skeleton untuk change indicator

## 📱 Responsive Design

### KPI Grid Responsive
- **Desktop (1400px+)**: 6 columns
- **Large (1200px-1400px)**: 3 columns
- **Medium (768px-1200px)**: 3 columns
- **Small (480px-768px)**: 2 columns
- **Mobile (<480px)**: 1 column

### Chart Grid Responsive
- **Desktop (1024px+)**: 2 columns
- **Mobile (<1024px)**: 1 column

## 🎯 Standard Features

### KPI Card Features
- ✅ **Consistent Design**: Title dan icon aligned (justified)
- ✅ **Uniform Color & Size**: Warna dan ukuran seragam
- ✅ **Black Value Display**: Value ditampilkan dalam hitam dengan font size yang sama
- ✅ **Last Month Comparison**: Label "vs Last Month" dengan indikator hijau/merah
- ✅ **Green Up/Red Down**: Indikator perubahan dengan warna yang sesuai
- ✅ **Hover Effects**: Smooth hover animation
- ✅ **Loading Skeleton**: Skeleton loading yang smooth

### Chart Features
- ✅ **Consistent Container**: Background putih, border, shadow yang sama
- ✅ **Standard Padding**: Padding 24px 28px
- ✅ **Min Height**: 380px untuk konsistensi
- ✅ **Responsive**: Otomatis menyesuaikan ukuran layar
- ✅ **Loading States**: Skeleton loading untuk charts
- ✅ **Placeholder**: Placeholder text jika tidak ada data

## 🔧 Implementation Guide

### 1. Import CSS
```jsx
import '../styles/dashboard-components.css';
```

### 2. Use Standard Components
```jsx
import StandardStatCard from '../components/StandardStatCard';
import StandardChart from '../components/StandardChart';
import StandardKPIGrid from '../components/StandardKPIGrid';
import StandardChartGrid from '../components/StandardChartGrid';
```

### 3. Replace Existing Components
Ganti semua penggunaan StatCard dan Chart components dengan Standard components:

**Before:**
```jsx
<div className="kpi-card-improved">
  <div className="kpi-icon">{stat.icon}</div>
  <div className="kpi-content">
    <h3 className="kpi-title">{stat.title}</h3>
    <div className="kpi-value">{stat.value}</div>
    <div className="kpi-change">{stat.change}</div>
  </div>
</div>
```

**After:**
```jsx
<StandardStatCard
  title={stat.title}
  value={stat.value}
  subtitle={stat.change}
  color={stat.color}
  icon={stat.icon}
  isAmount={stat.isAmount}
  currencyLogo={stat.currencyLogo}
/>
```

## 🚀 Benefits

### ✅ **Consistency**
- Semua KPI cards dan charts tampil seragam
- Standard sizing, spacing, dan styling
- Consistent color scheme dan typography

### ✅ **Maintainability**
- CSS terpusat di satu file
- Komponen reusable
- Mudah diupdate untuk semua pages

### ✅ **Performance**
- Optimized CSS classes
- Efficient loading states
- Smooth animations

### ✅ **Responsive**
- Otomatis menyesuaikan ukuran layar
- Mobile-friendly design
- Consistent breakpoints

### ✅ **Developer Experience**
- Clear component API
- Comprehensive documentation
- Easy to implement dan maintain

## 📋 Migration Checklist

Untuk mengimplementasikan sistem terpusat ini:

1. ✅ **Import CSS**: Tambahkan import CSS di `_app.js`
2. ✅ **Replace Components**: Ganti StatCard dengan StandardStatCard
3. ✅ **Replace Charts**: Ganti Chart components dengan StandardChart
4. ✅ **Update Grids**: Gunakan StandardKPIGrid dan StandardChartGrid
5. ✅ **Test Responsive**: Pastikan responsive design berfungsi
6. ✅ **Verify Loading**: Test loading states dan skeletons
7. ✅ **Check Consistency**: Pastikan semua pages tampil seragam

## 🎯 Next Steps

1. **Implement di semua pages** yang menggunakan KPI cards dan charts
2. **Update existing components** untuk menggunakan standard system
3. **Add more chart types** (Pie, Doughnut, Area) jika diperlukan
4. **Create theme system** untuk custom colors dan branding
5. **Add animation options** untuk enhanced UX 