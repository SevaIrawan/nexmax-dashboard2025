// components/BarChart.js
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function BarChart({ series, categories, title, currency = 'MYR' }) {
  
  // Get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    switch(currencyCode) {
      case 'MYR': return 'RM';
      case 'SGD': return 'SGD$';
      case 'KHR': return 'USD$';
      default: return 'RM';
    }
  };
  const options = {
    chart: { 
      type: 'bar',
      toolbar: { show: false },
      offsetY: 0 // Turunkan bars agar sejajar dengan Y-axis values
    },
    xaxis: { 
      categories,
      labels: {
        offsetY: 0, // Turunkan X-axis labels ke bawah lebih jauh
        style: {
          fontSize: '12px'
        }
      }
    },
    title: { 
      text: title,
      align: 'left',
      margin: 15,
      offsetY: 0,
      style: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1e293b'
      }
    },
    yaxis: {
      labels: {
        offsetX: -5,
        formatter: function (val) {
          if (val >= 1000000) {
            return getCurrencySymbol(currency) + (val / 1000000).toFixed(0) + 'M';
          } else if (val >= 1000) {
            return getCurrencySymbol(currency) + (val / 1000).toFixed(0) + 'K';
          }
          return getCurrencySymbol(currency) + val.toLocaleString();
        }
      }
    },
    dataLabels: {
      enabled: false // Hilangkan labels pada bar, gunakan tooltip saja
    },
    tooltip: {
      y: {
        formatter: function (val) {
          if (val >= 1000000) {
            return getCurrencySymbol(currency) + ' ' + (val / 1000000).toFixed(1) + 'M';
          } else if (val >= 1000) {
            return getCurrencySymbol(currency) + ' ' + (val / 1000).toFixed(1) + 'K';
          }
          return getCurrencySymbol(currency) + ' ' + val.toLocaleString();
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    },
    grid: {
      show: true,
      borderColor: '#e0e6ed',
      strokeDashArray: 5,
      position: 'back',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 10,
        right: 0,
        bottom: 0,
        left: 0
      }
    }
  };
  return (
    <ReactApexChart options={options} series={series} type="bar" height={320} />
  );
}