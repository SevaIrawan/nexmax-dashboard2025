import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Header({ user, sidebarExpanded = true }) {
  const router = useRouter();

  const getPageTitle = () => {
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
        return 'Dashboard';
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
          {user && (
            <div className="user-welcome">
              <span className="welcome-text">Welcome, <strong>{user.username}</strong></span>
            </div>
          )}
          
          {/* Malaysian Flag Image */}
          <div className="malaysia-flag">
            <Image src="/malaysia-flag.png" alt="Malaysia" className="flag-image" width={32} height={24} />
          </div>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: ${sidebarExpanded ? '0px' : '0px'};
          right: 0;
          z-index: 999;
          background: linear-gradient(180deg, #1a1d29 0%, #2d3142 100%);
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: 85px;
          display: flex;
          align-items: center;
          transition: left 0.3s ease;
          margin: 0;
          padding: 0;
          margin-left: -1px;
          overflow: hidden;
          -webkit-overflow-scrolling: touch;
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
          font-size: 2.25rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.4px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
          line-height: 1.1;
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: 16px;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.4);
        }

        .logout-icon {
          font-size: 1rem;
        }

        .logout-text {
          font-size: 0.9rem;
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
          font-size: 0.9rem;
        }
        
        .welcome-text {
          color: #e2e8f0;
          font-weight: 500;
        }
        
        .welcome-text strong {
          color: #ffffff;
          font-weight: 700;
        }
        
        .malaysia-flag {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 5px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          overflow: hidden;
        }
        
        .flag-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .malaysia-flag:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .header {
            height: 75px;
            left: 0;
            right: 0;
          }
          
          .header-content {
            padding: 0 20px;
          }
          
          .title-section {
            gap: 2px;
          }
          
          .page-title {
            font-size: 1.3rem;
          }
          
          .update-label,
          .update-time {
            font-size: 0.75rem;
          }
          
          .user-welcome {
            font-size: 0.85rem;
          }
          
          .malaysia-flag {
            width: 32px;
            height: 32px;
            padding: 4px;
          }
        }
        
        @media (max-width: 480px) {
          .header-content {
            flex-direction: column;
            gap: 12px;
            padding: 12px 20px;
          }
          
          .header {
            height: auto;
            min-height: 90px;
          }
          
          .title-section {
            text-align: center;
            gap: 3px;
          }
          
          .header-right {
            gap: 16px;
          }
        }
      `}</style>
    </header>
  );
}