// components/StandardStatCard.js

export default function StandardStatCard({ 
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
    <div className="kpi-card-standard">
      {icon && <div className="kpi-icon-standard">{icon}</div>}
      <div className="kpi-content-standard">
        <h3 className="kpi-title-standard" style={{ color: color }}>
          {title}
        </h3>
        <div className="kpi-value-standard">
          {isAmount && currencyLogo && (
            <span style={{ fontSize: '0.8em', marginRight: '4px' }}>{currencyLogo}</span>
          )}
          {value}
        </div>
        <div className={`kpi-change-standard ${changeInfo.isPositive ? 'positive' : 'negative'}`}>
          {subtitle}
        </div>
      </div>
    </div>
  );
} 