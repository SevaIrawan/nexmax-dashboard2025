// components/BusinessFlowKPIGrid.js
// Khusus untuk Business Flow page - Grid layout untuk KPI Cards

import BusinessFlowStatCard from './BusinessFlowStatCard';

export default function BusinessFlowKPIGrid({ 
  data, 
  loading = false,
  columns = 'auto-fit' // 'auto-fit', '2', '3', '4'
}) {
  
  if (loading) {
    return (
      <div className={`business-flow-kpi-grid business-flow-kpi-grid-${columns}`}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="business-flow-stat-card-skeleton">
            <div className="business-flow-skeleton-icon"></div>
            <div className="business-flow-skeleton-content">
              <div className="business-flow-skeleton-title"></div>
              <div className="business-flow-skeleton-value"></div>
              <div className="business-flow-skeleton-change"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`business-flow-kpi-grid business-flow-kpi-grid-${columns}`}>
      {data.map((stat, i) => (
        <BusinessFlowStatCard
          key={i}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          color={stat.color}
          icon={stat.icon}
          isAmount={stat.isAmount}
          currencyLogo={stat.currencyLogo}
        />
      ))}
    </div>
  );
} 