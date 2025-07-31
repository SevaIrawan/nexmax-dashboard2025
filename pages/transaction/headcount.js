import { useState, useEffect } from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { formatDateDisplay, formatDateForInput, isDateColumn } from '../../utils/dateFormatter';

export default function Headcount() {
  const { user, loading: authLoading, canExportData, isReadOnly } = useRoleAccess('/transaction/headcount');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // SLICERS STATE
  const [month, setMonth] = useState('ALL');
  const [useDateRange, setUseDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // DATA STATES
  const [headcountData, setHeadcountData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 1000,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [slicerOptions, setSlicerOptions] = useState({
    months: [],
    dateRange: { min: '', max: '' }
  });
  const [loading, setLoading] = useState(true);
  const [slicerLoading, setSlicerLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // INPUT FORM STATES
  const [showInputForm, setShowInputForm] = useState(false);
  const [tableStructure, setTableStructure] = useState([]);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [structureLoading, setStructureLoading] = useState(false);

  // EDIT STATES
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);

  // DELETE STATES
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSlicerOptions();
    fetchHeadcountData();
  }, []);

  useEffect(() => {
    fetchHeadcountData();
  }, [month, dateRange, useDateRange, pagination.currentPage]);

  const fetchSlicerOptions = async () => {
    try {
      setSlicerLoading(true);
      const response = await fetch('/api/headcount/slicer-options');
      const result = await response.json();
      if (result.success) {
        setSlicerOptions(result.options);
      }
    } catch (error) {
      console.error('Error fetching slicer options:', error);
    } finally {
      setSlicerLoading(false);
    }
  };

  const fetchHeadcountData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        month,
        startDate: dateRange.start,
        endDate: dateRange.end,
        useDateRange: useDateRange.toString(),
        page: pagination.currentPage.toString(),
        limit: pagination.recordsPerPage.toString()
      });

      const response = await fetch(`/api/headcount/data?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setHeadcountData(result.data);
        setPagination(result.pagination);
      } else {
        console.error('Error fetching data:', result.error);
        setHeadcountData([]);
      }
    } catch (error) {
      console.error('Error fetching headcount data:', error);
      setHeadcountData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableStructure = async () => {
    try {
      setStructureLoading(true);
      const response = await fetch('/api/headcount/structure');
      const result = await response.json();
      if (result.success) {
        setTableStructure(result.columns);
        // Initialize form data with empty values
        const initialFormData = {};
        result.columns.forEach(col => {
          initialFormData[col.name] = '';
        });
        
        // Set default values for month and year based on current date
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
        const currentYear = currentDate.getFullYear().toString();
        
        initialFormData.month = currentMonth;
        initialFormData.year = currentYear;
        initialFormData.date = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Generate initial uniquekey
        const initialUniqueKey = generateUniqueKey(currentMonth, currentYear, '0', '0', '0');
        initialFormData.uniquekey = initialUniqueKey;
        
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('Error fetching table structure:', error);
    } finally {
      setStructureLoading(false);
    }
  };

  // AUTO GENERATE UNIQUEKEY
  const generateUniqueKey = (month, year, totalSgd, totalMyr, totalUsc) => {
    const monthName = month || 'Unknown';
    const yearValue = year || 'Unknown';
    const total = (parseInt(totalSgd) || 0) + (parseInt(totalMyr) || 0) + (parseInt(totalUsc) || 0);
    return `${monthName}-${yearValue}-${total}`;
  };

  // MONTH OPTIONS
  const monthOptions = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
  ];

  const handleFormChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    
    // Auto-fill month and year when date is selected
    if (field === 'date' && value) {
      const selectedDate = new Date(value);
      const monthName = selectedDate.toLocaleString('en-US', { month: 'long' });
      const year = selectedDate.getFullYear();
      
      newFormData.month = monthName;
      newFormData.year = year.toString();
    }
    
    // Auto-generate uniqueKey when month, year, or totals change
    if (field === 'month' || field === 'year' || field.includes('total') || field === 'date' || 
        field === 'css_sgd' || field === 'css_myr' || field === 'css_usc' ||
        field === 'sr_sgd' || field === 'sr_myr' || field === 'sr_usc' ||
        field === 'cashier_sgd' || field === 'cashier_myr' || field === 'cashier_usc') {
      const month = field === 'month' ? value : newFormData.month;
      const year = field === 'year' ? value : newFormData.year;
      const totalSgd = newFormData.total_sgd || newFormData['total sgd'] || '0';
      const totalMyr = newFormData.total_myr || newFormData['total myr'] || '0';
      const totalUsc = newFormData.total_usc || newFormData['total usc'] || '0';
      
      if (month && year) {
        const uniqueKey = generateUniqueKey(month, year, totalSgd, totalMyr, totalUsc);
        newFormData.uniquekey = uniqueKey;
        console.log('🔄 Generated uniquekey:', uniqueKey, 'for month:', month, 'year:', year, 'totals:', { totalSgd, totalMyr, totalUsc });
      }
    }
    
    setFormData(newFormData);
  };

  const handleInputClick = async () => {
    if (!showInputForm) {
      await fetchTableStructure();
    }
    setShowInputForm(!showInputForm);
  };

  const handleSave = async () => {
    if (!canExportData) {
      alert('You do not have permission to save data');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/headcount/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Data saved successfully!');
        setShowInputForm(false);
        setFormData({});
        fetchHeadcountData(); // Refresh data
      } else {
        alert(`Save failed: ${result.error || 'Unknown error'}`);
        if (result.missingFields) {
          alert(`Missing required fields: ${result.missingFields.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // EDIT FUNCTIONS
  const handleEditClick = (rowIndex) => {
    setEditingRow(rowIndex);
    setEditData({ ...headcountData[rowIndex] });
  };

  const handleEditChange = (field, value) => {
    // Hanya izinkan edit untuk date dan field value (total_sgd, total_myr, total_usc, css_sgd, css_myr, css_usc, sr_sgd, sr_myr, sr_usc, cashier_sgd, cashier_myr, cashier_usc)
    const editableFields = ['date', 'total_sgd', 'total_myr', 'total_usc', 'css_sgd', 'css_myr', 'css_usc', 'sr_sgd', 'sr_myr', 'sr_usc', 'cashier_sgd', 'cashier_myr', 'cashier_usc'];
    
    if (!editableFields.includes(field)) {
      return; // Tidak izinkan edit field lain
    }
    
    const newEditData = { ...editData, [field]: value };
    
    // Auto-fill month and year when date is selected in edit mode
    if (field === 'date' && value) {
      const selectedDate = new Date(value);
      const monthName = selectedDate.toLocaleString('en-US', { month: 'long' });
      const year = selectedDate.getFullYear();
      
      newEditData.month = monthName;
      newEditData.year = year.toString();
    }
    
    // Auto-generate uniqueKey when date, year, or totals change in edit mode
    if (field === 'date' || field === 'year' || field.includes('total') || field.includes('css_') || field.includes('sr_') || field.includes('cashier_')) {
      const month = newEditData.month;
      const year = newEditData.year;
      const totalSgd = newEditData.total_sgd || newEditData['total sgd'] || '0';
      const totalMyr = newEditData.total_myr || newEditData['total myr'] || '0';
      const totalUsc = newEditData.total_usc || newEditData['total usc'] || '0';
      
      if (month && year) {
        const uniqueKey = generateUniqueKey(month, year, totalSgd, totalMyr, totalUsc);
        newEditData.uniquekey = uniqueKey;
      }
    }
    
    setEditData(newEditData);
  };

  const handleEditSave = async () => {
    if (!canExportData) {
      alert('You do not have permission to edit data');
      return;
    }

    try {
      setUpdating(true);
      
      // Pastikan data lengkap sebelum update
      const month = editData.month;
      const year = editData.year;
      const totalSgd = editData.total_sgd || editData['total sgd'] || '0';
      const totalMyr = editData.total_myr || editData['total myr'] || '0';
      const totalUsc = editData.total_usc || editData['total usc'] || '0';
      
      // Generate uniquekey baru
      const generatedUniqueKey = generateUniqueKey(month, year, totalSgd, totalMyr, totalUsc);
      
      // Get original uniquekey for WHERE clause
      const originalRow = headcountData[editingRow];
      const originalUniqueKey = originalRow.uniquekey;
      
      // Check if new uniquekey already exists (excluding current row)
      const isDuplicate = headcountData.some((row, index) => 
        index !== editingRow && row.uniquekey === generatedUniqueKey
      );
      
      if (isDuplicate) {
        alert('Error: Unique Duplicated! Data dengan kombinasi Month + Year + Total sudah ada. Format uniquekey: Month-Year-Total. Silakan ubah data atau pilih date yang berbeda.');
        return;
      }
      
      // Prepare data untuk update
      const updateData = {
        ...editData,
        uniquekey: generatedUniqueKey,
        month: month,
        year: year
      };
      
      console.log('Sending update data:', updateData);
      console.log('Original uniquekey:', originalUniqueKey);
      console.log('New uniquekey:', generatedUniqueKey);
      
      const response = await fetch('/api/headcount/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueKey: generatedUniqueKey, // New uniquekey to update
          data: {
            ...updateData,
            originalUniquekey: originalUniqueKey // Original uniquekey for WHERE clause
          }
        }),
      });

      const result = await response.json();
      console.log('Update response:', result);
      
      if (result.success) {
        alert('Data updated successfully!');
        setEditingRow(null);
        setEditData({});
        fetchHeadcountData(); // Refresh data
      } else {
        if (result.error && result.error.includes('duplicate')) {
          alert('Error: Unique Duplicated! Data dengan kombinasi Month + Year + Total sudah ada. Silakan ubah data atau pilih date yang berbeda.');
        } else {
          alert(`Update failed: ${result.error || 'Unknown error'}`);
        }
        if (result.missingFields) {
          alert(`Missing required fields: ${result.missingFields.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setEditingRow(null);
    setEditData({});
  };

  // DELETE FUNCTIONS
  const handleDeleteClick = (rowIndex) => {
    if (!canExportData) {
      alert('You do not have permission to delete data');
      return;
    }
    
    const row = headcountData[rowIndex];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this record?\n\n` +
      `Date: ${formatDateDisplay(row.date)}\n` +
      `Month: ${row.month}\n` +
      `Year: ${row.year}\n` +
      `Unique Key: ${row.uniquekey} (Month-Year-Total)\n\n` +
      `This action cannot be undone.`
    );
    
    if (confirmDelete) {
      handleDelete(rowIndex);
    }
  };

  const handleDelete = async (rowIndex) => {
    if (!canExportData) {
      alert('You do not have permission to delete data');
      return;
    }

    try {
      setDeleting(true);
      setDeletingRow(rowIndex);
      
      const row = headcountData[rowIndex];
      console.log('🗑️ Deleting record:', row.uniquekey);
      
      const response = await fetch('/api/headcount/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniquekey: row.uniquekey
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Record deleted successfully!');
        fetchHeadcountData(); // Refresh data
      } else {
        alert(`Delete failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed. Please try again.');
    } finally {
      setDeleting(false);
      setDeletingRow(null);
    }
  };

  // HANDLE DATE RANGE FUNCTIONS
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleDateRangeToggle = (checked) => {
    setUseDateRange(checked);
    if (checked) {
      setMonth('ALL'); // Clear month when date range is active
    } else {
      setDateRange({ start: '', end: '' }); // Clear date range when month is active
    }
  };

  const handleExport = async () => {
    if (!canExportData) {
      alert('You do not have permission to export data');
      return;
    }

    try {
      setExporting(true);
      const response = await fetch('/api/headcount/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month,
          startDate: dateRange.start,
          endDate: dateRange.end,
          useDateRange
        }),
      });

      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Get filename from response headers
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition 
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : 'headcount_data_export.xlsx';
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(`Export failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      <div className={`dashboard-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          title="Headcount Report"
          user={user}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />

        {/* SUB HEADER WITH SLICERS - STANDARD SIZE - NO SCROLL */}
        <div style={{
          position: 'fixed',
          top: '85px',
          left: sidebarExpanded ? '0px' : '0px',
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
          overflow: 'hidden'
        }}>
          <div style={{ 
            margin: 0, 
            fontSize: '1.2rem', 
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Filter & Actions ({pagination.totalRecords.toLocaleString()} records)
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* MONTH SLICER */}
            <select 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
              disabled={useDateRange}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: useDateRange ? '#f3f4f6' : 'white',
                color: useDateRange ? '#9ca3af' : '#000',
                cursor: useDateRange ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="ALL">All Months</option>
              {slicerOptions.months.map(mo => (
                <option key={mo.value} value={mo.value}>{mo.label}</option>
              ))}
            </select>

            {/* DATE RANGE TOGGLE CHECKBOX */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white'
            }}>
              <input
                type="checkbox"
                checked={useDateRange}
                onChange={(e) => handleDateRangeToggle(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer'
                }}
              />
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                Range Date
              </label>
            </div>

            {/* DATE RANGE SLICERS - DISABLED IF MONTH ACTIVE */}
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              disabled={!useDateRange}
              min={slicerOptions.dateRange.min}
              max={slicerOptions.dateRange.max}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                backgroundColor: useDateRange ? 'white' : '#f3f4f6',
                color: useDateRange ? '#000' : '#9ca3af',
                cursor: useDateRange ? 'pointer' : 'not-allowed'
              }}
            />

            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              disabled={!useDateRange}
              min={dateRange.start || slicerOptions.dateRange.min}
              max={slicerOptions.dateRange.max}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                backgroundColor: useDateRange ? 'white' : '#f3f4f6',
                color: useDateRange ? '#000' : '#9ca3af',
                cursor: useDateRange ? 'pointer' : 'not-allowed'
              }}
            />

            {/* INPUT BUTTON */}
            <button
              onClick={handleInputClick}
              disabled={isReadOnly}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: isReadOnly ? '#f3f4f6' : '#3b82f6',
                color: isReadOnly ? '#9ca3af' : 'white',
                cursor: isReadOnly ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {showInputForm ? '❌ Cancel' : '➕ Input Data'}
            </button>

            {/* EXPORT BUTTON */}
            <button
              onClick={handleExport}
              disabled={isReadOnly || !canExportData || exporting || headcountData.length === 0}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: isReadOnly || !canExportData || headcountData.length === 0 ? '#f3f4f6' : '#10b981',
                color: isReadOnly || !canExportData || headcountData.length === 0 ? '#9ca3af' : 'white',
                cursor: isReadOnly || !canExportData || headcountData.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {exporting ? '⏳ Exporting...' : '📥 Export Excel'}
            </button>
          </div>
        </div>

        {/* CONTENT - DATA TABLE WITH SCROLL ONLY FOR CONTENT */}
        <div style={{ 
          marginTop: '185px',
          marginLeft: sidebarExpanded ? '0px' : '0px',
          padding: '20px',
          height: 'calc(100vh - 185px)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
              fontSize: '18px',
              color: '#6b7280'
            }}>
              Loading headcount data...
            </div>
          ) : headcountData.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ fontSize: '48px' }}>📭</div>
              <div style={{ fontSize: '18px', color: '#6b7280' }}>
                No headcount data found for the selected filters
              </div>
            </div>
          ) : (
            <div className="data-table-container">
              <div className="table-header">
                <h2>Headcount Data (Page {pagination.currentPage} of {pagination.totalPages})</h2>
                <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                  Showing {headcountData.length} of {pagination.totalRecords.toLocaleString()} records
                </p>
              </div>
              
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {headcountData.length > 0 && Object.keys(headcountData[0]).map((column, index) => (
                        <th key={index}>{column.replace(/_/g, ' ').toUpperCase()}</th>
                      ))}
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headcountData.map((row, rowIndex) => (
                      <tr key={rowIndex} className={editingRow === rowIndex ? 'editing-row' : ''}>
                        {Object.keys(row).map((column, colIndex) => (
                          <td key={colIndex}>
                            {editingRow === rowIndex ? (
                              column === 'date' ? (
                                <input
                                  type="date"
                                  value={editData[column] || ''}
                                  onChange={(e) => handleEditChange(column, e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                />
                              ) : column === 'year' || column === 'month' || column === 'uniquekey' ? (
                                <span style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#f9fafb',
                                  color: '#6b7280',
                                  fontSize: '14px',
                                  borderRadius: '4px',
                                  display: 'inline-block',
                                  width: '100%'
                                }}>
                                  {isDateColumn(column) 
                                    ? formatDateDisplay(row[column])
                                    : row[column] !== null && row[column] !== undefined 
                                      ? String(row[column]) 
                                      : '-'
                                  }
                                </span>
                              ) : column === 'css_sgd' || column === 'css_myr' || column === 'css_usc' || 
                                    column === 'sr_sgd' || column === 'sr_myr' || column === 'sr_usc' || 
                                    column === 'cashier_sgd' || column === 'cashier_myr' || column === 'cashier_usc' ||
                                    column === 'total_sgd' || column === 'total_myr' || column === 'total_usc' ? (
                                <input
                                  type="text"
                                  value={editData[column] || ''}
                                  onChange={(e) => handleEditChange(column, e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                />
                              ) : (
                                <span style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#f9fafb',
                                  color: '#6b7280',
                                  fontSize: '14px',
                                  borderRadius: '4px',
                                  display: 'inline-block',
                                  width: '100%'
                                }}>
                                  {row[column] !== null && row[column] !== undefined 
                                    ? String(row[column]) 
                                    : '-'
                                  }
                                </span>
                              )
                            ) : (
                              <span>
                                {isDateColumn(column) 
                                  ? formatDateDisplay(row[column])
                                  : row[column] !== null && row[column] !== undefined 
                                    ? String(row[column]) 
                                    : '-'
                                }
                              </span>
                            )}
                          </td>
                        ))}
                        <td>
                          {editingRow === rowIndex ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={handleEditSave}
                                disabled={updating}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  cursor: updating ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {updating ? '⏳' : '💾'}
                              </button>
                              <button
                                onClick={handleEditCancel}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  cursor: 'pointer'
                                }}
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleEditClick(rowIndex)}
                                disabled={isReadOnly}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: isReadOnly ? '#f3f4f6' : '#3b82f6',
                                  color: isReadOnly ? '#9ca3af' : 'white',
                                  cursor: isReadOnly ? 'not-allowed' : 'pointer'
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteClick(rowIndex)}
                                disabled={isReadOnly || !canExportData || deletingRow === rowIndex}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: isReadOnly || !canExportData ? '#f3f4f6' : '#ef4444',
                                  color: isReadOnly || !canExportData ? '#9ca3af' : 'white',
                                  cursor: isReadOnly || !canExportData || deletingRow === rowIndex ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {deletingRow === rowIndex ? '⏳' : '🗑️'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              {pagination.totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={!pagination.hasPrevPage}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={!pagination.hasNextPage}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Input Form Modal */}
          {showInputForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                maxWidth: '1000px',
                width: '90%',
                maxHeight: '85vh',
                overflowY: 'auto',
                zIndex: 10000
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '15px'
                }}>
                  <h3 style={{ margin: 0, color: '#1f2937', fontSize: '20px', fontWeight: '600' }}>
                    ➕ Add New Headcount Data
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <label style={{
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      margin: 0
                    }}>
                      DATE *
                    </label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                      required
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '13px',
                        width: '150px',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.outline = 'none';
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      onClick={() => setShowInputForm(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#ef4444'}
                      onMouseOut={(e) => e.target.style.color = '#6b7280'}
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="modal-body">
                  {structureLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      Loading form structure...
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                      {/* SGD Column */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        marginBottom: '30px'
                      }}>
                        <div>
                          <h4 style={{
                            margin: '0 0 15px 0',
                            color: '#1f2937',
                            fontSize: '16px',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: '8px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '6px'
                          }}>
                            SGD
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {['css_sgd', 'sr_sgd', 'cashier_sgd', 'total_sgd'].map((field) => (
                              <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{
                                  fontWeight: '600',
                                  color: '#374151',
                                  fontSize: '12px',
                                  minWidth: '80px',
                                  margin: 0
                                }}>
                                  {field.replace(/_/g, ' ').toUpperCase()} *
                                </label>
                                <input
                                  type="text"
                                  value={formData[field] || ''}
                                  onChange={(e) => handleFormChange(field, e.target.value)}
                                  required
                                  placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                                  style={{
                                    padding: '8px 10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    flex: 1,
                                    transition: 'border-color 0.2s ease'
                                  }}
                                  onFocus={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* MYR Column */}
                        <div>
                          <h4 style={{
                            margin: '0 0 15px 0',
                            color: '#1f2937',
                            fontSize: '16px',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: '8px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '6px'
                          }}>
                            MYR
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {['css_myr', 'sr_myr', 'cashier_myr', 'total_myr'].map((field) => (
                              <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{
                                  fontWeight: '600',
                                  color: '#374151',
                                  fontSize: '12px',
                                  minWidth: '80px',
                                  margin: 0
                                }}>
                                  {field.replace(/_/g, ' ').toUpperCase()} *
                                </label>
                                <input
                                  type="text"
                                  value={formData[field] || ''}
                                  onChange={(e) => handleFormChange(field, e.target.value)}
                                  required
                                  placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                                  style={{
                                    padding: '8px 10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    flex: 1,
                                    transition: 'border-color 0.2s ease'
                                  }}
                                  onFocus={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* USC Column */}
                        <div>
                          <h4 style={{
                            margin: '0 0 15px 0',
                            color: '#1f2937',
                            fontSize: '16px',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: '8px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '6px'
                          }}>
                            USC
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {['css_usc', 'sr_usc', 'cashier_usc', 'total_usc'].map((field) => (
                              <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{
                                  fontWeight: '600',
                                  color: '#374151',
                                  fontSize: '12px',
                                  minWidth: '80px',
                                  margin: 0
                                }}>
                                  {field.replace(/_/g, ' ').toUpperCase()} *
                                </label>
                                <input
                                  type="text"
                                  value={formData[field] || ''}
                                  onChange={(e) => handleFormChange(field, e.target.value)}
                                  required
                                  placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                                  style={{
                                    padding: '8px 10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    flex: 1,
                                    transition: 'border-color 0.2s ease'
                                  }}
                                  onFocus={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #0ea5e9',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '15px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#0369a1',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          <span>ℹ️</span>
                          <span>YEAR, MONTH, dan UNIQUEKEY akan otomatis terisi berdasarkan DATE dan TOTAL yang Anda input. Format: Month-Year-Total</span>
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '15px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#92400e',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          <span>✏️</span>
                          <span>Dalam mode edit, hanya DATE yang bisa diubah. YEAR, MONTH, dan UNIQUEKEY akan otomatis update</span>
                        </div>
                      </div>
                      
                      {/* UNIQUEKEY DISPLAY */}
                      <div style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #22c55e',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '15px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          color: '#166534',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          <span>🔑</span>
                          <span>Generated UniqueKey:</span>
                          <span style={{
                            backgroundColor: '#dcfce7',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#166534',
                            border: '1px solid #bbf7d0'
                          }}>
                            {formData.uniquekey || 'Generating...'}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '20px'
                      }}>
                        <button
                          type="button"
                          onClick={() => setShowInputForm(false)}
                          style={{
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#374151',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#f9fafb';
                            e.target.style.borderColor = '#9ca3af';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.borderColor = '#d1d5db';
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: saving ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            if (!saving) {
                              e.target.style.backgroundColor = '#2563eb';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!saving) {
                              e.target.style.backgroundColor = '#3b82f6';
                            }
                          }}
                        >
                          💾 Save Data
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
          overflow: hidden;
        }
        
        .dashboard-content {
          flex: 1;
          transition: margin-left 0.3s ease;
          overflow: hidden;
        }
        
        .sidebar-expanded {
          margin-left: 280px;
        }
        
        .sidebar-collapsed {
          margin-left: 75px;
        }

        .data-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .table-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .table-wrapper {
          overflow: auto;
          height: calc(100vh - 400px);
          max-height: calc(100vh - 400px);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .data-table thead {
          position: sticky;
          top: 0;
          background: #f9fafb;
          z-index: 10;
        }

        .data-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          white-space: nowrap;
          background: #f9fafb;
        }

        .data-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          color: #1f2937;
          white-space: nowrap;
        }

        .data-table tbody tr:hover {
          background: #f9fafb;
        }

        .data-table tbody tr:nth-child(even) {
          background: #fafafa;
        }

        .data-table tbody tr:nth-child(even):hover {
          background: #f0f0f0;
        }

        .editing-row {
          background: #fef3c7 !important;
        }

        .editing-row:hover {
          background: #fde68a !important;
        }

        /* Pagination Controls */
        .pagination-controls {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .pagination-btn {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .pagination-btn:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .pagination-info {
          font-weight: 500;
          color: #6b7280;
          font-size: 14px;
        }

        

        /* Scrollbar styling */
        .table-wrapper::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .table-wrapper::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .table-wrapper::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        @media (max-width: 768px) {
          .table-wrapper {
            height: calc(100vh - 450px);
            max-height: calc(100vh - 450px);
          }
          
          .data-table th,
          .data-table td {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
} 