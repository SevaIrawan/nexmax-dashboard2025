import { useState, useEffect } from 'react';
import { useRoleAccess } from '../hooks/useRoleAccess';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Users() {
  const { user, loading: authLoading, canManageUsers } = useRoleAccess('/users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    // Only proceed if user is loaded and has access
    if (authLoading) return;
    
    if (!user || !canManageUsers) {
      // Access denied will be handled by useRoleAccess hook
      return;
    }
    
    setLoading(false);
    fetchUsers();
  }, [user, canManageUsers, authLoading]);

  const fetchUsers = async () => {
    try {
      console.log('🔍 Fetching users data...');
      const response = await fetch('/api/users/list');
      const data = await response.json();
      console.log('📊 Users response:', data);
      if (data.success) {
        setUsers(data.users);
        console.log(`✅ Loaded ${data.users.length} users`);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert('User created successfully!');
        setFormData({ username: '', password: '', role: 'user' });
        setShowModal(false);
        fetchUsers();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser({
      id: userToEdit.id,
      username: userToEdit.username,
      email: userToEdit.email || '',
      password: userToEdit.password,
      role: userToEdit.role
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      const data = await response.json();
      if (data.success) {
        alert('User updated successfully!');
        setEditingUser(null);
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('User deleted successfully!');
        fetchUsers();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;

    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Password reset successfully!');
        fetchUsers(); // Refresh to show updated password
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Network error. Please try again.');
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div className="loading-spinner">⚡</div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      <div className={`dashboard-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          title=""
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
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#1e293b'
          }}>
            {/* Title removed - only in Header */}
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center' 
          }}>
            <button 
              onClick={() => setShowModal(true)}
              className="add-user-btn"
            >
              Add New User
            </button>
          </div>
        </div>

        <main style={{ marginTop: '185px', padding: '24px' }}>
          <div className="users-header">
            {/* Removed "Logged in as" text and "Add New User" button - moved to sub header */}
          </div>

          {/* Add User Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Add New User</h3>
                <form onSubmit={handleAddUser}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="executive">Executive</option>
                    <option value="operator">Operator</option>
                  </select>
                  <div className="modal-actions">
                    <button type="submit">Add User</button>
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditModal && editingUser && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Edit User</h3>
                <form onSubmit={handleUpdateUser}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                    required
                  />
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="executive">Executive</option>
                    <option value="operator">Operator</option>
                  </select>
                  <div className="modal-actions">
                    <button type="submit">Update User</button>
                    <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.password}</td>
                      <td>{user.email || 'N/A'}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td>Invalid Date</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="btn-edit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleResetPassword(user.id)}
                            className="btn-reset"
                          >
                            Reset
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }
        
        .dashboard-content {
          flex: 1;
          transition: margin-left 0.3s ease;
        }
        
        .sidebar-expanded {
          margin-left: 280px;
        }
        
        .sidebar-collapsed {
          margin-left: 75px;
        }
        
        .users-header {
          margin-bottom: 30px;
        }
        
        .users-header h1 {
          color: #1f2937;
          font-size: 2rem;
          margin-bottom: 10px;
          font-weight: 700;
        }
        
        .add-user-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .add-user-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 400px;
          max-width: 90vw;
        }
        
        .modal h3 {
          margin: 0 0 20px 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .modal input, .modal select {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          box-sizing: border-box;
        }
        
        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .modal-actions button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
        }
        
        .modal-actions button[type="submit"] {
          background: #10b981;
          color: white;
        }
        
        .modal-actions button[type="button"] {
          background: #6b7280;
          color: white;
        }
        
        .users-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .users-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .users-table td {
          padding: 15px;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
        }
        
        .users-table tr:hover {
          background: #f9fafb;
        }
        
        .role-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .role-badge.admin {
          background: #fecaca;
          color: #dc2626;
        }
        
        .role-badge.manager {
          background: #fef3c7;
          color: #d97706;
        }
        
        .role-badge.executive {
          background: #fef3c7;
          color: #d97706;
        }
        
        .role-badge.operator {
          background: #d1fae5;
          color: #059669;
        }
        
        .role-badge.user {
          background: #d1fae5;
          color: #059669;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .action-buttons button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .btn-edit {
          background: #10b981;
          color: white;
        }
        
        .btn-reset {
          background: #3b82f6;
          color: white;
        }
        
        .btn-delete {
          background: #ef4444;
          color: white;
        }
        
        .action-buttons button:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
} 