import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LineChart({ series, categories, title, currency = 'MYR' }) {
  
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'MYR': return 'RM';
      case 'SGD': return 'SGD';
      case 'KHR': return 'USC';
      default: return 'RM';
    }
  };

  const formatValue = (value, datasetLabel) => {
    // Check if this is a percentage type (Retention Rate, Churn Rate)
    const isPercentageType = datasetLabel && (
      datasetLabel.toLowerCase().includes('rate') ||
      datasetLabel.toLowerCase().includes('retention') ||
      datasetLabel.toLowerCase().includes('churn')
    );
    
    // Check if this is a frequency/ratio type (Purchase Frequency)
    const isFrequencyType = datasetLabel && (
      datasetLabel.toLowerCase().includes('frequency') ||
      datasetLabel.toLowerCase().includes('ratio')
    );
    
    // Check if this is a count/integer type (Members, Users, Depositor count, etc.)
    const isCountType = datasetLabel && (
      datasetLabel.toLowerCase().includes('member') ||
      datasetLabel.toLowerCase().includes('user') ||
      datasetLabel.toLowerCase().includes('unique') ||
      datasetLabel.toLowerCase().includes('pure') ||
      datasetLabel.toLowerCase().includes('count') ||
      datasetLabel.toLowerCase().includes('depositor')
    );
    
    if (isPercentageType) {
      // For percentage - show % symbol
      return value.toFixed(1) + '%';
    } else if (isFrequencyType) {
      // For frequency - show as decimal number only
      return value.toFixed(2);
    } else if (isCountType) {
      // For count/integer - no currency symbol
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(0) + 'K';
      }
      return value.toLocaleString();
    } else {
      // For CLV and other amounts - show as integer only (no currency)
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(0) + 'K';
      }
      return Math.round(value).toLocaleString();
    }
  };

  // Full value formatter for tooltip (no abbreviation)
  const formatFullValue = (value, datasetLabel) => {
    // Check if this is a percentage type (Retention Rate, Churn Rate)
    const isPercentageType = datasetLabel && (
      datasetLabel.toLowerCase().includes('rate') ||
      datasetLabel.toLowerCase().includes('retention') ||
      datasetLabel.toLowerCase().includes('churn')
    );
    
    // Check if this is a frequency/ratio type (Purchase Frequency)
    const isFrequencyType = datasetLabel && (
      datasetLabel.toLowerCase().includes('frequency') ||
      datasetLabel.toLowerCase().includes('ratio')
    );
    
    const isCountType = datasetLabel && (
      datasetLabel.toLowerCase().includes('member') ||
      datasetLabel.toLowerCase().includes('user') ||
      datasetLabel.toLowerCase().includes('unique') ||
      datasetLabel.toLowerCase().includes('pure') ||
      datasetLabel.toLowerCase().includes('count') ||
      datasetLabel.toLowerCase().includes('depositor')
    );
    
    if (isPercentageType) {
      // For percentage - show % symbol with full precision
      return value.toFixed(2) + '%';
    } else if (isFrequencyType) {
      // For frequency - show as decimal number only
      return value.toFixed(4);
    } else if (isCountType) {
      // For count/integer - no currency symbol, full number
      return value.toLocaleString() + ' persons';
    } else {
      // For CLV and other amounts - show as integer only (no currency)
      return Math.round(value).toLocaleString();
    }
  };
  const data = {
    labels: categories,
    datasets: series.map((item, index) => ({
      label: item.name,
      data: item.data,
      borderColor: index === 0 ? '#3B82F6' : '#10B981',
      backgroundColor: index === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: index === 0 ? '#3B82F6' : '#10B981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      fill: true,
      tension: 0.4
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
          padding: 12,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
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
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          },
          color: '#64748b'
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          borderDash: [5, 5]
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          },
          color: '#64748b',
          callback: function(value) {
            // Detect if this chart is for count/integer type based on title
            const isCountChart = title && (
              title.toLowerCase().includes('member') ||
              title.toLowerCase().includes('growth') ||
              title.toLowerCase().includes('unique') ||
              title.toLowerCase().includes('user') ||
              title.toLowerCase().includes('count')
            ) && !title.toLowerCase().includes('avg') && !title.toLowerCase().includes('ggr');
            return formatValue(value, isCountChart ? 'count' : 'amount');
          }
        }
      }
    },
    elements: {
      line: {
        borderCapStyle: 'round',
        borderJoinStyle: 'round'
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
} 