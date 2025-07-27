import { useState, useEffect } from 'react';
import { useRoleAccess } from '../hooks/useRoleAccess';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function SR() {
  const { user, loading: authLoading } = useRoleAccess('/sr');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      <div className={`dashboard-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          title="SR Dashboard"
          user={user}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />

        {/* SUB HEADER - STANDARD SIZE */}
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
          
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center' 
          }}>
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
              Slicers will be configured when page is developed
            </span>
          </div>
        </div>

        {/* CONTENT - PROPERLY POSITIONED */}
        <div style={{ 
          marginTop: '185px',
          padding: '40px',
          minHeight: 'calc(100vh - 185px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="coming-soon-card">
            <div className="icon-large">📋</div>
            <h1>S&R</h1>
            <p>Sales & Revenue analytics dashboard is currently under development.</p>
            <div className="features-list">
              <div className="feature-item">💰 Revenue Analytics</div>
              <div className="feature-item">📈 Sales Performance</div>
              <div className="feature-item">🎯 Target Tracking</div>
              <div className="feature-item">📊 Revenue Forecasting</div>
            </div>
            <div className="status-badge">Coming Soon</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }
        
        .dashboard-content {
          flex: 1;
          transition: margin-left 0.3s ease;
        }
        
        .sidebar-expanded {
          margin-left: 280px;
        }
        
        .sidebar-collapsed {
          margin-left: 75px;
        }
        
        .coming-soon-card {
          background: white;
          border-radius: 16px;
          padding: 60px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
        }
        
        .icon-large {
          font-size: 5rem;
          margin-bottom: 32px;
          opacity: 0.8;
        }
        
        .coming-soon-card h1 {
          font-size: 2.5rem;
          margin: 0 0 20px 0;
          color: #1f2937;
          font-weight: 700;
        }
        
        .coming-soon-card p {
          font-size: 1.2rem;
          color: #6b7280;
          margin: 0 0 40px 0;
          line-height: 1.6;
        }
        
        .features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 40px;
        }
        
        .feature-item {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          font-weight: 500;
          color: #374151;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        
        .feature-item:hover {
          background: #fef3c7;
          border-color: #f59e0b;
          transform: translateY(-2px);
        }
        
        .status-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 12px 32px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }
        
        @media (max-width: 768px) {
          .coming-soon-card {
            padding: 40px 20px;
            margin: 20px;
          }
          
          .features-list {
            grid-template-columns: 1fr;
          }
          
          .coming-soon-card h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
} 