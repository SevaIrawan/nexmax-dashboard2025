import { useState, useEffect } from 'react';
import { useRoleAccess } from '../hooks/useRoleAccess';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function BusinessFlow() {
  const { user, loading: authLoading } = useRoleAccess('/business-flow');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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
          title="Business Flow"
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

        {/* CONTENT */}
        <div style={{ marginTop: '185px', padding: '24px' }}>
          <div className="coming-soon-container">
            <div className="coming-soon-card">
              <div className="icon-large">🔄</div>
              <h1>Business Flow</h1>
              <p>Business Flow dashboard with strategic modules.</p>
              <div className="features-list">
                <div className="feature-item">📊 PPC Service</div>
                <div className="feature-item">👤 First Depositor</div>
                <div className="feature-item">👥 Old Member</div>
                <div className="feature-item">🚀 Traffic Executive</div>
              </div>
              <div className="status-badge">Ready for Development</div>
            </div>
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
        
        .coming-soon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }
        
        .coming-soon-card {
          background: white;
          border-radius: 12px;
          padding: 48px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          max-width: 500px;
        }
        
        .icon-large {
          font-size: 4rem;
          margin-bottom: 24px;
        }
        
        .coming-soon-card h1 {
          font-size: 2rem;
          margin: 0 0 16px 0;
          color: #1f2937;
        }
        
        .coming-soon-card p {
          font-size: 1.1rem;
          color: #6b7280;
          margin: 0 0 32px 0;
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
        }
        
        .status-badge {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 8px 24px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
} 