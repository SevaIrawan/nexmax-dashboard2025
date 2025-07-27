import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLastUpdate } from '../hooks/useLastUpdate';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';

export default function StrategicExecutive() {
  const { user, loading: authLoading } = useAuth();
  const { lastUpdate, loading: updateLoading } = useLastUpdate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // State untuk slicer
  const [year, setYear] = useState('2025');
  const [currency, setCurrency] = useState('MYR');
  const [month, setMonth] = useState('July');
  
  // State untuk data
  const [strategicData, setStrategicData] = useState({
    netProfit: 693053.48,
    netProfitChange: -24.8,
    ggrUser: 142.64,
    ggrUserChange: -13.68,
    activeMember: 4901,
    activeMemberChange: -13.18,
    pureMember: 1411,
    pureMemberChange: -29.31,
    headcount: 68,
    headcountChange: 0
  });

  // State untuk chart data
  const [chartData, setChartData] = useState({
    ggrUserTrend: {
      series: [{ name: 'GGR User', data: [142.50, 155.25, 148.75, 160.80, 152.90, 165.26, 142.64] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    ggrPureUserTrend: {
      series: [{ name: 'GGR Pure User', data: [98.30, 102.45, 95.80, 108.20, 99.75, 112.15, 89.50] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    customerValueTrend: {
      series: [{ name: 'Value per Headcount', data: [15420, 16800, 14950, 18200, 16500, 19300, 14200] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    customerCountTrend: {
      series: [{ name: 'Customers per Headcount', data: [62.5, 68.2, 59.8, 71.5, 65.3, 74.8, 58.9] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    customerVolumeDept: {
      series: [{ name: 'Customer Volume', data: [1850, 2420, 3680, 4250] }],
      categories: ['VIP', 'Premium', 'Standard', 'Basic']
    }
  });
  
  const [loading, setLoading] = useState(false);

  // Fetch strategic data
  useEffect(() => {
    const fetchStrategicData = async () => {
      try {
        setLoading(true);
        console.log('🎯 Fetching Strategic Executive data...');
        
        const response = await fetch(`/api/strategic-executive?currency=${currency}&year=${year}&month=${month}`);
        if (response.ok) {
          const data = await response.json();
          setStrategicData(data);
          console.log('✅ Strategic data loaded:', data);
        } else {
          console.error('❌ Strategic Executive API failed:', response.status);
        }

        // Fetch chart data
        const chartResponse = await fetch(`/api/strategic-charts?currency=${currency}&year=${year}`);
        if (chartResponse.ok) {
          const charts = await chartResponse.json();
          setChartData(charts);
          console.log('📊 Strategic charts loaded:', charts);
        } else {
          console.error('❌ Strategic Charts API failed:', chartResponse.status);
        }
      } catch (error) {
        console.error('❌ Error fetching strategic data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStrategicData();
    }
  }, [currency, year, month, user]);

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div className="loading-spinner" style={{ fontSize: '2rem', marginBottom: '16px' }}>⚡</div>
        <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading Strategic Executive...</div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  // KPI stats data
  const stats = [
    {
      title: 'NET PROFIT',
      value: `${currency} ${strategicData.netProfit.toLocaleString()}`,
      change: `${strategicData.netProfitChange}%`,
      color: strategicData.netProfitChange >= 0 ? 'green' : 'red',
      icon: '💰'
    },
    {
      title: 'GGR USER', 
      value: `${currency} ${strategicData.ggrUser.toFixed(2)}`,
      change: `${strategicData.ggrUserChange}%`,
      color: strategicData.ggrUserChange >= 0 ? 'green' : 'red',
      icon: '👤'
    },
    {
      title: 'ACTIVE MEMBER',
      value: strategicData.activeMember.toLocaleString(),
      change: `${strategicData.activeMemberChange}%`,
      color: strategicData.activeMemberChange >= 0 ? 'green' : 'red',
      icon: '👥'
    },
    {
      title: 'PURE MEMBER',
      value: strategicData.pureMember.toLocaleString(),
      change: `${strategicData.pureMemberChange}%`,
      color: strategicData.pureMemberChange >= 0 ? 'green' : 'red',
      icon: '⭐'
    },
    {
      title: 'HEADCOUNT',
      value: strategicData.headcount.toString(),
      change: `${strategicData.headcountChange}%`,
      color: strategicData.headcountChange >= 0 ? 'green' : 'red',
      icon: '👨‍💼'
    }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar 
        expanded={sidebarExpanded} 
        setExpanded={setSidebarExpanded}
        lastUpdate={lastUpdate}
      />
      
      <div className={`dashboard-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          title="📈 Strategic Executive Dashboard"
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />

        {/* Sub Header Fixed */}
        <div className="strategic-sub-header-fixed" style={{
          position: 'fixed',
          top: '80px',
          left: sidebarExpanded ? '280px' : '75px',
          right: '0',
          height: '60px',
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 1000,
          transition: 'left 0.3s ease'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#1e293b'
          }}>
            📈 Strategic Line Charts
          </h2>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="MYR">MYR</option>
              <option value="USD">USD</option>
              <option value="THB">THB</option>
            </select>
            
            <select 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="scrollable-content" style={{ marginTop: '140px', padding: '24px' }}>
          
          {/* KPI Cards */}
          <div className="kpi-grid-strategic" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {stats.map((stat, index) => (
              <div key={index} className="kpi-card-strategic" style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '600',
                    color: stat.color === 'green' ? '#16a34a' : stat.color === 'red' ? '#dc2626' : '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {stat.title}
                  </h3>
                  <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#000000',
                    lineHeight: '1.2'
                  }}>
                    {stat.value}
                  </div>
                </div>
                
                <div style={{
                  fontSize: '14px',
                  color: stat.color === 'green' ? '#16a34a' : '#dc2626',
                  fontWeight: '600'
                }}>
                  {stat.change.startsWith('-') ? '↓' : '↑'} {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* BARIS 1: 2 Line Charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '1.2rem', 
                color: '#1e293b',
                fontWeight: '600'
              }}>
                💰 GGR User Trend
              </h3>
              <LineChart
                series={chartData.ggrUserTrend.series}
                categories={chartData.ggrUserTrend.categories}
                title="GGR User"
                currency={currency}
                chartType="line"
              />
            </div>

            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '1.2rem', 
                color: '#1e293b',
                fontWeight: '600'
              }}>
                👥 GGR Pure User Trend
              </h3>
              <LineChart
                series={chartData.ggrPureUserTrend.series}
                categories={chartData.ggrPureUserTrend.categories}
                title="GGR Pure User"
                currency={currency}
                chartType="line"
              />
            </div>
          </div>

          {/* BARIS 2: 2 Line Charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
                             <h3 style={{ 
                 margin: '0 0 16px 0', 
                 fontSize: '1.2rem', 
                 color: '#1e293b',
                 fontWeight: '600'
               }}>
                                  Customer Value per Headcount
               </h3>
               <LineChart
                 series={chartData.customerValueTrend.series}
                 categories={chartData.customerValueTrend.categories}
                 title="Customer Value per Headcount"
                currency={currency}
                chartType="line"
              />
            </div>

            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
                             <h3 style={{ 
                 margin: '0 0 16px 0', 
                 fontSize: '1.2rem', 
                 color: '#1e293b',
                 fontWeight: '600'
               }}>
                 Customer Count vs Headcount
               </h3>
              <LineChart
                series={chartData.customerCountTrend.series}
                categories={chartData.customerCountTrend.categories}
                title="Customer Count vs Headcount"
                currency={currency}
                chartType="line"
              />
            </div>
          </div>

          {/* BARIS 3: 1 Bar Chart (Full Width) */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9'
          }}>
                           <h3 style={{ 
                 margin: '0 0 16px 0', 
                 fontSize: '1.2rem', 
                 color: '#1e293b',
                 fontWeight: '600'
               }}>
                 Customer Volume by Department
               </h3>
            <BarChart
              series={chartData.customerVolumeDept.series}
              categories={chartData.customerVolumeDept.categories}
              title="Customer Volume by Department"
              currency={currency}
            />
          </div>

        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .dashboard-content {
          flex: 1;
          position: relative;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }

        .dashboard-content.sidebar-expanded {
          margin-left: 280px;
        }

        .dashboard-content.sidebar-collapsed {
          margin-left: 75px;
        }

        .scrollable-content {
          height: calc(100vh - 140px);
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            margin-left: 0 !important;
          }
          
          .strategic-sub-header-fixed {
            left: 0 !important;
          }
          
          .kpi-grid-strategic {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .scrollable-content > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
