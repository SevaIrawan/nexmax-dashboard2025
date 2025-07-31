import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useLastUpdate } from '../hooks/useLastUpdate';
import { hasPageAccess } from '../lib/roles';

export default function Sidebar({ user, onExpandedChange }) {
  const [isExpanded, setIsExpanded] = useState(true); // DEFAULT EXPANDABLE
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const router = useRouter();
  const { lastUpdate, loading: lastUpdateLoading } = useLastUpdate();

  // Auto-expand submenu jika user berada di halaman submenu
  useEffect(() => {
    if (router.pathname.startsWith('/transaction')) {
      setExpandedSubmenu('transaction');
    }
  }, [router.pathname]);

  // Notify parent component about expansion state changes
  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded);
    }
  }, [isExpanded, onExpandedChange]);

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

  // Toggle submenu - hanya tutup jika user manual klik
  const toggleSubmenu = (menuKey) => {
    setExpandedSubmenu(current => current === menuKey ? null : menuKey);
  };

  const menuItems = [
    { 
      key: 'overview',
      icon: '📊', 
      label: 'Overview', 
      href: '/',
      isActive: router.pathname === '/',
      show: user ? hasPageAccess(user.role, '/') : false
    },
    { 
      key: 'strategic',
      icon: '🎯', 
      label: 'Strategic Executive', 
      href: '/strategic-executive',
      isActive: router.pathname === '/strategic-executive',
      show: user ? hasPageAccess(user.role, '/strategic-executive') : false
    },
    { 
      key: 'business',
      icon: '💼', 
      label: 'Business Flow', 
      href: '/business-flow',
      isActive: router.pathname === '/business-flow',
      show: user ? hasPageAccess(user.role, '/business-flow') : false
    },
    { 
      key: 'bgo',
      icon: '🚀', 
      label: 'BGO', 
      href: '/bgo',
      isActive: router.pathname === '/bgo',
      show: user ? hasPageAccess(user.role, '/bgo') : false
    },
    { 
      key: 'sr',
      icon: '📋', 
      label: 'S&R', 
      href: '/sr',
      isActive: router.pathname === '/sr',
      show: user ? hasPageAccess(user.role, '/sr') : false
    },
    { 
      key: 'xoo',
      icon: '🔄', 
      label: 'XOO', 
      href: '/xoo',
      isActive: router.pathname === '/xoo',
      show: user ? hasPageAccess(user.role, '/xoo') : false
    },
    { 
      key: 'os',
      icon: '⚙️', 
      label: 'OS', 
      href: '/os',
      isActive: router.pathname === '/os',
      show: user ? hasPageAccess(user.role, '/os') : false
    },
    { 
      key: 'transaction',
      icon: '💳', 
      label: 'Transaction', 
      href: '#',
      hasSubmenu: true,
      isActive: router.pathname.startsWith('/transaction'),
      show: user ? (hasPageAccess(user.role, '/transaction/deposit') || 
                   hasPageAccess(user.role, '/transaction/withdraw') || 
                   hasPageAccess(user.role, '/transaction/exchange') || 
                   hasPageAccess(user.role, '/transaction/headcount') || 
                   hasPageAccess(user.role, '/transaction/adjustment') || 
                   hasPageAccess(user.role, '/transaction/vip-program') || 
                   hasPageAccess(user.role, '/transaction/new-depositor') || 
                   hasPageAccess(user.role, '/transaction/member-report') || 
                   hasPageAccess(user.role, '/transaction/new-register')) : false,
      submenu: [
        { 
          label: 'Deposit Transaction', 
          href: '/transaction/deposit',
          show: user ? hasPageAccess(user.role, '/transaction/deposit') : false
        },
        { 
          label: 'Withdraw Transaction', 
          href: '/transaction/withdraw',
          show: user ? hasPageAccess(user.role, '/transaction/withdraw') : false
        },
        { 
          label: 'Member Report', 
          href: '/transaction/member-report',
          show: user ? hasPageAccess(user.role, '/transaction/member-report') : false
        },
        { 
          label: 'Exchange', 
          href: '/transaction/exchange',
          show: user ? hasPageAccess(user.role, '/transaction/exchange') : false
        },
        { 
          label: 'Headcount', 
          href: '/transaction/headcount',
          show: user ? hasPageAccess(user.role, '/transaction/headcount') : false
        },
        { 
          label: 'New Register', 
          href: '/transaction/new-register',
          show: user ? hasPageAccess(user.role, '/transaction/new-register') : false
        },
        { 
          label: 'New Depositor', 
          href: '/transaction/new-depositor',
          show: user ? hasPageAccess(user.role, '/transaction/new-depositor') : false
        },
        { 
          label: 'Adjustment', 
          href: '/transaction/adjustment',
          show: user ? hasPageAccess(user.role, '/transaction/adjustment') : false
        },
        { 
          label: 'VIP Program', 
          href: '/transaction/vip-program',
          show: user ? hasPageAccess(user.role, '/transaction/vip-program') : false
        }
      ]
    },
    { 
      key: 'users',
      icon: '👤', 
      label: 'User Management', 
      href: '/users',
      isActive: router.pathname === '/users',
      show: user ? hasPageAccess(user.role, '/users') : false
    }
  ];

  return (
    <>
      <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Company Logo + Professional Toggle */}
        <div className="header-section">
          <div className="logo-container">
            <div className="company-logo">
              <Image src="/logo.jpg" alt="NEXMAX" className="logo-image" width={40} height={40} />
            </div>
            {isExpanded && (
              <div className="company-text">
                <h3>NEXMAX</h3>
                <span>Dashboard</span>
              </div>
            )}
          </div>
          
          {/* Professional Toggle Button */}
          <button 
            className="professional-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Minimize Sidebar' : 'Expand Sidebar'}
          >
            {isExpanded ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <ul>
            {menuItems.filter(item => item.show).map(item => (
              <li key={item.key} className={item.isActive ? 'active' : ''}>
                {item.hasSubmenu ? (
                  <>
                    <button 
                      className="menu-button"
                      onClick={() => toggleSubmenu(item.key)}
                      data-tooltip={item.label}
                    >
                      <span className="icon">{item.icon}</span>
                      {isExpanded && (
                        <>
                          <span className="label">{item.label}</span>
                          <span className="arrow">
                            {expandedSubmenu === item.key ? (
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M7.41 8.84L12 13.42l4.59-4.58L18 10.25l-6 6-6-6z"/>
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                              </svg>
                            )}
                          </span>
                        </>
                      )}
                    </button>
                    
                    {/* Submenu - PERSISTENT dengan SCROLL */}
                    {isExpanded && expandedSubmenu === item.key && (
                      <div className="submenu-container">
                        <ul className="submenu">
                          {item.submenu.filter(subItem => subItem.show).map(subItem => (
                            <li key={subItem.href}>
                              <a 
                                href={subItem.href}
                                className={router.pathname === subItem.href ? 'active' : ''}
                              >
                                <span className="sub-icon">•</span>
                                <span className="sub-label">{subItem.label}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <a href={item.href} className="menu-link" data-tooltip={item.label}>
                    <span className="icon">{item.icon}</span>
                    {isExpanded && <span className="label">{item.label}</span>}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Last Update Section */}
        <div className="last-update-section">
          <div className="last-update-item" data-tooltip="Last Update">
            {isExpanded && (
              <div className="update-content">
                <span className="update-text-single">
                  {lastUpdateLoading ? 'Loading...' : `LAST UPDATE: ${formatLastUpdate(lastUpdate).replace('🔄 Data Updated: ', '')}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Add global style to adjust main content based on sidebar state */}
      <style jsx global>{`
        .main-content {
          margin-left: ${isExpanded ? '280px' : '75px'} !important;
          transition: margin-left 0.3s ease;
        }
      `}</style>

      <style jsx>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: linear-gradient(180deg, #1a1d29 0%, #2d3142 100%);
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          z-index: 999;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
          border-right: none;
          border-top: none;
          border-bottom: none;
          overflow: hidden;
        }

        .sidebar.collapsed {
          width: 75px;
        }

        .sidebar.expanded {
          width: 280px;
        }

        /* Professional Header Section - EXACT HEIGHT MATCH */
        .header-section {
          padding: 20px 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          height: 85px;
          box-sizing: border-box;
          margin: 0;
          background: transparent;
          border-left: none;
          border-right: none;
          border-top: none;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .company-logo {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 2px solid #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .company-text {
          opacity: 1;
          transform: translateX(0);
          transition: all 0.3s ease;
        }

        .company-text h3 {
          margin: 0;
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .company-text span {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        /* Professional Toggle Button */
        .professional-toggle {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: #cbd5e1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .professional-toggle:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.25);
          color: white;
          transform: scale(1.05);
        }

        .professional-toggle:active {
          transform: scale(0.95);
        }

        .professional-toggle svg {
          transition: transform 0.2s ease;
        }

        /* Navigation Menu */
        .nav-menu {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .nav-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-menu > ul > li {
          margin-bottom: 8px;
        }

        .menu-link, .menu-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 20px;
          color: #cbd5e1;
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 0;
        }

        .menu-link:hover, .menu-button:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .nav-menu .active > .menu-link,
        .nav-menu .active > .menu-button {
          background: linear-gradient(90deg, #4f46e5 0%, #6366f1 100%);
          color: white;
          font-weight: 600;
        }

        .icon {
          font-size: 1.2rem;
          width: 35px;
          text-align: center;
          flex-shrink: 0;
        }

        .label {
          margin-left: 12px;
          flex: 1;
          text-align: left;
          font-weight: 500;
        }

        .arrow {
          margin-left: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        /* Submenu Container dengan SCROLL */
        .submenu-container {
          background: rgba(0,0,0,0.2);
          border-left: 2px solid #667eea;
          margin-left: 20px;
          margin-top: 4px;
          margin-bottom: 8px;
          max-height: 250px;
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 0 8px 8px 0;
          padding: 8px 0;
        }

        /* Submenu */
        .submenu {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .submenu li {
          margin-bottom: 2px;
        }

        .submenu a {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          border-radius: 0 6px 6px 0;
          margin: 0 4px;
        }

        .submenu a:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .submenu a.active {
          background: rgba(102, 126, 234, 0.3);
          color: white;
          font-weight: 500;
        }

        .sub-icon {
          width: 20px;
          text-align: center;
          color: #667eea;
          font-size: 0.8rem;
          margin-right: 8px;
        }

        .sub-label {
          font-size: 0.85rem;
          font-weight: 400;
          flex: 1;
        }

        /* Logout Section */
        .logout-section {
          padding: 20px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        .last-update-section {
          margin-top: auto;
          padding: 16px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .last-update-item {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          color: #fbbf24;
          font-size: 0.9rem;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.15));
          border-radius: 10px;
          margin: 0 12px;
          border: 1px solid rgba(251, 191, 36, 0.4);
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
          position: relative;
          overflow: hidden;
        }

        .last-update-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .update-content {
          display: flex;
          align-items: center;
          flex: 1;
          width: 100%;
        }

        .update-text-single {
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.3;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.2px;
          width: 100%;
          text-align: center;
        }

        /* Scrollbar untuk Main Menu */
        .nav-menu::-webkit-scrollbar {
          width: 4px;
        }

        .nav-menu::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-menu::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }

        /* Scrollbar untuk SUBMENU */
        .submenu-container::-webkit-scrollbar {
          width: 4px;
        }

        .submenu-container::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }

        .submenu-container::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.5);
          border-radius: 2px;
        }

        .submenu-container::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.7);
        }

        /* Tooltip for collapsed state */
        .sidebar.collapsed .menu-link,
        .sidebar.collapsed .menu-button,
        .sidebar.collapsed .last-update-item {
          position: relative;
        }

        .sidebar.collapsed .menu-link:hover::after,
        .sidebar.collapsed .menu-button:hover::after,
        .sidebar.collapsed .last-update-item:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: #1f2937;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          white-space: nowrap;
          z-index: 1002;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  );
}