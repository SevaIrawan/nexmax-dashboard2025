import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// CENTRALIZED LAYOUT - SAME SIZES AS MAIN DASHBOARD FOR ALL PAGES
export default function Layout({ 
  children, 
  pageTitle = "NEXMAX Dashboard", 
  showSubHeader = false,
  subHeaderContent = null,
  className = "" 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // STANDARD SIZES - SAME AS MAIN DASHBOARD
  const HEADER_HEIGHT = '80px';
  const SUBHEADER_HEIGHT = '100px'; // UPDATED TO MATCH MAIN DASHBOARD
  const SIDEBAR_WIDTH = '250px';
  const SIDEBAR_COLLAPSED_WIDTH = '80px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '0' : '0', 
        transition: 'margin-left 0.3s ease' 
      }}>
        <Header 
          pageTitle={pageTitle} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        {showSubHeader && (
          <div style={{
            position: 'fixed',
            top: '85px', // SAME AS MAIN DASHBOARD 
            left: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
            right: '0',
            minHeight: SUBHEADER_HEIGHT, // SAME AS MAIN DASHBOARD
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', // SAME AS MAIN DASHBOARD
            zIndex: 900,
            transition: 'left 0.3s ease',
            overflow: 'hidden'
          }}>
            {subHeaderContent}
          </div>
        )}
        
        <div 
          className={`main-content ${className}`}
          style={{
            marginTop: showSubHeader ? `calc(${HEADER_HEIGHT} + ${SUBHEADER_HEIGHT} + 5px)` : HEADER_HEIGHT,
            padding: '32px',
            minHeight: showSubHeader ? 
              `calc(100vh - ${HEADER_HEIGHT} - ${SUBHEADER_HEIGHT})` : 
              `calc(100vh - ${HEADER_HEIGHT})`,
            transition: 'margin-top 0.3s ease',
            overflow: 'auto'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
} 