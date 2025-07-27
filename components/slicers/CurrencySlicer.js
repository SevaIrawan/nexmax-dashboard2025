// CENTRALIZED CURRENCY SLICER - KONSISTEN UNTUK SEMUA PAGE
export default function CurrencySlicer({ value, onChange, label = "Currency" }) {
  const currencies = ['MYR', 'SGD', 'USD'];

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
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
        {currencies.map(currency => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
    </div>
  );
} 