// components/BusinessFlowChartGrid.js
// Khusus untuk Business Flow page - Grid layout untuk Charts

import BusinessFlowChart from './BusinessFlowChart';

export default function BusinessFlowChartGrid({ 
  charts, 
  loading = false,
  layout = '3x1' // '3x1', '2x2', '1x2', '2x1', 'complex'
}) {
  
  if (loading) {
    return (
      <div className={`business-flow-chart-grid business-flow-chart-grid-${layout}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="business-flow-chart-skeleton">
            <div className="business-flow-skeleton-chart-title"></div>
            <div className="business-flow-skeleton-chart-area"></div>
          </div>
        ))}
      </div>
    );
  }

  const renderCharts = () => {
    switch (layout) {
      case '3x1':
        return (
          <div className="business-flow-chart-grid business-flow-chart-grid-3x1">
            {charts.map((chart, i) => (
              <BusinessFlowChart
                key={i}
                type={chart.type}
                data={chart.data}
                options={chart.options}
                title={chart.title}
                height={chart.height || '300px'}
              />
            ))}
          </div>
        );
      
      case '2x2':
        return (
          <div className="business-flow-chart-grid business-flow-chart-grid-2x2">
            {charts.map((chart, i) => (
              <BusinessFlowChart
                key={i}
                type={chart.type}
                data={chart.data}
                options={chart.options}
                title={chart.title}
                height={chart.height || '300px'}
              />
            ))}
          </div>
        );
      
      case 'complex':
        return (
          <div className="business-flow-chart-grid business-flow-chart-grid-complex">
            {/* Row 1: 3 Bar Charts */}
            <div className="business-flow-chart-row-1">
              {charts.slice(0, 3).map((chart, i) => (
                <BusinessFlowChart
                  key={i}
                  type={chart.type}
                  data={chart.data}
                  options={chart.options}
                  title={chart.title}
                  height={chart.height || '250px'}
                />
              ))}
            </div>
            
            {/* Row 2: 2 Line Charts */}
            <div className="business-flow-chart-row-2">
              {charts.slice(3, 5).map((chart, i) => (
                <BusinessFlowChart
                  key={i + 3}
                  type={chart.type}
                  data={chart.data}
                  options={chart.options}
                  title={chart.title}
                  height={chart.height || '250px'}
                />
              ))}
            </div>
            
            {/* Row 3: 1 Bar Chart + 1 Line Chart */}
            <div className="business-flow-chart-row-3">
              {charts.slice(5, 7).map((chart, i) => (
                <BusinessFlowChart
                  key={i + 5}
                  type={chart.type}
                  data={chart.data}
                  options={chart.options}
                  title={chart.title}
                  height={chart.height || '300px'}
                />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="business-flow-chart-grid business-flow-chart-grid-default">
            {charts.map((chart, i) => (
              <BusinessFlowChart
                key={i}
                type={chart.type}
                data={chart.data}
                options={chart.options}
                title={chart.title}
                height={chart.height || '300px'}
              />
            ))}
          </div>
        );
    }
  };

  return renderCharts();
} 