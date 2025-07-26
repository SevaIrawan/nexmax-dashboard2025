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

export default function StrategicExecutive() {
  const { user, loading: authLoading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Module 1 */}
          <section className="module">
            <h2>Module 1: PPC Service Module</h2>
            <Line data={generateLineData()} />
            <Bar data={generateBarData('New Customers', '#FBBF24')} />
            <Bar data={generateBarData('Customer Group Join Volume', '#10B981')} />
          </section>

          {/* Module 2 */}
          <section className="module">
            <h2>Module 2: First Depositor Module</h2>
            <Bar data={generateBarData('2nd Deposit In Group', '#3B82F6')} />
            <Bar data={generateBarData('2nd Deposit Not In Group', '#EF4444')} />
          </section>

          {/* Module 3 */}
          <section className="module">
            <h2>Module 3: Old Member Module</h2>
            <Bar data={generateBarData('Customer Count by Tier', '#60A5FA')} />
            <Bar data={generateBarData('Upgraded Members by Tier', '#F59E0B')} />
            <Bar data={generateBarData('Churned Members by Tier', '#EF4444')} />
            <Bar data={generateBarData('Tier Upgrade Rate', '#D97706')} />
          </section>

          {/* Module 4 */}
          <section className="module">
            <h2>Module 4: Traffic Executive Module</h2>
            <Bar data={generateBarData('Reactivated by Tier', '#06B6D4')} />
            <Doughnut data={generateDoughnutData()} />
          </section>
        </main>
      </div>
    </div>
  );
}
