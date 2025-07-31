// components/BusinessFlowChart.js
// Khusus untuk Business Flow page - Standard styling terpusat

import { Line, Bar, Doughnut } from 'react-chartjs-2';

export default function BusinessFlowChart({ 
  type = 'bar',
  data, 
  options = {},
  title,
  height = '300px'
}) {
  
  // Standard chart options untuk Business Flow
  const standardOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '500'
          },
          color: '#64748b'
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 16,
          weight: '600'
        },
        color: '#1e293b',
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          },
          color: '#64748b'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          },
          color: '#64748b'
        }
      }
    }
  };

  const mergedOptions = { ...standardOptions, ...options };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={mergedOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={mergedOptions} />;
      default:
        return <Bar data={data} options={mergedOptions} />;
    }
  };

  return (
    <div className="business-flow-chart-container" style={{ height }}>
      {renderChart()}
    </div>
  );
} 