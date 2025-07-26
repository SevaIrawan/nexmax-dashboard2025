import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function BusinessFlow() {
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
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    <div className="app-layout">
      <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      <div className="main-content">
        <Header user={user} sidebarExpanded={sidebarExpanded} />
        <main style={{ 
          padding: '32px', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
          minHeight: 'calc(100vh - 85px)' 
        }}>
          <div className="coming-soon-container">
            <div className="coming-soon-card">
              <div className="icon-large">💼</div>
              <h1>Business Flow</h1>
              <p>Business process management and workflow optimization tools are coming soon.</p>
              <div className="features-list">
                <div className="feature-item">🔄 Process Management</div>
                <div className="feature-item">📋 Workflow Optimization</div>
                <div className="feature-item">📊 Process Analytics</div>
                <div className="feature-item">⚡ Automation Tools</div>
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
              margin-bottom: 1.5rem;
              display: block;
            }

            h1 {
              color: #1e293b;
              font-size: 2.5rem;
              margin-bottom: 1rem;
              font-weight: 700;
            }

            p {
              color: #64748b;
              font-size: 1.1rem;
              margin-bottom: 2rem;
              line-height: 1.6;
            }

            .features-list {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1rem;
              margin-bottom: 2rem;
            }

            .feature-item {
              background: #f1f5f9;
              padding: 1rem;
              border-radius: 10px;
              color: #475569;
              font-weight: 500;
              border: 1px solid #e2e8f0;
            }

            .status-badge {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 0.75rem 2rem;
              border-radius: 50px;
              font-weight: 600;
              display: inline-block;
              font-size: 0.9rem;
              letter-spacing: 0.5px;
            }

            @media (max-width: 768px) {
              .features-list {
                grid-template-columns: 1fr;
              }

              .coming-soon-card h1 {
                font-size: 2rem;
              }
            }
          `}</style>
        </main>
      </div>
    </div>
  );
} 