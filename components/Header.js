import { useRouter } from 'next/router';
import { useLastUpdate } from '../hooks/useLastUpdate';
import Image from 'next/image';

export default function Header({ user, sidebarExpanded = true }) {
  const router = useRouter();
  const { lastUpdate, loading: lastUpdateLoading } = useLastUpdate();

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

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return `🔄 Data Updated: ${new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    })}`;
    
    // If timestamp already contains the full formatted string, return as is
    if (typeof timestamp === 'string' && timestamp.includes('🔄 Data Updated:')) {
      return timestamp;
    }
    
    // Otherwise format as date
    try {
      return `🔄 Data Updated: ${new Date(timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      })}`;
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="title-section">
            <h1 className="page-title">{getPageTitle()}</h1>
            <div className="last-update">
              <span className="update-time">
                {lastUpdateLoading ? '🔄 Loading...' : formatLastUpdate(lastUpdate)}
              </span>
            </div>
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
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.3px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          line-height: 1.2;
        }
        
        .last-update {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .update-label {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 500;
        }
        
        .update-time {
          font-size: 0.8rem;
          color: #fbbf24;
          font-weight: 600;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15));
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(251, 191, 36, 0.3);
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