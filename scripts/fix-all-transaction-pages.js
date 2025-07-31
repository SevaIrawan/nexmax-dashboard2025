const fs = require('fs');
const path = require('path');

// Template untuk "Coming Soon" page
const comingSoonTemplate = (pageName, title) => `import { useState } from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function ${pageName}() {
  const { user, loading: authLoading } = useRoleAccess('/transaction/${pageName.toLowerCase()}');
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
      <div className={\`dashboard-content \${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}\`}>
        <Header 
          title="${title}"
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
            fontSize: '1.2rem', 
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Coming Soon
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ 
          marginTop: '185px',
          marginLeft: sidebarExpanded ? '0px' : '0px',
          padding: '20px',
          height: 'calc(100vh - 185px)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ fontSize: '48px' }}>🚧</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              Coming Soon
            </div>
            <div style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center' }}>
              ${title} page is under development.<br />
              We&apos;re working hard to bring you this feature soon!
            </div>
          </div>
        </div>
      </div>

      <style jsx>{\`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
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
      \`}</style>
    </div>
  );
}`;

// Daftar file yang perlu diubah
const filesToUpdate = [
  { file: 'pages/transaction/adjustment.js', name: 'Adjustment', title: 'Adjustment Transactions' },
  { file: 'pages/transaction/deposit.js', name: 'Deposit', title: 'Deposit Transactions' },
  { file: 'pages/transaction/exchange.js', name: 'Exchange', title: 'Exchange Transactions' },
  { file: 'pages/transaction/headcount.js', name: 'Headcount', title: 'Headcount Transactions' },
  { file: 'pages/transaction/member-report.js', name: 'MemberReport', title: 'Member Report' },
  { file: 'pages/transaction/new-depositor.js', name: 'NewDepositor', title: 'New Depositor' },
  { file: 'pages/transaction/new-register.js', name: 'NewRegister', title: 'New Register' }
];

console.log('🔄 Mengubah semua transaction pages menjadi "Coming Soon"...');

filesToUpdate.forEach(({ file, name, title }) => {
  try {
    const content = comingSoonTemplate(name, title);
    fs.writeFileSync(file, content);
    console.log(`✅ ${file} - Updated`);
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
  }
});

console.log('✅ Semua transaction pages telah diubah menjadi "Coming Soon" template!'); 