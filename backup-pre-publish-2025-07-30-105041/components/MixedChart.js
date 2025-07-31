import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MixedChart({ series, categories, title, currency = 'MYR', type = 'bar', color = '#3B82F6' }) {
  
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'MYR': return 'RM';
      case 'SGD': return 'SGD';
      case 'KHR': return 'USC';
      default: return 'RM';
    }
  };

  const formatValue = (value, datasetLabel) => {
    // Check if this is a percentage type
    const isPercentageType = datasetLabel && (
      datasetLabel.toLowerCase().includes('rate') ||
      datasetLabel.toLowerCase().includes('conversion') ||
      datasetLabel.toLowerCase().includes('%')
    );
    
    // Check if this is a count/integer type
    const isCountType = datasetLabel && (
      datasetLabel.toLowerCase().includes('customer') || 
      datasetLabel.toLowerCase().includes('volume') ||
      datasetLabel.toLowerCase().includes('count') ||
      datasetLabel.toLowerCase().includes('join')
    );
    
    if (isPercentageType) {
      return value.toFixed(2) + '%';
    } else if (isCountType) {
      if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
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

  const chartData = {
    labels: categories,
    datasets: series.map((dataset, index) => ({
      label: dataset.name,
      data: dataset.data,
      backgroundColor: type === 'line' ? 'transparent' : color,
      borderColor: color,
      borderWidth: type === 'line' ? 3 : 1,
      fill: false,
      tension: type === 'line' ? 0.4 : 0,
      pointBackgroundColor: type === 'line' ? color : 'transparent',
      pointBorderColor: type === 'line' ? color : 'transparent',
      pointRadius: type === 'line' ? 5 : 0,
      pointHoverRadius: type === 'line' ? 7 : 0,
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            return `${datasetLabel}: ${formatValue(value, datasetLabel)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
          callback: function(value) {
            return formatValue(value, series[0]?.name || '');
          }
        },
      },
    },
  };

  const ChartComponent = type === 'line' ? Line : Bar;

  return (
    <div style={{ height: '320px', width: '100%' }}>
      <ChartComponent data={chartData} options={options} />
    </div>
  );
} 