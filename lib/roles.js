// Role-based Access Control Configuration
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  EXECUTIVE: 'executive',
  OPERATOR: 'operator',
  USER: 'user'
};

// Page access configuration for each role
export const PAGE_ACCESS = {
  [ROLES.ADMIN]: {
    // Admin = All Access + User Management
    canAccess: ['*'], // All pages
    canManageUsers: true,
    isReadOnly: false,
    canExportData: true
  },
  
  [ROLES.MANAGER]: {
    // Manager = Limited Access (Overview, Strategic Executive, Business Flow)
    canAccess: [
      '/', // Main Dashboard (Overview)
      '/strategic-executive',
      '/business-flow'
    ],
    canManageUsers: false,
    isReadOnly: false,
    canExportData: false
  },
  
  [ROLES.EXECUTIVE]: {
    // Executive = Limited Access (Overview, Strategic Executive, Business Flow)
    canAccess: [
      '/', // Main Dashboard (Overview)
      '/strategic-executive', 
      '/business-flow'
    ],
    canManageUsers: false,
    isReadOnly: false,
    canExportData: false
  },
  
  [ROLES.OPERATOR]: {
    // Operator = Limited Access, Read only, Export data, All pages except User Management
    canAccess: [
      '/', // Main Dashboard
      '/strategic-executive',
      '/business-flow',
      '/bgo',
      '/os', 
      '/sr',
      '/xoo',
      '/transaction/deposit',
      '/transaction/withdraw',
      '/transaction/exchange',
      '/transaction/headcount',
      '/transaction/adjustment',
      '/transaction/vip-program',
      '/transaction/new-depositor',
      '/transaction/member-report'
    ],
    canManageUsers: false,
    isReadOnly: true,
    canExportData: true
  },
  
  [ROLES.USER]: {
    // User = Limited Access, Read only, Export data, All pages except User Management
    canAccess: [
      '/', // Main Dashboard
      '/strategic-executive',
      '/business-flow',
      '/bgo',
      '/os',
      '/sr', 
      '/xoo',
      '/transaction/deposit',
      '/transaction/withdraw',
      '/transaction/exchange',
      '/transaction/headcount',
      '/transaction/adjustment',
      '/transaction/vip-program',
      '/transaction/new-depositor',
      '/transaction/member-report'
    ],
    canManageUsers: false,
    isReadOnly: true,
    canExportData: true
  }
};

// Function to check if user has access to a specific page
export function hasPageAccess(userRole, pagePath) {
  if (!userRole || !PAGE_ACCESS[userRole]) {
    return false;
  }
  
  const roleConfig = PAGE_ACCESS[userRole];
  
  // Admin has access to everything
  if (roleConfig.canAccess.includes('*')) {
    return true;
  }
  
  // Check if specific page is in allowed list
  return roleConfig.canAccess.includes(pagePath);
}

// Function to check if user can manage other users
export function canManageUsers(userRole) {
  if (!userRole || !PAGE_ACCESS[userRole]) {
    return false;
  }
  
  return PAGE_ACCESS[userRole].canManageUsers;
}

// Function to check if user has read-only access
export function isReadOnly(userRole) {
  if (!userRole || !PAGE_ACCESS[userRole]) {
    return true; // Default to read-only for safety
  }
  
  return PAGE_ACCESS[userRole].isReadOnly;
}

// Function to check if user can export data
export function canExportData(userRole) {
  if (!userRole || !PAGE_ACCESS[userRole]) {
    return false;
  }
  
  return PAGE_ACCESS[userRole].canExportData;
}

// Get menu items that should be visible for a user role
export function getVisibleMenuItems(userRole) {
  console.log('getVisibleMenuItems called with role:', userRole);
  
  if (!userRole) {
    console.log('No user role provided');
    return [];
  }
  
  // Convert to lowercase for case-insensitive comparison
  const normalizedRole = userRole.toLowerCase();
  console.log('Normalized role:', normalizedRole);
  
  // Check if role exists in our config
  const roleConfig = PAGE_ACCESS[normalizedRole];
  if (!roleConfig) {
    console.log('Role config not found for:', normalizedRole);
    console.log('Available roles:', Object.keys(PAGE_ACCESS));
    return [];
  }
  
  console.log('Role config found:', roleConfig);
  
  // Admin sees all menu items
  if (roleConfig.canAccess.includes('*')) {
    const adminMenuItems = [
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
    console.log('Returning admin menu items:', adminMenuItems);
    return adminMenuItems;
  }
  
  // Build menu items based on accessible pages
  const menuItems = [];
  
  if (roleConfig.canAccess.includes('/')) {
    menuItems.push({ path: '/', name: 'Overview', icon: '📊' });
  }
  
  if (roleConfig.canAccess.includes('/strategic-executive')) {
    menuItems.push({ path: '/strategic-executive', name: 'Strategic Executive', icon: '📈' });
  }
  
  if (roleConfig.canAccess.includes('/business-flow')) {
    menuItems.push({ path: '/business-flow', name: 'Business Flow', icon: '🔄' });
  }
  
  if (roleConfig.canAccess.includes('/bgo')) {
    menuItems.push({ path: '/bgo', name: 'BGO', icon: '🎯' });
  }
  
  if (roleConfig.canAccess.includes('/os')) {
    menuItems.push({ path: '/os', name: 'OS', icon: '⚙️' });
  }
  
  if (roleConfig.canAccess.includes('/sr')) {
    menuItems.push({ path: '/sr', name: 'SR', icon: '📋' });
  }
  
  if (roleConfig.canAccess.includes('/xoo')) {
    menuItems.push({ path: '/xoo', name: 'XOO', icon: '🔧' });
  }
  
  // Check if any transaction pages are accessible
  const transactionPages = [
    '/transaction/deposit',
    '/transaction/withdraw', 
    '/transaction/exchange',
    '/transaction/headcount',
    '/transaction/adjustment',
    '/transaction/vip-program',
    '/transaction/new-depositor',
    '/transaction/member-report'
  ];
  
  const accessibleTransactionPages = transactionPages.filter(page => 
    roleConfig.canAccess.includes(page)
  );
  
  if (accessibleTransactionPages.length > 0) {
    const transactionSubItems = [];
    
    if (roleConfig.canAccess.includes('/transaction/deposit')) {
      transactionSubItems.push({ path: '/transaction/deposit', name: 'Deposit', icon: '💰' });
    }
    if (roleConfig.canAccess.includes('/transaction/withdraw')) {
      transactionSubItems.push({ path: '/transaction/withdraw', name: 'Withdraw', icon: '💸' });
    }
    if (roleConfig.canAccess.includes('/transaction/exchange')) {
      transactionSubItems.push({ path: '/transaction/exchange', name: 'Exchange', icon: '🔄' });
    }
    if (roleConfig.canAccess.includes('/transaction/headcount')) {
      transactionSubItems.push({ path: '/transaction/headcount', name: 'Headcount', icon: '👥' });
    }
    if (roleConfig.canAccess.includes('/transaction/adjustment')) {
      transactionSubItems.push({ path: '/transaction/adjustment', name: 'Adjustment', icon: '⚖️' });
    }
    if (roleConfig.canAccess.includes('/transaction/vip-program')) {
      transactionSubItems.push({ path: '/transaction/vip-program', name: 'VIP Program', icon: '👑' });
    }
    if (roleConfig.canAccess.includes('/transaction/new-depositor')) {
      transactionSubItems.push({ path: '/transaction/new-depositor', name: 'New Depositor', icon: '🆕' });
    }
    if (roleConfig.canAccess.includes('/transaction/member-report')) {
      transactionSubItems.push({ path: '/transaction/member-report', name: 'Member Report', icon: '📊' });
    }
    
    menuItems.push({
      name: 'Transaction',
      icon: '💰',
      subItems: transactionSubItems
    });
  }
  
  // Add User Management only for admin
  if (roleConfig.canManageUsers) {
    menuItems.push({ path: '/users', name: 'User Management', icon: '👤' });
  }
  
  return menuItems;
} 