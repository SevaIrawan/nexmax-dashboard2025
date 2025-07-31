import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function VipProgram() {
  const { user, loading: authLoading } = useAuth();
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
          title="VIP Program"
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
          transition: 'left 0.3s ease'
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
          height: 'calc(100vh - 185px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <div className="coming-soon-card">
            <div className="icon-large">💎</div>
            <h1>VIP Program</h1>
            <p>VIP member management and exclusive benefits analytics dashboard is currently under development.</p>
            <div className="features-list">
              <div className="feature-item">💎 VIP Tiers</div>
              <div className="feature-item">🎁 Benefits Tracking</div>
              <div className="feature-item">👑 Member Analytics</div>
              <div className="feature-item">📈 Program Performance</div>
            </div>
            <div className="status-badge">Coming Soon</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          background: #f8f9fa;
          overflow: hidden;
        }
        
        .dashboard-content {
          flex: 1;
          transition: margin-left 0.3s ease;
          overflow: hidden;
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
          padding: 40px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
        }
        
        .icon-large {
          font-size: 4rem;
          margin-bottom: 24px;
          opacity: 0.8;
        }
        
        .coming-soon-card h1 {
          font-size: 2rem;
          margin: 0 0 16px 0;
          color: #1f2937;
          font-weight: 700;
        }
        
        .coming-soon-card p {
          font-size: 1rem;
          color: #6b7280;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }
        
        .features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }
        
        .feature-item {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          font-weight: 500;
          color: #374151;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .feature-item:hover {
          background: #f3e8ff;
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }
        
        .status-badge {
          display: inline-block;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          padding: 12px 32px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
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