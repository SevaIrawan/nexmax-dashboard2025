import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useLastUpdate } from '../hooks/useLastUpdate';
import { getVisibleMenuItems } from '../lib/roles';

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

  // PROPER ROLE-BASED MENU LOGIC - EXACTLY AS BOSS REQUESTED
  const getMenuForRole = (userRole) => {
    if (!userRole) return [];
    
    const role = userRole.toLowerCase();
    
    // 1. Admin = All Access + User Management
    if (role === 'admin') {
      return [
        { path: '/', name: 'Overview', icon: '📊' },
        { path: '/strategic-executive', name: 'Strategic Executive', icon: '📈' },
        { path: '/business-flow', name: 'Business Flow', icon: '🔄' },
        { path: '/bgo', name: 'BGO', icon: '🎯' },
        { path: '/os', name: 'OS', icon: '⚙️' },
        { path: '/sr', name: 'SR', icon: '📋' },
        { path: '/xoo', name: 'XOO', icon: '🔧' },
        { 
          name: 'Transaction', 
          icon: '💰', 
          subItems: [
            { path: '/transaction/deposit', name: 'Deposit', icon: '💰' },
            { path: '/transaction/withdraw', name: 'Withdraw', icon: '💸' },
            { path: '/transaction/exchange', name: 'Exchange', icon: '🔄' },
            { path: '/transaction/headcount', name: 'Headcount', icon: '👥' },
            { path: '/transaction/adjustment', name: 'Adjustment', icon: '⚖️' },
            { path: '/transaction/vip-program', name: 'VIP Program', icon: '👑' },
            { path: '/transaction/new-depositor', name: 'New Depositor', icon: '🆕' },
            { path: '/transaction/member-report', name: 'Member Report', icon: '📊' }
          ]
        },
        { path: '/users', name: 'User Management', icon: '👤' }
      ];
    }
    
    // 2. Manager = Limited Access (Overview, Strategic Executive, Business Flow)
    if (role === 'manager') {
      return [
        { path: '/', name: 'Overview', icon: '📊' },
        { path: '/strategic-executive', name: 'Strategic Executive', icon: '📈' },
        { path: '/business-flow', name: 'Business Flow', icon: '🔄' }
      ];
    }
    
    // 3. Executive = Limited Access (Overview, Strategic Executive, Business Flow)
    if (role === 'executive') {
      return [
        { path: '/', name: 'Overview', icon: '📊' },
        { path: '/strategic-executive', name: 'Strategic Executive', icon: '📈' },
        { path: '/business-flow', name: 'Business Flow', icon: '🔄' }
      ];
    }
    
    // 4. & 5. Operator/User = All pages except User Management
    if (role === 'operator' || role === 'user') {
      return [
        { path: '/', name: 'Overview', icon: '📊' },
        { path: '/strategic-executive', name: 'Strategic Executive', icon: '📈' },
        { path: '/business-flow', name: 'Business Flow', icon: '🔄' },
        { path: '/bgo', name: 'BGO', icon: '🎯' },
        { path: '/os', name: 'OS', icon: '⚙️' },
        { path: '/sr', name: 'SR', icon: '📋' },
        { path: '/xoo', name: 'XOO', icon: '🔧' },
        { 
          name: 'Transaction', 
          icon: '💰', 
          subItems: [
            { path: '/transaction/deposit', name: 'Deposit', icon: '💰' },
            { path: '/transaction/withdraw', name: 'Withdraw', icon: '💸' },
            { path: '/transaction/exchange', name: 'Exchange', icon: '🔄' },
            { path: '/transaction/headcount', name: 'Headcount', icon: '👥' },
            { path: '/transaction/adjustment', name: 'Adjustment', icon: '⚖️' },
            { path: '/transaction/vip-program', name: 'VIP Program', icon: '👑' },
            { path: '/transaction/new-depositor', name: 'New Depositor', icon: '🆕' },
            { path: '/transaction/member-report', name: 'Member Report', icon: '📊' }
          ]
        }
        // NO USER MANAGEMENT for Operator/User
      ];
    }
    
    // Default fallback
    return [
      { path: '/', name: 'Overview', icon: '📊' }
    ];
  };

  const menuItemsToShow = user ? getMenuForRole(user.role) : [];

  // Convert role-based menu items to sidebar format
  const menuItems = menuItemsToShow.map(item => {
    if (item.subItems) {
      // Transaction menu with submenu
      return {
        key: 'transaction',
        icon: item.icon,
        label: item.name,
        href: '#',
        hasSubmenu: true,
        isActive: router.pathname.startsWith('/transaction'),
        submenu: item.subItems.map(subItem => ({
          label: subItem.name,
          href: subItem.path
        }))
      };
    } else {
      // Regular menu item
      const key = item.path === '/' ? 'overview' : item.path.replace('/', '');
      return {
        key: key,
        icon: item.icon,
        label: item.name,
        href: item.path,
        isActive: router.pathname === item.path
      };
    }
  });

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
            {menuItems.map(item => (
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
                          {item.submenu.map(subItem => (
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
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .sidebar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
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
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .header-section::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
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
          overflow: hidden !important;
          max-height: calc(100vh - 200px);
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .nav-menu::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
        }

        .nav-menu * {
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .nav-menu *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
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
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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
          max-height: 300px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Submenu */
        .submenu {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .submenu li {
          margin-bottom: 4px;
        }

        .submenu a {
          display: flex;
          align-items: center;
          padding: 8px 20px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .submenu a:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .submenu a.active {
          background: rgba(102, 126, 234, 0.3);
          color: white;
        }

        .sub-icon {
          width: 20px;
          text-align: center;
          color: #667eea;
        }

        .sub-label {
          margin-left: 8px;
          font-size: 0.9rem;
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
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .last-update-section::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
        }

        /* FORCE ALL SIDEBAR CHILDREN TO HAVE NO SCROLL */
        .sidebar *,
        .sidebar *::before,
        .sidebar *::after {
          overflow: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .sidebar *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
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

        /* Scrollbar untuk SUBMENU ONLY */
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