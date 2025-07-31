import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('Checking authentication...');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setDebugInfo('Checking authentication...');
    console.log('🔍 Checking auth, all cookies:', document.cookie);

    // Fast cookie-based authentication check
    try {
      const cookies = document.cookie.split(';');
      const userCookies = {};
      
      cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          userCookies[name] = decodeURIComponent(value);
        }
      });

      console.log('🍪 Parsed cookies:', userCookies);
      setDebugInfo(`Cookies: ${Object.keys(userCookies).join(', ')}`);

      if (userCookies.user_id && userCookies.username && userCookies.user_role) {
        const userData = {
          id: parseInt(userCookies.user_id),
          username: userCookies.username,
          role: userCookies.user_role
        };
        console.log('✅ User authenticated:', userData);
        setDebugInfo(`✅ Authenticated as: ${userData.username} (${userData.role})`);
        setUser(userData);
        setLoading(false);
        return;
      } else {
        console.log('❌ Missing required cookies for authentication');
        setDebugInfo('❌ No valid session found. Redirecting...');
      }
    } catch (error) {
      console.error('Auth check error:', error.message);
      setDebugInfo(`❌ Auth error: ${error.message}`);
    }

    // Redirect to login if no valid authentication
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/login';
    }, 1000);
    return;
  };

  return { user, loading, debugInfo };
}

// Role-based access control helper
export function useRoleAccess(requiredPermission = null) {
  const { user, loading } = useAuth();
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      // Define role hierarchy and permissions
      const rolePermissions = {
        admin: [
          'dashboard.view',
          'user_management',
          'users.manage',
          'strategic.view',
          'transactions.view',
          'reports.view',
          'settings.manage'
        ],
        manager: [
          'dashboard.view',
          'strategic.view',
          'reports.view'
        ],
        user: [
          'dashboard.view',
          'reports.view'
        ]
      };

      const userPermissions = rolePermissions[user.role] || [];
      
      // If no specific permission required, just check if user exists
      if (!requiredPermission) {
        setHasAccess(true);
        return;
      }

      // Check if user has the required permission
      const hasPermission = userPermissions.includes(requiredPermission) || user.role === 'admin';
      setHasAccess(hasPermission);
      
      console.log(`🔐 Access check for "${requiredPermission}": ${hasPermission ? '✅ GRANTED' : '❌ DENIED'} (User: ${user.username}, Role: ${user.role})`);
    } else if (!loading && !user) {
      setHasAccess(false);
    }
  }, [user, loading, requiredPermission]);

  return { user, loading, hasAccess };
} 