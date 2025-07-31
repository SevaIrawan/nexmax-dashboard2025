import { useState, useEffect } from 'react';
import { useRoleAccess } from '../hooks/useRoleAccess';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';

export default function StrategicExecutive() {
  const { user, loading: authLoading } = useRoleAccess('/strategic-executive');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // State untuk slicer
  const [year, setYear] = useState('2025');
  const [currency, setCurrency] = useState('MYR');
  const [month, setMonth] = useState('July');
  
  // State untuk data - CONNECTED TO CENTRALIZED LOGIC
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

  // State untuk chart data - CONNECTED TO CENTRALIZED LOGIC
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
      series: [{ name: 'Value per Headcount', data: [154.20, 148.00, 149.50, 142.00, 115.00, 193.00, 142.00] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    customerCountTrend: {
      series: [
        { name: 'Active Member', data: [8000, 7800, 7900, 7700, 6900, 7500, 6800] },
        { name: 'Headcount', data: [55, 55, 50, 52, 50, 55, 48] }
      ],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    customerVolumeDept: {
      series: [{ name: 'Headcount', data: [15, 10, 8] }],
      categories: ['Cashier', 'S&R', 'CS']
    }
  });

  const [loading, setLoading] = useState(false);

  // OPTIMIZED: PARALLEL LOADING ALREADY IMPLEMENTED - AUTO SYNC 🚀
  useEffect(() => {
    const fetchStrategicData = async () => {
      setLoading(true);
      try {
        console.log('🚀 Strategic Executive - PARALLEL LOADING START');
        
        // PARALLEL LOADING - sudah optimal!
        const [kpiResponse, chartResponse] = await Promise.all([
          fetch(`/api/strategic-executive?currency=${currency}&year=${year}&month=${month}`),
          fetch(`/api/strategic-charts?currency=${currency}&year=${year}`)
        ]);

        if (kpiResponse.ok) {
          const kpiData = await kpiResponse.json();
          setStrategicData(kpiData);
          console.log('📊 Strategic KPI data loaded');
        }

        if (chartResponse.ok) {
          const chartsData = await chartResponse.json();
          setChartData(chartsData);
          console.log('📈 Strategic chart data loaded');
        }
        
        console.log('✅ Strategic Executive - PARALLEL LOADING COMPLETED');
      } catch (error) {
        console.error('❌ Error fetching strategic data:', error);
      }
      setLoading(false);
    };

    fetchStrategicData();
  }, [currency, year, month]); // AUTO SYNC when slicers change

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Sidebar 
        user={user} 
        onExpandedChange={setSidebarExpanded}
      />
      
      <div className={`dashboard-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          title="Strategic Executive"
          user={user}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />

                    {/* Sub Header Fixed - SAME SIZE AS MAIN DASHBOARD */}
            <div style={{
              position: 'fixed',
              top: '85px',
              left: sidebarExpanded ? '0px' : '0px',
              right: '0',
              minHeight: '100px',
              background: 'white',
              borderBottom: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 48px',
              zIndex: 1000,
              transition: 'left 0.3s ease',
              overflow: 'hidden'
            }}>
          <div style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#1e293b'
          }}>
            {/* Title removed - only in Header */}
          </div>
          
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
              <option value="SGD">SGD</option>
              <option value="USD">USD</option>
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
        <div style={{ 
          marginTop: '185px', 
          padding: '24px',
          height: 'calc(100vh - 185px)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          
          {/* KPI CARDS - STANDARDIZED WITH MAIN DASHBOARD */}
          <div className="kpi-grid-improved">
            {/* Net Profit KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">💰</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#374151' }}>
                  Net Profit
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : `${strategicData.netProfit.toLocaleString()}`}
                </div>
                <div className={`kpi-change ${strategicData.netProfitChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.netProfitChange >= 0 ? '+' : ''}{strategicData.netProfitChange}% vs last month
                </div>
              </div>
            </div>

            {/* GGR User KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">📊</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#374151' }}>
                  GGR User
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : strategicData.ggrUser}
                </div>
                <div className={`kpi-change ${strategicData.ggrUserChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.ggrUserChange >= 0 ? '+' : ''}{strategicData.ggrUserChange}% vs last month
                </div>
              </div>
            </div>

            {/* Active Member KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#374151' }}>
                  Active Member
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : strategicData.activeMember.toLocaleString()}
                </div>
                <div className={`kpi-change ${strategicData.activeMemberChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.activeMemberChange >= 0 ? '+' : ''}{strategicData.activeMemberChange}% vs last month
                </div>
              </div>
            </div>

            {/* Pure Member KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">⭐</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#374151' }}>
                  Pure Member
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : strategicData.pureMember.toLocaleString()}
                </div>
                <div className={`kpi-change ${strategicData.pureMemberChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.pureMemberChange >= 0 ? '+' : ''}{strategicData.pureMemberChange}% vs last month
                </div>
              </div>
            </div>

            {/* Headcount KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">👤</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#374151' }}>
                  Headcount
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : strategicData.headcount}
                </div>
                <div className={`kpi-change ${strategicData.headcountChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.headcountChange >= 0 ? '+' : ''}{strategicData.headcountChange}% vs last month
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS SECTION - 2-2-1 LAYOUT */}
          {/* BARIS 1: 2 Line Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* GGR User Trend Chart */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#374151'
              }}>
                GGR User Trend
              </h3>
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                <LineChart 
                  series={chartData.ggrUserTrend.series}
                  categories={chartData.ggrUserTrend.categories}
                  title="GGR User Trend"
                  currency={currency}
                />
              )}
            </div>

            {/* GGR Pure User Trend Chart */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#374151'
              }}>
                GGR Pure User Trend
              </h3>
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                <LineChart 
                  series={chartData.ggrPureUserTrend.series}
                  categories={chartData.ggrPureUserTrend.categories}
                  title="GGR Pure User Trend"
                  currency={currency}
                />
              )}
            </div>
          </div>

          {/* BARIS 2: 2 Line Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Customer Value per Headcount Chart */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#374151'
              }}>
                Customer Value per Headcount
              </h3>
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                <LineChart 
                  series={chartData.customerValueTrend.series}
                  categories={chartData.customerValueTrend.categories}
                  title="Customer Value per Headcount"
                  currency={currency}
                />
              )}
            </div>

            {/* Customer Count vs Headcount Chart */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px 24px 40px 24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minHeight: '380px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#374151'
              }}>
                Customer Count vs Headcount
              </h3>
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                <LineChart 
                  series={chartData.customerCountTrend.series}
                  categories={chartData.customerCountTrend.categories}
                  title="Customer Count vs Headcount"
                  currency={currency}
                  showRatio={true}
                />
              )}
            </div>
          </div>

          {/* BARIS 3: 1 Bar Chart (Full Width) */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#374151'
            }}>
              Customer Volume by Department
            </h3>
            {loading ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
              </div>
            ) : (
              <BarChart 
                series={chartData.customerVolumeDept.series}
                categories={chartData.customerVolumeDept.categories}
                title=""
                currency={currency}
              />
            )}
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

        /* STANDARDIZED KPI CARD STYLES - SAME AS MAIN DASHBOARD */
        .kpi-grid-improved {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        @media (max-width: 1200px) {
          .kpi-grid-improved {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .kpi-grid-improved {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .dashboard-content {
            margin-left: 0 !important;
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
          font-size: 1.8rem;
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
      `}</style>
    </div>
  );
}
