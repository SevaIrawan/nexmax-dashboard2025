import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function BusinessFlow() {
  const { user, loading: authLoading } = useRoleAccess('/business-flow');
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('July');
  const [currency, setCurrency] = useState('MYR');

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Chart data configurations
  const ppcLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: [4.2, 3.8, 2.1, 3.9, 6.2, 6.5, 4.8],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const ppcBarData1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'New Customers',
        data: [40, 35, 25, 30, 150, 140, 65],
        backgroundColor: '#f093fb',
      },
    ],
  };

  const ppcBarData2 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Group Join Volume',
        data: [1100, 1050, 1000, 1200, 2300, 2200, 1350],
        backgroundColor: '#4facfe',
      },
    ],
  };

  const firstDepositorLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Deposit Rate (%)',
        data: [25, 28, 30, 32, 35, 33, 24],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const firstDepositorBarData1 = {
    labels: ['In Group', 'Not In Group'],
    datasets: [
      {
        label: 'Deposit Rate (%)',
        data: [24.22, 11.80],
        backgroundColor: ['#667eea', '#f093fb'],
      },
    ],
  };

  const firstDepositorBarData2 = {
    labels: ['In Group', 'Not In Group'],
    datasets: [
      {
        label: 'Customer Count',
        data: [78, 65],
        backgroundColor: ['#4facfe', '#10b981'],
      },
    ],
  };

  const oldMemberBarData1 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Customer Count',
        data: [900, 800, 600, 400, 1400],
        backgroundColor: '#667eea',
      },
    ],
  };

  const oldMemberBarData2 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Upgraded Members',
        data: [110, 80, 50, 30, 10],
        backgroundColor: '#f093fb',
      },
    ],
  };

  const oldMemberBarData3 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Churned Members',
        data: [70, 30, 20, 15, 5],
        backgroundColor: '#ef4444',
      },
    ],
  };

  const oldMemberLineData1 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Engagement Rate',
        data: [0.75, 0.82, 0.88, 0.92, 0.95],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const oldMemberLineData2 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'NPS Score',
        data: [65, 72, 78, 85, 92],
        borderColor: '#f093fb',
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const oldMemberBarData4 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Upgrade Rate (%)',
        data: [12, 8, 6, 4, 1],
        backgroundColor: '#4facfe',
      },
    ],
  };

  const oldMemberLineData3 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Bronze',
        data: [8, 7, 6, 5, 4, 3, 2],
        borderColor: '#ef4444',
        tension: 0.4,
      },
      {
        label: 'Silver',
        data: [6, 5, 4, 3, 2, 1, 0.5],
        borderColor: '#f97316',
        tension: 0.4,
      },
      {
        label: 'Gold',
        data: [4, 3, 2, 1, 0.5, 0.3, 0.1],
        borderColor: '#eab308',
        tension: 0.4,
      },
      {
        label: 'Platinum',
        data: [3, 2, 1, 0.5, 0.3, 0.1, 0.05],
        borderColor: '#10b981',
        tension: 0.4,
      },
      {
        label: 'Diamond',
        data: [1, 0.5, 0.3, 0.1, 0.05, 0.02, 0.01],
        borderColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  const trafficBarData1 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Reactivation Rate',
        data: [0.65, 0.75, 0.85, 0.92, 0.98],
        backgroundColor: '#667eea',
      },
    ],
  };

  const trafficBarData2 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Reactivated Customers',
        data: [65, 95, 105, 315, 395],
        backgroundColor: '#f093fb',
      },
    ],
  };

  const trafficDonutData = {
    labels: ['Successful', 'Failed'],
    datasets: [
      {
        data: [80.49, 19.51],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        bottom: 20
      }
    }
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
    },
    layout: {
      padding: {
        bottom: 20
      }
    }
  };

  return (
    <div className="business-flow-page">
      <Sidebar user={user} />
      
      <div className="business-flow-main">
        <Header 
          title="Business Flow"
          user={user}
          sidebarExpanded={true}
          setSidebarExpanded={() => {}}
        />
        
        {/* SUB HEADER WITH SLICERS - STANDARD SIZE - NO SCROLL */}
        <div style={{
          position: 'fixed',
          top: '85px',
          left: '0px',
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
            fontSize: '1.2rem', 
            fontWeight: '600',
            color: '#1e293b'
          }}>
            
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* YEAR SLICER */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'white',
                color: '#000',
                cursor: 'pointer'
              }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>

            {/* CURRENCY SLICER */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'white',
                color: '#000',
                cursor: 'pointer'
              }}
            >
              <option value="MYR">MYR</option>
              <option value="SGD">SGD</option>
              <option value="USD">USD</option>
            </select>

            {/* MONTH SLICER */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'white',
                color: '#000',
                cursor: 'pointer'
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

        <div className="modules-container">
          {/* MODULE 1: PPC Service */}
          <div className="module-section">
            <div className="module-header">
              <h2 className="module-title">PPC Service Module</h2>
              <p className="module-subtitle">New customer acquisition and group join metrics</p>
            </div>
            
            <div className="module-content">
              <div className="kpi-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>NEW CUSTOMER CONVERSION RATE</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>4.83%</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -28.23% vs Last Month</div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>TOTAL NEW CUSTOMERS</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>65</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -47.58% vs Last Month</div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>CUSTOMER GROUP JOIN VOLUME</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>1,357</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -26.73% vs Last Month</div>
                  </div>
                </div>
              </div>
              
              <div className="charts-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Conversion Rate Trend</h4>
                    <Line data={ppcLineData} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>New Customers</h4>
                    <Bar data={ppcBarData1} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Customer Group Join Volume</h4>
                    <Bar data={ppcBarData2} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MODULE 2: First Depositor */}
          <div className="module-section">
            <div className="module-header">
              <h2 className="module-title">First Depositor Module</h2>
              <p className="module-subtitle">2nd deposit rates comparison between group and non-group members</p>
            </div>
            
            <div className="module-content">
              <div className="kpi-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>2ND DEPOSIT RATE (IN GROUP)</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>24.22%</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -15.31% vs Last Month</div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>2ND DEPOSITS (IN GROUP)</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>78</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -51.25% vs Last Month</div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>2ND DEPOSIT RATE (NOT IN GROUP)</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>11.80%</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -28.53% vs Last Month</div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>2ND DEPOSITS (NOT IN GROUP)</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>65</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -47.58% vs Last Month</div>
                  </div>
                </div>
              </div>
              
              <div className="charts-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Deposit Rate Trend</h4>
                    <Line data={firstDepositorLineData} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>2nd Deposit Rate Comparison</h4>
                    <Bar data={firstDepositorBarData1} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Customer Count by Group</h4>
                    <Bar data={firstDepositorBarData2} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MODULE 3: Old Member */}
          <div className="module-section">
            <div className="module-header">
              <h2 className="module-title">Old Member Module</h2>
              <p className="module-subtitle">Engagement, NPS, upgrade and churn metrics by tier</p>
            </div>
            
            <div className="module-content">
              {/* Row 1: 2 StatCard */}
              <div className="kpi-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>TOTAL UPGRADED MEMBERS</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>188</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -16.27% vs Last Month</div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>TOTAL CHURNED MEMBERS</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>128</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -12.91% vs Last Month</div>
                  </div>
                </div>
              </div>
              
              {/* Row 2: 3 Bar Chart */}
              <div className="charts-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '350px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Customer Count by Tier</h4>
                    <Bar data={oldMemberBarData1} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '350px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Upgraded Members by Tier</h4>
                    <Bar data={oldMemberBarData2} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '350px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Churned Members by Tier</h4>
                    <Bar data={oldMemberBarData3} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              {/* Row 3: 2 Line Chart */}
              <div className="charts-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '350px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Engagement Rate by Tier</h4>
                    <Line data={oldMemberLineData1} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '350px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>NPS Score by Tier</h4>
                    <Line data={oldMemberLineData2} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              {/* Row 4: 1 Bar Chart + 1 Line Chart */}
              <div className="charts-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Upgrade Rate by Tier</h4>
                    <Bar data={oldMemberBarData4} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Monthly Churn Rate by Tier</h4>
                    <Line data={oldMemberLineData3} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MODULE 4: Traffic Executive */}
          <div className="module-section">
            <div className="module-header">
              <h2 className="module-title">Traffic Executive Module</h2>
              <p className="module-subtitle">Customer reactivation and transfer success metrics</p>
            </div>
            
            <div className="module-content">
              <div className="kpi-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>CUSTOMER TRANSFER SUCCESS RATE</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>80.49%</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -7.27% vs Last Month</div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>TARGET COMPLETION</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>94.70%</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -5.30% vs Last Month</div>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>TOTAL REACTIVATED CUSTOMERS</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>978</div>
                    <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>↘️ -23.65% vs Last Month</div>
                  </div>
                </div>
              </div>
              
              <div className="charts-section">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                  gap: '20px' 
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Reactivation Rate by Tier</h4>
                    <Bar data={trafficBarData1} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Reactivated Customers by Tier</h4>
                    <Bar data={trafficBarData2} options={chartOptions} />
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '400px'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', textAlign: 'left', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Transfer Success Rate</h4>
                    <Doughnut data={trafficDonutData} options={donutOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .business-flow-page {
          display: flex;
          height: 100vh;
          background: #f8fafc;
        }

        .business-flow-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
        }

        .modules-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          margin-top: 185px;
        }

        .module-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 32px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .module-section:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .module-header {
          background: white;
          color: #1e293b;
          padding: 24px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #e2e8f0;
        }

        .module-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          position: relative;
          z-index: 1;
          color: #1e293b;
        }

        .module-subtitle {
          font-size: 0.9rem;
          opacity: 0.7;
          margin: 0;
          position: relative;
          z-index: 1;
          color: #64748b;
        }

        .module-content {
          padding: 24px;
        }

        .kpi-section {
          margin-bottom: 32px;
        }

        .charts-section {
          margin-bottom: 32px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .business-flow-main {
            margin-left: 75px;
          }
          
          .modules-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
