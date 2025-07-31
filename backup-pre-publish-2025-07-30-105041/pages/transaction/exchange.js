import { useState, useEffect, useCallback } from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { formatDateDisplay, formatDateForInput, isDateColumn } from '../../utils/dateFormatter';

export default function Exchange() {
  const { user, loading: authLoading, canExportData, isReadOnly } = useRoleAccess('/transaction/exchange');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // SLICERS STATE
  const [month, setMonth] = useState('ALL');
  const [useDateRange, setUseDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // DATA STATES
  const [exchangeData, setExchangeData] = useState([]);
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

  const fetchSlicerOptions = useCallback(async () => {
    try {
      setSlicerLoading(true);
      const response = await fetch('/api/exchange/slicer-options');
      const result = await response.json();
      if (result.success) {
        setSlicerOptions(result.options);
      }
    } catch (error) {
      console.error('Error fetching slicer options:', error);
    } finally {
      setSlicerLoading(false);
    }
  }, []);

  const fetchExchangeData = useCallback(async () => {
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

      const response = await fetch(`/api/exchange/data?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setExchangeData(result.data);
        setPagination(result.pagination);
      } else {
        console.error('Error fetching data:', result.error);
        setExchangeData([]);
      }
    } catch (error) {
      console.error('Error fetching exchange data:', error);
      setExchangeData([]);
    } finally {
      setLoading(false);
    }
  }, [month, dateRange, useDateRange, pagination.currentPage, pagination.recordsPerPage]);

  useEffect(() => {
    fetchSlicerOptions();
    fetchExchangeData();
  }, [fetchSlicerOptions, fetchExchangeData]);

  useEffect(() => {
    fetchExchangeData();
  }, [month, dateRange, useDateRange, pagination.currentPage, fetchExchangeData]);



  // AUTO GENERATE UNIQUEKEY
  const generateUniqueKey = (date, totalSgdToMyr, usdToMyr) => {
    const dateStr = date || 'Unknown';
    const sgdToMyr = totalSgdToMyr || '0';
    const usdToMyrValue = usdToMyr || '0';
    return `${dateStr}-${sgdToMyr}-${usdToMyrValue}`;
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

  const fetchTableStructure = async () => {
    try {
      setStructureLoading(true);
      const response = await fetch('/api/exchange/structure');
      const result = await response.json();
      if (result.success) {
        setTableStructure(result.columns);
        // Initialize form data with empty values
        const initialFormData = {};
        result.columns.forEach(col => {
          initialFormData[col.name] = '';
        });
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('Error fetching table structure:', error);
    } finally {
      setStructureLoading(false);
    }
  };

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
    
    // Auto-generate uniqueKey when date or value fields change
    if (field === 'date' || field === 'total_sgd_to_myr' || field === 'usd_to_myr') {
      const date = field === 'date' ? value : newFormData.date;
      const totalSgdToMyr = newFormData.total_sgd_to_myr || '0';
      const usdToMyr = newFormData.usd_to_myr || '0';
      
      if (date) {
        const uniqueKey = generateUniqueKey(date, totalSgdToMyr, usdToMyr);
        newFormData.uniquekey = uniqueKey;
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
      const response = await fetch('/api/exchange/save', {
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
        fetchExchangeData(); // Refresh data
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
    setEditData({ ...exchangeData[rowIndex] });
  };

  const handleEditChange = (field, value) => {
    // Hanya izinkan edit untuk date dan field value (total_sgd_to_myr, usd_to_myr)
    const editableFields = ['date', 'total_sgd_to_myr', 'usd_to_myr'];
    
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
    
    // Auto-generate uniqueKey when date or value fields change in edit mode
    if (field === 'date' || field === 'total_sgd_to_myr' || field === 'usd_to_myr') {
      const date = newEditData.date;
      const totalSgdToMyr = newEditData.total_sgd_to_myr || '0';
      const usdToMyr = newEditData.usd_to_myr || '0';
      
      if (date) {
        const uniqueKey = generateUniqueKey(date, totalSgdToMyr, usdToMyr);
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
      const date = editData.date;
      const totalSgdToMyr = editData.total_sgd_to_myr || '0';
      const usdToMyr = editData.usd_to_myr || '0';
      
      // Generate uniquekey baru
      const generatedUniqueKey = generateUniqueKey(date, totalSgdToMyr, usdToMyr);
      
      // Get original uniquekey for WHERE clause
      const originalRow = exchangeData[editingRow];
      const originalUniqueKey = originalRow.uniquekey;
      
      // Check if new uniquekey already exists (excluding current row)
      const isDuplicate = exchangeData.some((row, index) => 
        index !== editingRow && row.uniquekey === generatedUniqueKey
      );
      
      if (isDuplicate) {
        alert('Error: Unique Duplicated! Data dengan kombinasi Date + Total SGD to MYR + USD to MYR sudah ada. Silakan ubah data atau pilih kombinasi yang berbeda.');
        return;
      }
      
      // Prepare data untuk update
      const updateData = {
        ...editData,
        uniquekey: generatedUniqueKey
      };
      
      console.log('Sending update data:', updateData);
      console.log('Original uniquekey:', originalUniqueKey);
      console.log('New uniquekey:', generatedUniqueKey);
      
      const response = await fetch('/api/exchange/update', {
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
        fetchExchangeData(); // Refresh data
      } else {
        if (result.error && result.error.includes('duplicate')) {
          alert('Error: Unique Duplicated! Data dengan kombinasi Date + Total SGD to MYR + USD to MYR sudah ada. Silakan ubah data atau pilih kombinasi yang berbeda.');
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

  // EXPORT FUNCTION
  const handleExport = async () => {
    if (!canExportData) {
      alert('You do not have permission to export data');
      return;
    }

    try {
      setExporting(true);
      const response = await fetch('/api/exchange/export', {
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
          : 'exchange_daily_export.xlsx';
        
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
          title="Exchange Transactions"
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
            Filter & Export ({pagination.totalRecords.toLocaleString()} records)
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
                onChange={(e) => setUseDateRange(e.target.checked)}
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
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              disabled={!useDateRange}
              min={slicerOptions.dateRange.min}
              max={slicerOptions.dateRange.max}
              placeholder="Start Date"
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: !useDateRange ? '#f3f4f6' : 'white',
                color: !useDateRange ? '#9ca3af' : '#000',
                cursor: !useDateRange ? 'not-allowed' : 'pointer'
              }}
            />

            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              disabled={!useDateRange}
              min={slicerOptions.dateRange.min}
              max={slicerOptions.dateRange.max}
              placeholder="End Date"
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: !useDateRange ? '#f3f4f6' : 'white',
                color: !useDateRange ? '#9ca3af' : '#000',
                cursor: !useDateRange ? 'not-allowed' : 'pointer'
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
              disabled={isReadOnly || !canExportData || exporting || exchangeData.length === 0}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: isReadOnly || !canExportData || exchangeData.length === 0 ? '#f3f4f6' : '#10b981',
                color: isReadOnly || !canExportData || exchangeData.length === 0 ? '#9ca3af' : 'white',
                cursor: isReadOnly || !canExportData || exchangeData.length === 0 ? 'not-allowed' : 'pointer',
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
              Loading exchange data...
            </div>
          ) : exchangeData.length === 0 ? (
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
                No exchange data found for the selected filters
              </div>
            </div>
          ) : (
            <div className="data-table-container">
              <div className="table-header">
                <h2>Exchange Daily Data (Page {pagination.currentPage} of {pagination.totalPages})</h2>
                <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                  Showing {exchangeData.length} of {pagination.totalRecords.toLocaleString()} records
                </p>
              </div>
              
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {exchangeData.length > 0 && Object.keys(exchangeData[0]).map((column, index) => (
                        <th key={index}>{column.replace(/_/g, ' ').toUpperCase()}</th>
                      ))}
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exchangeData.map((row, rowIndex) => (
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
                              ) : column === 'total_sgd_to_myr' || column === 'usd_to_myr' ? (
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
        </div>

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
              maxWidth: '800px',
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
                  ➕ Add New Exchange Data
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
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
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
                          Basic Info
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {['currency'].map((field) => (
                            <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <label style={{
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '12px',
                                minWidth: '80px',
                                margin: 0
                              }}>
                                {field.toUpperCase()} *
                              </label>
                              <input
                                type="text"
                                value={formData[field] || ''}
                                onChange={(e) => handleFormChange(field, e.target.value)}
                                required
                                placeholder={`Enter ${field}`}
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
                          Amount & Rate
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {['rate'].map((field) => (
                            <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <label style={{
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '12px',
                                minWidth: '80px',
                                margin: 0
                              }}>
                                {field.toUpperCase()} *
                              </label>
                              <input
                                type="text"
                                value={formData[field] || ''}
                                onChange={(e) => handleFormChange(field, e.target.value)}
                                required
                                placeholder={`Enter ${field}`}
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
                        <span>YEAR, MONTH, dan UNIQUEKEY akan otomatis terisi berdasarkan DATE dan CURRENCY yang Anda input</span>
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
                        <span>Dalam mode edit, hanya DATE, CURRENCY, dan RATE yang bisa diubah. YEAR, MONTH, dan UNIQUEKEY akan otomatis update</span>
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