import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const dummyLabels = [
  '2024-07', '2024-08', '2024-09', '2024-10', '2024-11',
  '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'
];

const generateBarData = (label, color) => ({
  labels: dummyLabels,
  datasets: [{
    label,
    data: dummyLabels.map(() => Math.floor(Math.random() * 100 + 50)),
    backgroundColor: color
  }]
});

const generateLineData = () => ({
  labels: dummyLabels,
  datasets: [{
    label: 'Conversion Rate %',
    data: dummyLabels.map(() => parseFloat((Math.random() * 8).toFixed(2))),
    borderColor: '#3B82F6',
    backgroundColor: '#93C5FD',
    fill: true
  }]
});

const generateDoughnutData = () => ({
  labels: ['Successful', 'Failed'],
  datasets: [{
    data: [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 500)],
    backgroundColor: ['#10B981', '#EF4444']
  }]
});

export default function BusinessFlow() {
  const { user, loading: authLoading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('MYR');
  const [selectedYear, setSelectedYear] = useState('2025');

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }

  return (
    <div className="app-layout" style={{ display: 'flex' }}>
      <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header user={user} sidebarExpanded={sidebarExpanded} />
        <main style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
          {/* Business Flow Header Section */}
          <section className="insights-section" style={{ padding: '24px 24px 0' }}>
            <div className="insights-header">
              <div className="insights-title">
                <h1>💼 Business Flow Dashboard</h1>
                <p>Business Process Management & Workflow Analytics</p>
              </div>
              <div className="insights-controls">
                <select 
                  value={selectedCurrency} 
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="control-select"
                >
                  <option value="MYR">🇲🇾 MYR</option>
                  <option value="SGD">🇸🇬 SGD</option>
                  <option value="KHR">🇰🇭 KHR</option>
                </select>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="control-select"
                >
                  <option value="2024">📅 2024</option>
                  <option value="2025">📅 2025</option>
                </select>
              </div>
            </div>
          </section>

          {/* Business Flow Modules */}
          <div style={{ padding: '24px' }}>
            {/* Module 1 */}
            <section className="module">
              <h2>Module 1: PPC Service Module</h2>
              <div className="charts-grid">
                <div className="chart-container">
                  <Line data={generateLineData()} />
                </div>
                <div className="chart-container">
                  <Bar data={generateBarData('New Customers', '#FBBF24')} />
                </div>
                <div className="chart-container">
                  <Bar data={generateBarData('Customer Group Join Volume', '#10B981')} />
                </div>
              </div>
            </section>

            {/* Module 2 */}
            <section className="module">
              <h2>Module 2: First Depositor Module</h2>
              <div className="charts-grid">
                <div className="chart-container">
                  <Bar data={generateBarData('2nd Deposit In Group', '#3B82F6')} />
                </div>
                <div className="chart-container">
                  <Bar data={generateBarData('2nd Deposit Not In Group', '#EF4444')} />
                </div>
              </div>
            </section>

            {/* Module 3 */}
            <section className="module">
              <h2>Module 3: Old Member Module</h2>
              <div className="charts-grid">
                <div className="chart-container">
                  <Bar data={generateBarData('Customer Count by Tier', '#60A5FA')} />
                </div>
                <div className="chart-container">
                  <Bar data={generateBarData('Upgraded Members by Tier', '#F59E0B')} />
                </div>
                <div className="chart-container">
                  <Bar data={generateBarData('Churned Members by Tier', '#EF4444')} />
                </div>
                <div className="chart-container">
                  <Bar data={generateBarData('Tier Upgrade Rate', '#D97706')} />
                </div>
              </div>
            </section>

            {/* Module 4 */}
            <section className="module">
              <h2>Module 4: Traffic Executive Module</h2>
              <div className="charts-grid">
                <div className="chart-container">
                  <Bar data={generateBarData('Reactivated by Tier', '#06B6D4')} />
                </div>
                <div className="chart-container">
                  <Doughnut data={generateDoughnutData()} />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <style jsx>{`
        .insights-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          position: relative;
          overflow: hidden;
        }

        .insights-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .insights-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 30px 0 20px;
          position: relative;
          z-index: 1;
        }

        .insights-title h1 {
          margin: 0 0 8px 0;
          color: white;
          font-size: 32px;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .insights-title p {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-weight: 300;
        }

        .insights-controls {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .control-select {
          padding: 12px 20px;
          border: none;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.95);
          color: #2E3A59;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .control-select:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .control-select:focus {
          background: white;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
        }

        .module {
          background: white;
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .module h2 {
          margin: 0 0 25px 0;
          color: #2E3A59;
          font-size: 24px;
          font-weight: bold;
          padding-bottom: 15px;
          border-bottom: 3px solid #008FFB;
          position: relative;
        }

        .module h2::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #008FFB, #00E396);
          border-radius: 2px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 25px;
        }

        .chart-container {
          background: #fafbfc;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e1e8ed;
          transition: all 0.3s ease;
        }

        .chart-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
          border-color: #008FFB;
        }

        @media (max-width: 1024px) {
          .insights-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .insights-controls {
            justify-content: center;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .insights-title h1 {
            font-size: 24px;
          }

          .control-select {
            padding: 10px 16px;
            font-size: 13px;
          }

          .module {
            padding: 20px;
            margin-bottom: 20px;
          }

          .module h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
} 