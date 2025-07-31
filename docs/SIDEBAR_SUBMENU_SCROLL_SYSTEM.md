# Sidebar Submenu Scroll System

## Overview
Sistem scroll sub menu yang terpusat untuk sidebar NEXMAX Dashboard. Semua styling dan konfigurasi scroll sub menu dikelola dalam satu file CSS terpusat.

## File Structure
```
styles/
├── sidebar-submenu.css          # File CSS terpusat untuk sub menu scroll
└── ...

components/
├── Sidebar.js                   # Component sidebar yang menggunakan CSS terpusat
└── ...

docs/
├── SIDEBAR_SUBMENU_SCROLL_SYSTEM.md  # Dokumentasi ini
└── ...
```

## Standard Configuration

### Height Standards
- **Desktop**: `max-height: 180px`
- **Tablet (768px)**: `max-height: 150px`
- **Mobile (480px)**: `max-height: 120px`
- **Small Screen (600px height)**: `max-height: 100px`

### Scroll Behavior
- **Sidebar Main**: No scroll (overflow: hidden)
- **Sub Menu**: Auto scroll dengan scrollbar tipis
- **Scroll Direction**: Vertical only (overflow-x: hidden)
- **Scrollbar Width**: 6px
- **Scrollbar Color**: #667eea (theme color)

### Responsive Breakpoints
```css
@media (max-width: 768px) {
  .submenu-container {
    max-height: 150px !important;
  }
}

@media (max-width: 480px) {
  .submenu-container {
    max-height: 120px !important;
  }
}

@media (max-height: 600px) {
  .submenu-container {
    max-height: 100px !important;
  }
}
```

## Usage

### Import CSS
```javascript
import '../styles/sidebar-submenu.css';
```

### HTML Structure
```html
<div className="submenu-container">
  <ul className="submenu">
    <li>
      <a href="/path">
        <span className="sub-icon">💰</span>
        <span className="sub-label">Menu Item</span>
      </a>
    </li>
  </ul>
</div>
```

### Utility Classes
- `.submenu-scroll-active`: Menandakan scroll aktif
- `.submenu-scroll-inactive`: Menandakan scroll tidak aktif

## Features

### 1. Centralized Management
- Semua styling sub menu dalam satu file
- Mudah diubah dan maintain
- Konsisten di seluruh aplikasi

### 2. Automatic Scroll Detection
- Scroll otomatis aktif ketika konten melebihi max-height
- Scrollbar hanya muncul ketika diperlukan

### 3. Responsive Design
- Height menyesuaikan ukuran layar
- Optimized untuk mobile dan tablet

### 4. Smooth Scrolling
- `scroll-behavior: smooth`
- Transisi halus saat scroll

### 5. Theme Integration
- Warna scrollbar sesuai tema aplikasi
- Konsisten dengan design system

## Maintenance

### Menambah Menu Baru
1. Tambahkan item di `Sidebar.js` dalam array `subItems`
2. CSS akan otomatis terapkan styling yang sama

### Mengubah Height Standard
1. Edit `styles/sidebar-submenu.css`
2. Ubah nilai `max-height` di `.submenu-container`
3. Sesuaikan responsive breakpoints jika diperlukan

### Mengubah Scrollbar Style
1. Edit `styles/sidebar-submenu.css`
2. Ubah properti scrollbar (width, color, border-radius)
3. Sesuaikan untuk webkit dan firefox

## Browser Support
- ✅ Chrome/Edge (Webkit scrollbar)
- ✅ Firefox (CSS scrollbar)
- ✅ Safari (Webkit scrollbar)
- ✅ Mobile browsers

## Performance
- CSS terpusat mengurangi file size
- Tidak ada JavaScript untuk scroll behavior
- Pure CSS solution untuk performa optimal 