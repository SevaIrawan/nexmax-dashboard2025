// components/StatCard.js
export default function StatCard({ title, value, subtitle, color, icon }) {
  
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
    <div className="kpi-card-improved">
      {icon && <div className="kpi-icon">{icon}</div>}
      <div className="kpi-content">
        <h3 className="kpi-title" style={{ color: color }}>
          {title}
        </h3>
        <div className="kpi-value" style={{ color: '#000000' }}>
          {value}
        </div>
        <div className={`kpi-change ${changeInfo.isPositive ? 'positive' : 'negative'}`}>
          {subtitle}
        </div>
      </div>
      
      <style jsx>{`
        .kpi-card-improved {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 120px;
        }

        .kpi-card-improved:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .kpi-icon {
          font-size: 1.2rem;
          position: absolute;
          top: 16px;
          right: 16px;
          opacity: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-content {
          flex: 1;
        }

        .kpi-title {
          font-size: 1rem;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.3;
          padding-right: 35px;
          display: flex;
          align-items: center;
        }

        .kpi-value {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          line-height: 1.2;
          word-break: break-word;
          color: #000000 !important;
        }

        .kpi-change {
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .kpi-change.positive {
          color: #10B981;
        }

        .kpi-change.negative {
          color: #EF4444;
        }

        .kpi-change.positive::before {
          content: "↗";
          font-size: 1rem;
        }

        .kpi-change.negative::before {
          content: "↘";
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}