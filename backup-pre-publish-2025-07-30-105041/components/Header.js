import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';

export default function Header({ title, sidebarExpanded = true, setSidebarExpanded }) {
  const router = useRouter();
  const { user } = useAuth(); // Get user from auth hook

  const getPageTitle = () => {
    if (title) return title; // Use custom title if provided
    
    switch (router.pathname) {
      case '/':
        return 'Main Dashboard';
      case '/users':
        return 'User Management';
      case '/strategic-executive':
        return 'Strategic Executive';
      case '/business-flow':
        return 'Business Flow';
      case '/bgo':
        return 'BGO Dashboard';
      case '/sr':
        return 'S&R Dashboard';
      case '/xoo':
        return 'XOO Dashboard';
      case '/os':
        return 'OS Dashboard';
      case '/transaction/member-report':
        return 'Member Report';
      case '/transaction/deposit':
        return 'Deposit Transaction';
      case '/transaction/withdraw':
        return 'Withdraw Transaction';
      case '/transaction/new-depositor':
        return 'New Depositor';
      case '/transaction/vip-program':
        return 'VIP Program';
      case '/transaction/adjustment':
        return 'Adjustment';
      case '/transaction/headcount':
        return 'Headcount';
      case '/transaction/exchange':
        return 'Exchange';
      default:
        return 'NEXMAX Dashboard';
    }
  };

  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout...');
      
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        console.log('✅ Logout API success');
      } else {
        console.log('⚠️ Logout API failed, but continuing...');
      }
    } catch (error) {
      console.error('❌ Logout API error:', error);
    }
    
    try {
      document.cookie = 'user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'; 
      document.cookie = 'user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
      console.log('🍪 Cookies cleared manually');
    } catch (cookieError) {
      console.error('Cookie clear error:', cookieError);
    }
    
    console.log('🔄 Redirecting to login...');
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="title-section">
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
        </div>
        
        <div className="header-right">
          {/* Welcome Message */}
          {user && (
            <div className="user-welcome">
              <span className="welcome-icon">👋</span>
              <span className="welcome-text">Welcome, <strong>{user.username}</strong></span>
            </div>
          )}
          
          {/* Malaysian Flag */}
          <div className="malaysia-flag">
            <Image 
              src="/malaysia-flag.png" 
              alt="Malaysia" 
              className="flag-image" 
              width={32} 
              height={24} 
            />
          </div>

          {/* Beautiful Logout Button */}
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <div className="logout-content">
              <span className="logout-text">Logout</span>
            </div>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: linear-gradient(135deg, #1a1d29 0%, #2d3142 50%, #1a1d29 100%);
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          height: 85px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        .header-content {
          width: 100%;
          max-width: 100%;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          height: 100%;
        }
        
        .title-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          height: 100%;
        }
        
        .page-title {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
          height: 100%;
        }
        
        .user-welcome {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .welcome-icon {
          font-size: 1.2rem;
          animation: wave 2s ease-in-out infinite;
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        
        .welcome-text {
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .welcome-text strong {
          color: #ffd700;
          font-weight: 700;
        }
        
        .malaysia-flag {
          display: flex;
          align-items: center;
          padding: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .malaysia-flag:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        
        .flag-image {
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .logout-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
          border: none;
          border-radius: 12px;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .logout-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .logout-btn:hover:before {
          left: 100%;
        }
        
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
        }
        
        .logout-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
        }
        
        .logout-content {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          position: relative;
          z-index: 1;
        }
        
        .logout-icon {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }
        
        .logout-btn:hover .logout-icon {
          transform: rotate(15deg);
        }
        
        .logout-text {
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          .header-content {
            padding: 0 16px;
            gap: 12px;
          }
          
          .page-title {
            font-size: 1.4rem;
          }
          
          .user-welcome {
            display: none;
          }
          
          .header-right {
            gap: 12px;
          }
        }
      `}</style>
    </header>
  );
}