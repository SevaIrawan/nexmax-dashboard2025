// components/StandardChart.js
import BarChart from './BarChart';
import LineChart from './LineChart';
import DonutChart from './DonutChart';

export default function StandardChart({ 
  type = 'bar',
  series, 
  categories, 
  title, 
  currency = 'MYR',
  loading = false,
  placeholder = null
}) {
  
  if (loading) {
    return (
      <div className="chart-container-standard">
        <div className="skeleton-chart-title-standard"></div>
        <div className="skeleton-chart-area-standard"></div>
      </div>
    );
  }

  if (placeholder) {
    return (
      <div className="chart-container-standard">
        <h3 className="chart-title-standard">{title}</h3>
        <div className="chart-placeholder-standard">
          {placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container-standard">
      <h3 className="chart-title-standard">{title}</h3>
      {type === 'line' ? (
        <LineChart 
          series={series} 
          categories={categories} 
          title={title} 
          currency={currency}
        />
      ) : type === 'donut' ? (
        <DonutChart 
          series={series} 
          categories={categories} 
          title={title} 
          currency={currency}
        />
      ) : (
        <BarChart 
          series={series} 
          categories={categories} 
          title={title} 
          currency={currency}
          type={type}
        />
      )}
    </div>
  );
} 