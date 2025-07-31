// components/StandardKPIGrid.js
import StandardStatCard from './StandardStatCard';

export default function StandardKPIGrid({ 
  data, 
  loading = false,
  columns = 6 
}) {
  
  if (loading) {
    return (
      <div className="kpi-grid-standard" data-card-count="6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="kpi-card-skeleton-standard">
            <div className="skeleton-icon-standard"></div>
            <div className="skeleton-content-standard">
              <div className="skeleton-title-standard"></div>
              <div className="skeleton-value-standard"></div>
              <div className="skeleton-change-standard"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cardCount = data.length;

  return (
    <div className="kpi-grid-standard" data-card-count={cardCount}>
      {data.map((stat, i) => (
        <StandardStatCard
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