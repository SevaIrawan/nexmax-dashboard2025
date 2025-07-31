import { useState, useEffect } from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { formatDateDisplay, formatDateForInput, isDateColumn } from '../../utils/dateFormatter';

export default function MemberReport() {
  const { user, loading: authLoading, canExportData, isReadOnly } = useRoleAccess('/transaction/member-report');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // SLICERS STATE
  const [currency, setCurrency] = useState('ALL');
  const [line, setLine] = useState('ALL');
  const [year, setYear] = useState('ALL');
  const [month, setMonth] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterMode, setFilterMode] = useState('month'); // 'month' or 'daterange'
  const [useDateRange, setUseDateRange] = useState(false);

  // DATA STATES
  const [memberReportData, setMemberReportData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 1000,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [slicerOptions, setSlicerOptions] = useState({
    currencies: [],
    lines: [],
    years: [],
    months: [],
    dateRange: { min: '', max: '' }
  });
  const [loading, setLoading] = useState(true);
  const [slicerLoading, setSlicerLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSlicerOptions();
    fetchMemberReportData();
  }, []);

  useEffect(() => {
    fetchSlicerOptions();
  }, [currency]);

  useEffect(() => {
    fetchMemberReportData();
  }, [currency, line, year, month, dateRange, filterMode, pagination.currentPage]);

  const fetchSlicerOptions = async () => {
    try {
      setSlicerLoading(true);
      const params = new URLSearchParams();
      if (currency && currency !== 'ALL') {
        params.append('selectedCurrency', currency);
      }
      
      const response = await fetch(`/api/member-report/slicer-options?${params}`);
      const result = await response.json();
      if (result.success) {
        setSlicerOptions(result.options);
        
        // Reset line selection if current line is not available in new options
        if (line !== 'ALL' && !result.options.lines.includes(line)) {
          setLine('ALL');
        }
      }
    } catch (error) {
      console.error('Error fetching slicer options:', error);
    } finally {
      setSlicerLoading(false);
    }
  };

  const fetchMemberReportData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        currency,
        line,
        year,
        month,
        startDate: dateRange.start,
        endDate: dateRange.end,
        filterMode,
        page: pagination.currentPage.toString(),
        limit: pagination.recordsPerPage.toString()
      });

      const response = await fetch(`/api/member-report/data?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setMemberReportData(result.data);
        setPagination(result.pagination);
      } else {
        console.error('Error fetching data:', result.error);
        setMemberReportData([]);
      }
    } catch (error) {
      console.error('Error fetching member report data:', error);
      setMemberReportData([]);
    } finally {
      setLoading(false);
    }
  };

  // HANDLE MONTH SELECTION
  const handleMonthChange = (selectedMonth) => {
    setMonth(selectedMonth);
    setFilterMode('month');
    setDateRange({ start: '', end: '' }); // Clear date range
    setUseDateRange(false); // Uncheck date range
  };

  // HANDLE DATE RANGE SELECTION
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
    if (value) {
      setFilterMode('daterange');
      setMonth(''); // Clear month
    }
  };

  // HANDLE DATE RANGE TOGGLE
  const handleDateRangeToggle = (checked) => {
    setUseDateRange(checked);
    if (checked) {
      setFilterMode('daterange');
      setMonth(''); // Clear month
    } else {
      setFilterMode('month');
      setDateRange({ start: '', end: '' }); // Clear date range
    }
  };

  // EXPORT FUNCTION
  const handleExport = async () => {
    if (!canExportData) {
      alert('You do not have permission to export data');
      return;
    }

    try {
      setExporting(true);
      const response = await fetch('/api/member-report/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency,
          line,
          year,
          month,
          startDate: dateRange.start,
          endDate: dateRange.end,
          filterMode
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
          : 'member_report_export.xlsx';
        
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
          title="Member Report"
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
            {/* CURRENCY SLICER */}
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Currencies</option>
              {slicerOptions.currencies.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>

            {/* LINE SLICER */}
            <select 
              value={line} 
              onChange={(e) => setLine(e.target.value)}
              disabled={currency === 'ALL' || slicerLoading}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: currency === 'ALL' || slicerLoading ? '#f3f4f6' : 'white',
                color: currency === 'ALL' || slicerLoading ? '#9ca3af' : '#000',
                cursor: currency === 'ALL' || slicerLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="ALL">
                {currency === 'ALL' ? 'Select Currency First' : slicerLoading ? 'Loading...' : 'All Lines'}
              </option>
              {slicerOptions.lines.map(ln => (
                <option key={ln} value={ln}>{ln}</option>
              ))}
            </select>

            {/* YEAR SLICER */}
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Years</option>
              {slicerOptions.years.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>

            {/* MONTH SLICER - DISABLED IF DATE RANGE ACTIVE */}
            <select 
              value={month} 
              onChange={(e) => handleMonthChange(e.target.value)}
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
              <option value="">Select Month</option>
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
                Date Range
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
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
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

            {/* EXPORT BUTTON */}
            <button
              onClick={handleExport}
              disabled={isReadOnly || !canExportData || exporting || memberReportData.length === 0}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: isReadOnly || !canExportData || memberReportData.length === 0 ? '#f3f4f6' : '#10b981',
                color: isReadOnly || !canExportData || memberReportData.length === 0 ? '#9ca3af' : 'white',
                cursor: isReadOnly || !canExportData || memberReportData.length === 0 ? 'not-allowed' : 'pointer',
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
              Loading member report data...
            </div>
          ) : memberReportData.length === 0 ? (
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
                No member report data found for the selected filters
              </div>
            </div>
          ) : (
            <div className="data-table-container">
              <div className="table-header">
                <h2>Member Report Data (Page {pagination.currentPage} of {pagination.totalPages})</h2>
                <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                  Showing {memberReportData.length} of {pagination.totalRecords.toLocaleString()} records
                </p>
              </div>
              
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {memberReportData.length > 0 && Object.keys(memberReportData[0]).map((column, index) => (
                        <th key={index}>{column.replace(/_/g, ' ').toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {memberReportData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                                                 {Object.entries(row).map(([column, value], colIndex) => (
                           <td key={colIndex}>
                             {isDateColumn(column) 
                               ? formatDateDisplay(value)
                               : value !== null && value !== undefined 
                                 ? String(value) 
                                 : '-'
                             }
                           </td>
                         ))}
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