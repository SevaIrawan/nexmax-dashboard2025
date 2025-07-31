// CENTRALIZED MONTH SLICER - KONSISTEN UNTUK SEMUA PAGE
export default function MonthSlicer({ 
  selectedMonth, 
  onMonthChange, 
  availableMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 
  label = "Month",
  // BACKWARD COMPATIBILITY
  value,
  onChange
}) {
  // Use new props if available, otherwise fallback to old props
  const monthValue = selectedMonth !== undefined ? selectedMonth : value;
  const monthOnChange = onMonthChange !== undefined ? onMonthChange : onChange;
  const monthNames = {
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August',
    '9': 'September', '10': 'October', '11': 'November', '12': 'December'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-end',
      minWidth: '100px'
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
        value={monthValue}
        onChange={(e) => monthOnChange(e.target.value)}
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
        {selectedMonth !== undefined && <option value="All">All Months</option>}
        {availableMonths.map(month => (
          <option key={month} value={month}>
            {selectedMonth !== undefined ? (monthNames[month] || month) : month}
          </option>
        ))}
      </select>
    </div>
  );
} 