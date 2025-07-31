import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { hasPageAccess, canManageUsers, isReadOnly, canExportData } from '../lib/roles';

export function useRoleAccess(requiredPage = null) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't check access while loading
    if (loading) return;

    // If no user, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If no specific page required, just return user status
    if (!requiredPage) return;

    // Check if user has access to the required page
    if (!hasPageAccess(user.role, requiredPage)) {
      // Redirect to main dashboard or first accessible page
      if (hasPageAccess(user.role, '/')) {
        router.push('/');
      } else {
        // If user can't access main dashboard, logout
        router.push('/login');
      }
      return;
    }
  }, [user, loading, requiredPage, router]);

  return {
    user,
    loading,
    hasAccess: user ? hasPageAccess(user.role, requiredPage) : false,
    canManageUsers: user ? canManageUsers(user.role) : false,
    isReadOnly: user ? isReadOnly(user.role) : true,
    canExportData: user ? canExportData(user.role) : false
  };
}

// Helper hook for pages that don't need specific access checking
export function useUserPermissions() {
  const { user } = useAuth();
  
  if (!user) {
    return {
      canManageUsers: false,
      isReadOnly: true,
      canExportData: false
    };
  }

  return {
    canManageUsers: canManageUsers(user.role),
    isReadOnly: isReadOnly(user.role),
    canExportData: canExportData(user.role)
  };
} 