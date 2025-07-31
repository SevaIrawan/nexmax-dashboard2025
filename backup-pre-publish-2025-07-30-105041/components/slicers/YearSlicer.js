// CENTRALIZED YEAR SLICER - KONSISTEN UNTUK SEMUA PAGE  
export default function YearSlicer({ 
  selectedYear, 
  onYearChange, 
  availableYears = ['2024', '2025'], 
  label = "Year",
  // BACKWARD COMPATIBILITY
  value,
  onChange
}) {
  // Use new props if available, otherwise fallback to old props
  const yearValue = selectedYear !== undefined ? selectedYear : value;
  const yearOnChange = onYearChange !== undefined ? onYearChange : onChange;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-end',
      minWidth: '80px'
    }}>
      <label style={{ 
        fontSize: '12px', 
        color: '#6b7280', 
        marginBottom: '4px',
        fontWeight: '500'
      }}>
        {label}
      </label>
      <select
        value={yearValue}
        onChange={(e) => yearOnChange(e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: 'white',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          width: '100%'
        }}
        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
      >
        {/* Show "All" option only for new format */}
        {selectedYear !== undefined && <option value="All">All Years</option>}
        {availableYears.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
} 