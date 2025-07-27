import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ series, categories, title, currency = 'MYR' }) {
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'MYR': return 'RM';
      case 'SGD': return 'SGD';
      case 'KHR': return 'USC';
      default: return 'RM';
    }
  };

  const formatValue = (value, datasetLabel) => {
    // Check if this is a count/integer type (New Depositor, Active Member, etc.)
    const isCountType = datasetLabel && (
      datasetLabel.toLowerCase().includes('depositor') || 
      datasetLabel.toLowerCase().includes('member') ||
      datasetLabel.toLowerCase().includes('user') ||
      datasetLabel.toLowerCase().includes('count')
    );
    
    if (isCountType) {
      // For count/integer - no currency symbol
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(0) + 'K';
      }
      return value.toLocaleString();
    } else {
      // For amount/numeric - with currency symbol
      if (value >= 1000000) {
        return getCurrencySymbol(currency) + ' ' + (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return getCurrencySymbol(currency) + ' ' + (value / 1000).toFixed(0) + 'K';
      }
      return getCurrencySymbol(currency) + ' ' + value.toLocaleString();
    }
  };

  // Full value formatter for tooltip (no abbreviation)
  const formatFullValue = (value, datasetLabel) => {
    const isCountType = datasetLabel && (
      datasetLabel.toLowerCase().includes('depositor') || 
      datasetLabel.toLowerCase().includes('member') ||
      datasetLabel.toLowerCase().includes('user') ||
      datasetLabel.toLowerCase().includes('count')
    );
    
    if (isCountType) {
      // For count/integer - no currency symbol, full number
      return value.toLocaleString() + ' persons';
    } else {
      // For amount/numeric - with currency symbol, full number
      return getCurrencySymbol(currency) + ' ' + value.toLocaleString();
    }
  };

  // Convert ApexCharts series format to Chart.js format
  const data = {
    labels: categories,
    datasets: series.map((dataset, index) => ({
      label: dataset.name,
      data: dataset.data,
      backgroundColor: index === 0 ? '#3b82f6' : '#10b981',
      borderColor: index === 0 ? '#2563eb' : '#059669',
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 12,
          font: {
            size: 12,
            weight: 500
          },
          color: '#64748b',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: title,
        align: 'start',
        font: {
          size: 14,
          weight: 600
        },
        color: '#1e293b',
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + formatFullValue(context.parsed.y, context.dataset.label);
          },
          title: function(context) {
            return 'Month: ' + context[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: 500
          },
          color: '#64748b'
        },
        border: {
          color: '#e2e8f0',
          width: 1
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          borderDash: [3, 3]
        },
        ticks: {
          font: {
            size: 11,
            weight: 400
          },
          color: '#64748b',
          callback: function(value) {
            // Detect if this chart is for count/integer type based on title
            const isCountChart = title && (
              title.toLowerCase().includes('depositor') || 
              title.toLowerCase().includes('member') ||
              title.toLowerCase().includes('growth') ||
              title.toLowerCase().includes('user') ||
              title.toLowerCase().includes('count')
            );
            return formatValue(value, isCountChart ? 'count' : 'amount');
          }
        },
        border: {
          display: false
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4
      }
    }
  };

  return (
    <div style={{ height: '340px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}