# NEXMAX Dashboard - Handbook Dokumentasi

## 📖 Daftar Isi

1. [Overview Dashboard](#overview-dashboard)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Tahapan Build-up](#tahapan-build-up)
4. [Maintenance & Logic](#maintenance--logic)
5. [Settings & Configuration](#settings--configuration)
6. [File yang Boleh Diedit](#file-yang-boleh-diedit)
7. [File yang TIDAK BOLEH Diedit](#file-yang-tidak-boleh-diedit)
8. [Korelasi File](#korelasi-file)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## 🎯 Overview Dashboard

**NEXMAX Dashboard** adalah sistem analytics dan reporting yang komprehensif dengan:

### ✅ Features Utama:
- **Multi-User Role-Based Access Control** (Admin, Manager, Executive, Operator, User)
- **Real-time Data Analytics** dari PostgreSQL
- **Interactive Charts** menggunakan Chart.js
- **Responsive Design** untuk desktop dan mobile
- **Centralized Business Logic** untuk konsistensi data
- **Export Functionality** (CSV/JSON)

### 🏗️ Tech Stack:
- **Frontend**: Next.js 15.4.3, React
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Charts**: Chart.js
- **Styling**: CSS Modules + Inline Styles
- **Authentication**: Custom JWT-based auth

---

## 📚 File Dokumentasi:

1. **[build-process.md](./build-process.md)** - Tahapan lengkap build-up dashboard
2. **[maintenance-guide.md](./maintenance-guide.md)** - Cara maintain logic dan troubleshooting
3. **[settings-configuration.md](./settings-configuration.md)** - Adjustment settings dashboard
4. **[file-structure.md](./file-structure.md)** - Struktur file dan korelasi
5. **[edit-permissions.md](./edit-permissions.md)** - File yang boleh/tidak boleh diedit
6. **[business-logic.md](./business-logic.md)** - Dokumentasi business logic dan formula
7. **[deployment-guide.md](./deployment-guide.md)** - Guide untuk deployment production

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access dashboard
http://localhost:3000
```

## 🔐 Default Login:
- **Admin**: admin / admin123
- **Manager**: manager / manager123
- **Executive**: executive / exec123
- **Operator**: operator / oper123
- **User**: user / user123

---

## ⚠️ CRITICAL RULES

### 🔒 PRODUCTION-READY STATUS:
Dashboard ini sudah **PRODUCTION-READY** dengan semua core features completed dan locked.

### 🚫 TIDAK BOLEH DIUBAH tanpa permission:
- Sidebar design dan functionality
- Header layout dan styling  
- Sub Header size dan positioning
- Main Dashboard KPI cards dan charts
- Strategic Executive page layout
- Business Flow page structure
- Role-based access control logic
- Database connection dan query logic

### ✅ BOLEH DIUBAH dengan hati-hati:
- Content di pages yang belum developed (BGO, OS, SR, XOO, Transaction pages)
- Business logic constants di `lib/business-logic.js`
- Styling minor adjustments
- New features yang tidak mengubah existing functionality

---

**📝 Note**: Sebelum melakukan perubahan apapun, WAJIB backup dan test di development environment terlebih dahulu! 