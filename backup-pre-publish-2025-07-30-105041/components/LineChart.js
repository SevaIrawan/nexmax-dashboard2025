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

export default function LineChart({ series, categories, title, currency = 'MYR', showRatio = true, chartType = 'line' }) {
  
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
        display: true,
        position: 'bottom',
        align: 'center',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          },
          color: '#374151'
        }
      },
              tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
          callbacks: {
            title: function(context) {
              return `📅 Period: ${context[0].label}`;
            },
            beforeBody: function(context) {
              if (context.length === 2) {
                return ['📊 Performance Metrics:'];
              }
              return [];
            },
            label: function(context) {
              const value = context.parsed.y;
              const datasetLabel = context.dataset.label;
              const formattedValue = formatFullValue(value, datasetLabel);
              
              return `${datasetLabel}: ${formattedValue}`;
            },
            afterBody: function(context) {
              // ALWAYS show additional insights for 2-line charts
              if (context.length === 2 && showRatio) {
                const value1 = context[0].parsed.y;
                const value2 = context[1].parsed.y;
                const label1 = context[0].dataset.label;
                const label2 = context[1].dataset.label;
                
                // For rate-type charts (Retention vs Churn)
                if (label1.toLowerCase().includes('rate') && label2.toLowerCase().includes('rate')) {
                  const diff = Math.abs(value1 - value2);
                  const better = value1 > value2 ? label1 : label2;
                  return [``, `📈 Analysis:`, `• Difference: ${diff.toFixed(1)}%`, `• Better Performance: ${better}`];
                }
                
                // For CLV vs Purchase Frequency
                else if (label1.toLowerCase().includes('lifetime') && label2.toLowerCase().includes('frequency')) {
                  const avgTicketSize = value2 > 0 ? (value1 / value2).toFixed(0) : 0;
                  return [``, `💰 Business Insights:`, `• Avg Ticket Size: ${getCurrencySymbol(currency)} ${avgTicketSize}`, `• Revenue per Transaction`];
                }
                
                // For Customer Count vs Headcount
                else if (label1.toLowerCase().includes('member') && label2.toLowerCase().includes('headcount')) {
                  const ratio = value2 > 0 ? (value1 / value2).toFixed(0) : 0;
                  return [``, `👥 Efficiency Metrics:`, `• Customers per Employee: ${ratio}`, `• Operational Efficiency`];
                }
                
                // For Growth vs Profitability
                else if (label1.toLowerCase().includes('profit') || label2.toLowerCase().includes('customer')) {
                  return [``, `📊 Strategic Analysis:`, `• Combined Performance View`, `• Growth vs Profitability Trend`];
                }
                
                // For Revenue vs Cost (Operational Efficiency)
                else if (label1.toLowerCase().includes('revenue') && label2.toLowerCase().includes('cost')) {
                  const profit = value1 - value2;
                  const margin = value1 > 0 ? ((profit / value1) * 100).toFixed(1) : 0;
                  return [``, `💼 Financial Analysis:`, `• Net Profit: ${getCurrencySymbol(currency)} ${profit.toLocaleString()}`, `• Profit Margin: ${margin}%`];
                }
                
                // Generic ratio for other combinations
                else {
                  const ratio = value2 > 0 ? (value1 / value2).toFixed(2) : 0;
                  return [``, `📈 Correlation Analysis:`, `• Ratio: ${ratio}`, `• Performance Indicator`];
                }
              }
              return [];
            }
          }
        }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            // Check series name for percentage
            const firstSeries = series && series[0];
            if (firstSeries && firstSeries.name && firstSeries.name.toLowerCase().includes('rate')) {
              return value + '%';
            }
            
            // For other values - plain numbers
            return value;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
} 