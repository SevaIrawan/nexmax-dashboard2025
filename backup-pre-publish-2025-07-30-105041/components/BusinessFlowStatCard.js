// components/BusinessFlowStatCard.js
// Khusus untuk Business Flow page - Standard styling terpusat

export default function BusinessFlowStatCard({ 
  title, 
  value, 
  subtitle, 
  color, 
  icon,
  isAmount = false,
  currencyLogo = null
}) {
  
  // Parse change value to determine if positive or negative
  const parseChange = (changeText) => {
    if (!changeText) return { value: 0, isPositive: true };
    const match = changeText.match(/([+-]?\d+\.?\d*)%/);
    if (match) {
      const value = parseFloat(match[1]);
      return { value, isPositive: value >= 0 };
    }
    return { value: 0, isPositive: true };
  };

  const changeInfo = parseChange(subtitle);

  return (
    <div className="business-flow-stat-card">
      {icon && <div className="business-flow-stat-icon">{icon}</div>}
      <div className="business-flow-stat-content">
        <h4 className="business-flow-stat-title" style={{ color: color }}>
          {title}
        </h4>
        <div className="business-flow-stat-value">
          {isAmount && currencyLogo && (
            <span className="business-flow-currency-logo">{currencyLogo}</span>
          )}
          {value}
        </div>
        <div className={`business-flow-stat-change ${changeInfo.isPositive ? 'positive' : 'negative'}`}>
          {subtitle}
        </div>
      </div>
    </div>
  );
} 