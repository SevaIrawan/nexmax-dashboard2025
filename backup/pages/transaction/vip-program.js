import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function VIPProgram() {
  const { user, loading: authLoading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div className="loading-spinner">⚡</div>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      <div className="main-content">
        <Header user={user} hideFilters={true} />
        <main style={{ 
          padding: '32px', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
          minHeight: 'calc(100vh - 85px)' 
        }}>
          <div className="coming-soon-container">
            <div className="coming-soon-card">
              <div className="icon-large">👑</div>
              <h1>VIP Program</h1>
              <p>Manage and track VIP member benefits and exclusive programs.</p>
              <div className="features-list">
                <div className="feature-item">👑 VIP Tier Management</div>
                <div className="feature-item">🎁 Reward Programs</div>
                <div className="feature-item">📊 Member Analytics</div>
                <div className="feature-item">💎 Exclusive Benefits</div>
              </div>
              <div className="status-badge">Coming Soon</div>
            </div>
          </div>

          <style jsx>{`
            .coming-soon-container {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 70vh;
            }

            .coming-soon-card {
              background: white;
              border-radius: 16px;
              padding: 48px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              max-width: 500px;
              width: 100%;
            }

            .icon-large {
              font-size: 4rem;
              margin-bottom: 24px;
            }

            .coming-soon-card h1 {
              color: #1f2937;
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 16px;
            }

            .coming-soon-card p {
              color: #6b7280;
              font-size: 1.1rem;
              margin-bottom: 32px;
              line-height: 1.6;
            }

            .features-list {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-bottom: 32px;
            }

            .feature-item {
              background: #f8fafc;
              padding: 16px;
              border-radius: 8px;
              font-weight: 500;
              color: #374151;
            }

            .status-badge {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 24px;
              border-radius: 25px;
              font-weight: 600;
              font-size: 1.1rem;
            }
          `}</style>
        </main>
      </div>
    </div>
  );
} 