import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import { useRoleAccess } from '../hooks/useRoleAccess';

export default function Home() {
  const { user, loading: authLoading } = useRoleAccess('/');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [previousMonthData, setPreviousMonthData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [currency, setCurrency] = useState('MYR');
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('July');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const router = useRouter();

  // Load dashboard data
  useEffect(() => {
    if (user) {
      setLoading(true);
      
      // Fetch current month data from new main-dashboard API
      fetch(`/api/main-dashboard?currency=${currency}&year=${year}&month=${month}`)
        .then(res => res.json())
        .then(data => {
          console.log('📊 Main Dashboard REAL data loaded:', data);
          if (data.success) {
            setDashboardData(data.data);
          }
          
          // Fetch previous month data for comparison
          const previousMonth = getPreviousMonth(month);
          return fetch(`/api/main-dashboard?currency=${currency}&year=${year}&month=${previousMonth}`);
        })
        .then(res => res.json())
        .then(prevData => {
          console.log('📊 Previous month data loaded:', prevData);
          if (prevData.success) {
            setPreviousMonthData(prevData.data);
          }
          
          // Fetch line chart data
          return fetch(`/api/line-chart-data?currency=${currency}&year=${year}`);
        })
        .then(res => res.json())
        .then(chartData => {
          console.log('📈 Line chart data loaded:', chartData);
          if (chartData.success) {
            setLineChartData(chartData);
          } else {
            console.log('Using fallback data for line charts');
            setLineChartData(chartData.fallbackData || null);
          }
          
          // Fetch bar chart data
          return fetch(`/api/bar-chart-data?currency=${currency}&year=${year}`);
        })
        .then(res => res.json())
        .then(barData => {
          console.log('📊 Bar chart data loaded:', barData);
          if (barData.success) {
            setBarChartData(barData);
          } else {
            console.log('Using fallback data for bar charts');
            setBarChartData(barData);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading dashboard data:', err);
          setLoading(false);
        });
    }
  }, [currency, year, month, user]);

  // Helper function to get previous month
  const getPreviousMonth = (currentMonth) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentIndex = months.indexOf(currentMonth);
    return currentIndex > 0 ? months[currentIndex - 1] : 'December';
  };

  // Calculate percentage change
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Format change percentage
  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${Math.abs(change).toFixed(1)}%`;
  };

  // Get currency logo
  const getCurrencyLogo = (currencyCode) => {
    switch(currencyCode) {
      case 'MYR':
        return '/malaysia-flag.png';
      case 'SGD':
        return '/malaysia-flag.png'; // Fallback ke Malaysia flag
      case 'KHR':
        return '/malaysia-flag.png'; // Fallback ke Malaysia flag
      default:
        return '/malaysia-flag.png';
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    switch(currencyCode) {
      case 'MYR':
        return 'RM';
      case 'SGD':
        return 'SGD';
      case 'KHR':
        return 'USC';
      default:
        return 'RM';
    }
  };

  // Format value based on type
  const formatValue = (value, type, showCurrency = false) => {
    if (!value || value === 0) return type === 'amount' ? (showCurrency ? `${getCurrencySymbol(currency)} 0.00` : '0.00') : '0';
    
    if (type === 'amount') {
      const formatted = parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return showCurrency ? `${getCurrencySymbol(currency)} ${formatted}` : formatted;
    } else {
      return parseInt(value).toLocaleString('en-US');
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f4f6fa',
        gap: '20px'
      }}>
        <div style={{ fontSize: '2rem' }}>🔄</div>
        <div>Loading authentication...</div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>{user?.debugInfo}</div>
      </div>
    );
  }

  if (loading || !dashboardData) {
    return (
      <div className="app-layout">
        <Sidebar expanded={sidebarExpanded} onToggle={setSidebarExpanded} />
        <div className="main-content">
          <Header />
          <main>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '50vh',
              gap: '20px'
            }}>
              <div style={{ fontSize: '2rem' }}>⏳</div>
              <div>Loading Main Dashboard data...</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                Fetching from PostgreSQL database... Currency: {currency}, Month: {month}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Statistics data - REAL DATA dengan optimization
  const statData = [
    {
      title: 'Deposit Amount',
      value: formatValue(dashboardData?.depositAmount, 'amount', true),
      icon: '💳',
      color: 'blue',
      change: previousMonthData ? calculateChange(
        parseFloat(dashboardData?.depositAmount || 0), 
        parseFloat(previousMonthData?.depositAmount || 0)
      ) : 0,
      isAmount: true,
      currencyLogo: getCurrencyLogo(currency)
    },
    {
      title: 'Withdraw Amount',
      value: formatValue(dashboardData?.withdrawAmount, 'amount', true),
      icon: '💸',
      color: 'red',
      change: previousMonthData ? calculateChange(
        parseFloat(dashboardData?.withdrawAmount || 0), 
        parseFloat(previousMonthData?.withdrawAmount || 0)
      ) : 0,
      isAmount: true,
      currencyLogo: getCurrencyLogo(currency)
    },
    {
      title: 'Gross Profit',
      value: formatValue(dashboardData?.grossProfit, 'amount', true),
      icon: '🔥',
      color: 'orange',
      change: previousMonthData ? calculateChange(
        parseFloat(dashboardData?.grossProfit || 0), 
        parseFloat(previousMonthData?.grossProfit || 0)
      ) : 0,
      isAmount: true,
      currencyLogo: getCurrencyLogo(currency)
    },
    {
      title: 'Net Profit',
      value: formatValue(dashboardData?.netProfit, 'amount', true),
      icon: '💰',
      color: 'green',
      change: previousMonthData ? calculateChange(
        parseFloat(dashboardData?.netProfit || 0), 
        parseFloat(previousMonthData?.netProfit || 0)
      ) : 0,
      isAmount: true,
      currencyLogo: getCurrencyLogo(currency)
    },
    {
      title: 'New Depositor',
      value: formatValue(dashboardData?.newDepositor, 'count'),
      icon: '👤',
      color: 'purple',
      change: previousMonthData ? calculateChange(
        parseFloat(dashboardData?.newDepositor || 0), 
        parseFloat(previousMonthData?.newDepositor || 0)
      ) : 0,
      isAmount: false
    },
    {
      title: 'Active Member',
      value: formatValue(dashboardData?.activeMember, 'count'),
      icon: '👥',
      color: 'blue',
      change: previousMonthData ? calculateChange(
        parseFloat(dashboardData?.activeMember || 0), 
        parseFloat(previousMonthData?.activeMember || 0)
      ) : 0,
      isAmount: false
    },

  ];

  // Static Chart Data (tidak terpengaruh filter)
  const staticChartData1 = {
    series: [
      { name: 'Revenue', data: [450000, 520000, 480000, 600000, 580000, 650000] }
    ],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  };

  const staticChartData2 = {
    series: [
      { name: 'Growth', data: [15, 25, 20, 35, 30, 45] }
    ],
    categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']
  };

  return (
    <div className="app-layout">
      <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      <div className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header user={user} sidebarExpanded={sidebarExpanded} />
        {/* Fixed Header with Performance Overview and Slicer */}
        <div className="dashboard-header-fixed">
          <h2 className="dashboard-subtitle"></h2>
          <div className="slicer-controls">
            <div className="filter-group">
              <label>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)}>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Currency:</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="MYR">MYR</option>
                <option value="SGD">SGD</option>
                <option value="KHR">KHR</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)}>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
              </select>
            </div>
          </div>
        </div>

        <main className="scrollable-content">{/* Scrollable content area starts here */}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">🔄</div>
              <div>Loading REAL data from member_report_monthly...</div>
            </div>
          ) : (
            <div className="dashboard-content">
              {/* KPI Cards Grid - Optimized */}
              <div className="kpi-grid-improved">
                {statData.map((stat, i) => (
                  <div key={i} className="kpi-card-improved">
                    <div className="kpi-icon">{stat.icon}</div>
                    <div className="kpi-content">
                      <h3 className="kpi-title" style={{ color: stat.color === 'green' ? '#10B981' : stat.color === 'blue' ? '#3B82F6' : stat.color === 'purple' ? '#8B5CF6' : stat.color === 'orange' ? '#F59E0B' : '#EF4444' }}>
                        {stat.title}
                      </h3>
                      <div className="kpi-value" style={{ color: '#000000' }}>
                        {stat.value}
                      </div>
                      <div className={`kpi-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                        {formatChange(stat.change)} vs last month
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Section - Strategic Insights */}
              <div className="charts-grid">
                <div className="chart-container">
                  <h3 className="chart-title">📊 Retention vs Churn Rate Over Time</h3>
                  {barChartData?.retentionChurnData ? (
                    <LineChart 
                      series={[
                        { name: 'Retention Rate (%)', data: barChartData.retentionChurnData.retentionData },
                        { name: 'Churn Rate (%)', data: barChartData.retentionChurnData.churnData }
                      ]} 
                      categories={barChartData.retentionChurnData.categories} 
                      title="Retention vs Churn Rate" 
                      currency={currency}
                      chartType="line"
                    />
                  ) : (
                    <div className="chart-placeholder">Loading retention data...</div>
                  )}
                </div>
                <div className="chart-container">
                  <h3 className="chart-title">💰 Customer Lifetime Value vs Purchase Frequency</h3>
                  {barChartData?.clvFrequencyData ? (
                    <LineChart 
                      series={[
                        { name: 'Customer Lifetime Value', data: barChartData.clvFrequencyData.clvData },
                        { name: 'Purchase Frequency', data: barChartData.clvFrequencyData.purchaseFreqData }
                      ]} 
                      categories={barChartData.clvFrequencyData.categories} 
                      title="CLV vs Purchase Frequency" 
                      currency={currency}
                      chartType="line"
                    />
                  ) : (
                    <div className="chart-placeholder">Loading CLV data...</div>
                  )}
                </div>
              </div>

              {/* Line Charts Section - Strategic Analysis */}
              <div className="line-charts-section">
                <div className="chart-container">
                  <h3 className="chart-title">📈 Growth vs Profitability Analysis</h3>
                  {lineChartData?.growthProfitabilityTrend ? (
                    <LineChart 
                      series={lineChartData.growthProfitabilityTrend.series} 
                      categories={lineChartData.growthProfitabilityTrend.categories} 
                      title="Growth vs Profitability Analysis" 
                      currency={currency}
                    />
                  ) : (
                    <div className="line-chart-placeholder">Loading strategic data...</div>
                  )}
                </div>
                <div className="chart-container">
                  <h3 className="chart-title">💰 Operational Efficiency Trend</h3>
                  {lineChartData?.operationalEfficiencyTrend ? (
                    <LineChart 
                      series={lineChartData.operationalEfficiencyTrend.series} 
                      categories={lineChartData.operationalEfficiencyTrend.categories} 
                      title="Operational Efficiency Trend" 
                      currency={currency}
                    />
                  ) : (
                    <div className="line-chart-placeholder">Loading efficiency data...</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        <style jsx>{`
          .app-layout {
            display: flex;
            height: 100vh;
            overflow: hidden;
          }

          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
          }

          .dashboard-header-fixed {
            position: sticky;
            top: 85px;
            z-index: 100;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 15px 48px;
            border-bottom: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            margin: 0 -32px 60px -32px;
            min-height: 100px;
          }

          .scrollable-content {
            flex: 1;
            padding: 0 32px 40px 32px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            overflow-y: auto;
            overflow-x: hidden;
            min-height: calc(100vh - 85px);
            scrollbar-width: thin;
            scrollbar-color: #cbd5e0 #f7fafc;
          }

          .scrollable-content::-webkit-scrollbar {
            width: 8px;
          }

          .scrollable-content::-webkit-scrollbar-track {
            background: #f7fafc;
            border-radius: 4px;
          }

          .scrollable-content::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 4px;
          }

          .scrollable-content::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
          }



          .dashboard-subtitle {
            margin: 0;
            font-size: 1.3rem;
            font-weight: 700;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
          }

          .slicer-controls {
            display: flex;
            gap: 16px;
            align-items: center;
            margin-top: 0;
            flex-shrink: 0;
          }

          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .filter-group label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .filter-group select {
            padding: 8px 12px;
            border-radius: 6px;
            border: 2px solid #e2e8f0;
            font-size: 0.9rem;
            font-weight: 600;
            background: white;
            color: #1e293b;
            min-width: 100px;
            transition: all 0.2s ease;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
          }

          .filter-group select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.15);
          }

          .filter-group select:hover {
            border-color: #94a3b8;
            transform: translateY(-1px);
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 250px;
            gap: 12px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          }

          .loading-spinner {
            font-size: 1.8rem;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .dashboard-content {
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding-top: 0;
            margin-top: 0;
            min-height: 100vh;
            padding-bottom: 40px;
          }

          .kpi-grid-improved {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 12px;
            margin-top: 50px;
            margin-bottom: 0px;
            width: 100%;
          }

          /* Responsive KPI Grid */
          @media (max-width: 1200px) {
            .kpi-grid-improved {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (max-width: 768px) {
            .kpi-grid-improved {
              grid-template-columns: repeat(2, 1fr);
              gap: 8px;
              margin-top: 20px;
            }
          }

          @media (max-width: 480px) {
            .kpi-grid-improved {
              grid-template-columns: 1fr;
              gap: 10px;
            }
          }

          .kpi-card-improved {
            background: white;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            min-height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
          }

          .kpi-card-improved:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
          }

          .kpi-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }

          .kpi-icon {
            font-size: 1.2rem;
            position: absolute;
            top: 10px;
            right: 18px;
            opacity: 0.8;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .kpi-content {
            flex: 1;
          }

          .kpi-title {
            font-size: 1rem;
            font-weight: 600;
            color: #64748b;
            margin: 0 0 12px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            line-height: 1.3;
            padding-right: 45px;
            display: flex;
            align-items: center;
          }

          .kpi-value {
            font-size:1.8rem;
            font-weight: 700;
            margin: 0 0 8px 0;
            line-height: 1.2;
            word-break: break-word;
          }

          .kpi-change {
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 3px;
          }

          .kpi-change.positive {
            color: #10B981;
          }

          .kpi-change.negative {
            color: #EF4444;
          }

          .kpi-change.positive::before {
            content: "↗";
            font-size: 1rem;
          }

          .kpi-change.negative::before {
            content: "↘";
            font-size: 1rem;
          }

          .charts-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 0px;
            margin-top: 0px;
          }

          /* Responsive Charts Grid */
          @media (max-width: 1024px) {
            .charts-grid {
              grid-template-columns: 1fr;
              gap: 15px;
            }
          }

          .chart-container {
            background: white;
            padding: 24px 28px;
            border-radius: 10px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            overflow: visible;
            min-height: 380px;
          }
          
          .chart-container .apexcharts-canvas {
            margin: 0 auto;
          }

          .line-charts-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 0px;
          }

          /* Responsive Line Charts Section */
          @media (max-width: 1024px) {
            .line-charts-section {
              grid-template-columns: 1fr;
              gap: 15px;
            }
          }

          .chart-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 8px 0;
          }

          .line-chart-placeholder, .chart-placeholder {
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            border-radius: 8px;
            color: #64748b;
            font-weight: 500;
          }

          @media (max-width: 1400px) {
            .kpi-grid-improved {
              grid-template-columns: repeat(3, 1fr);
              gap: 14px;
            }
            .kpi-card-improved {
              padding: 16px;
              min-height: 115px;
            }
            .kpi-value {
              font-size: 1.4rem;
            }
            .kpi-title {
              font-size: 0.75rem;
              padding-right: 40px;
            }
            .kpi-icon {
              font-size: 1.8rem;
              top: 16px;
              right: 16px;
            }
          }

                      @media (max-width: 1024px) {
              .dashboard-header-fixed {
                flex-direction: column;
                gap: 12px;
                align-items: stretch;
                padding: 12px 32px;
                min-height: 80px;
                margin: 0 -20px 20px -20px;
              }

              .slicer-controls {
                justify-content: center;
                gap: 12px;
              }

              .charts-grid, .line-charts-section {
                grid-template-columns: 1fr;
                gap: 12px;
              }

              .chart-container {
                padding: 16px 20px;
              }

              .chart-title {
                font-size: 14px;
                margin-bottom: 12px;
              }

              .scrollable-content {
                padding: 0 20px 40px 20px;
                min-height: calc(100vh - 85px);
              }
            }

                      @media (max-width: 768px) {
              .kpi-grid-improved {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
              }
              .kpi-card-improved {
                padding: 14px;
                min-height: 105px;
              }
              .kpi-value {
                font-size: 1.3rem;
              }
              .kpi-title {
                font-size: 0.7rem;
                padding-right: 35px;
              }
              .kpi-icon {
                font-size: 1.6rem;
                top: 14px;
                right: 14px;
              }

              .slicer-controls {
                flex-direction: column;
                gap: 10px;
              }

              .filter-group select {
                min-width: 100%;
                padding: 6px 10px;
                font-size: 0.85rem;
              }

              .dashboard-header-fixed {
                padding: 10px 24px;
                min-height: 100px;
                margin: 0 -16px 20px -16px;
              }

              .dashboard-subtitle {
                font-size: 1.1rem;
              }

              .scrollable-content {
                padding: 0 16px 40px 16px;
                height: calc(100vh - 85px);
              }

              .dashboard-content {
                margin-top: 0;
              }
            }
        `}</style>
      </div>
    </div>
  );
}