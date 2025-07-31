// components/StandardChartGrid.js
import StandardChart from './StandardChart';

export default function StandardChartGrid({ 
  charts, 
  loading = false,
  layout = '2x2' // '2x2', '1x2', '2x1', '1x1', '3x1'
}) {
  
  if (loading) {
    return (
      <div className="charts-grid-standard" data-chart-count="2">
        <div className="chart-skeleton-standard">
          <div className="skeleton-chart-title-standard"></div>
          <div className="skeleton-chart-area-standard"></div>
        </div>
        <div className="chart-skeleton-standard">
          <div className="skeleton-chart-title-standard"></div>
          <div className="skeleton-chart-area-standard"></div>
        </div>
      </div>
    );
  }

  const chartCount = charts.length;

  const renderCharts = () => {
    switch (layout) {
      case '2x2':
        return (
          <div className="charts-grid-standard" data-chart-count={chartCount}>
            {charts.map((chart, i) => (
              <StandardChart
                key={i}
                type={chart.type}
                series={chart.series}
                categories={chart.categories}
                title={chart.title}
                currency={chart.currency}
                loading={chart.loading}
                placeholder={chart.placeholder}
              />
            ))}
          </div>
        );
      
      case '1x2':
        return (
          <div className="charts-grid-standard" data-chart-count={chartCount}>
            {charts.map((chart, i) => (
              <StandardChart
                key={i}
                type={chart.type}
                series={chart.series}
                categories={chart.categories}
                title={chart.title}
                currency={chart.currency}
                loading={chart.loading}
                placeholder={chart.placeholder}
              />
            ))}
          </div>
        );
      
      case '2x1':
        return (
          <div className="line-charts-section-standard" data-chart-count={chartCount}>
            {charts.map((chart, i) => (
              <StandardChart
                key={i}
                type={chart.type}
                series={chart.series}
                categories={chart.categories}
                title={chart.title}
                currency={chart.currency}
                loading={chart.loading}
                placeholder={chart.placeholder}
              />
            ))}
          </div>
        );
      
      case '1x1':
        return (
          <div className="charts-grid-standard" data-chart-count={chartCount} style={{ width: '100%' }}>
            {charts.map((chart, i) => (
              <StandardChart
                key={i}
                type={chart.type}
                series={chart.series}
                categories={chart.categories}
                title={chart.title}
                currency={chart.currency}
                loading={chart.loading}
                placeholder={chart.placeholder}
              />
            ))}
          </div>
        );
      
      case '3x1': // NEW CASE ADDED
        return (
          <div className="charts-grid-3x1" data-chart-count={chartCount}>
            {charts.map((chart, i) => (
              <StandardChart
                key={i}
                type={chart.type}
                series={chart.series}
                categories={chart.categories}
                title={chart.title}
                currency={chart.currency}
                loading={chart.loading}
                placeholder={chart.placeholder}
              />
            ))}
          </div>
        );

      case 'complex': // NEW CASE FOR OLD MEMBER MODULE
        return (
          <div className="charts-grid-complex" data-chart-count={chartCount}>
            {/* Row 1: 3 Bar Charts */}
            <div className="chart-row-1">
              {charts.slice(0, 3).map((chart, i) => (
                <StandardChart
                  key={i}
                  type={chart.type}
                  series={chart.series}
                  categories={chart.categories}
                  title={chart.title}
                  currency={chart.currency}
                  loading={chart.loading}
                  placeholder={chart.placeholder}
                />
              ))}
            </div>
            
            {/* Row 2: 2 Line Charts */}
            <div className="chart-row-2">
              {charts.slice(3, 5).map((chart, i) => (
                <StandardChart
                  key={i + 3}
                  type={chart.type}
                  series={chart.series}
                  categories={chart.categories}
                  title={chart.title}
                  currency={chart.currency}
                  loading={chart.loading}
                  placeholder={chart.placeholder}
                />
              ))}
            </div>
            
            {/* Row 3: 1 Bar Chart + 1 Line Chart */}
            <div className="chart-row-3">
              {charts.slice(5, 7).map((chart, i) => (
                <StandardChart
                  key={i + 5}
                  type={chart.type}
                  series={chart.series}
                  categories={chart.categories}
                  title={chart.title}
                  currency={chart.currency}
                  loading={chart.loading}
                  placeholder={chart.placeholder}
                />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="charts-grid-standard" data-chart-count={chartCount}>
            {charts.map((chart, i) => (
              <StandardChart
                key={i}
                type={chart.type}
                series={chart.series}
                categories={chart.categories}
                title={chart.title}
                currency={chart.currency}
                loading={chart.loading}
                placeholder={chart.placeholder}
              />
            ))}
          </div>
        );
    }
  };

  return renderCharts();
} 