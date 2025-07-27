import { useState, useEffect } from 'react';
import { useRoleAccess } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Users() {
  const { user, loading: authLoading, hasAccess } = useRoleAccess('user_management');
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
    // Check access and fetch data
    if (user && hasAccess === false) {
      alert('Access Denied: You do not have permission to access User Management.');
      window.location.href = '/';
      return;
    }
    
    if (user && hasAccess === true) {
      setLoading(false);
      fetchUsers();
    }
  }, [user, hasAccess]);

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
    <div className="app-layout">
      <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      <div className="main-content">
        <Header user={user} sidebarExpanded={sidebarExpanded} />
        <main>
          <div className="users-header">
            <h1>User Management</h1>
            <div style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              👤 Logged in as: <strong>{user.username}</strong> ({user.role})
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="add-user-btn"
            >
              Add New User
            </button>
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
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="form-buttons">
                    <button type="submit">Create User</button>
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
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                    required
                  />
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="form-buttons">
                    <button type="submit">Update User</button>
                    <button type="button" onClick={() => { setShowEditModal(false); setEditingUser(null); }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="users-table">
            <table>
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
                {users.map(userItem => (
                  <tr key={userItem.id}>
                    <td>{userItem.id}</td>
                    <td>{userItem.username}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{userItem.password}</td>
                    <td>N/A</td>
                    <td>
                      <span className={`role-badge role-${userItem.role.toLowerCase()}`}>
                        {userItem.role.toUpperCase()}
                      </span>
                    </td>
                    <td>Invalid Date</td>
                    <td>
                      <button 
                        onClick={() => handleEditUser(userItem)}
                        className="action-btn edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleResetPassword(userItem.id)}
                        className="action-btn reset-btn"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(userItem.id)}
                        className="action-btn delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <style jsx>{`
            .users-header {
              margin-bottom: 30px;
            }

            .users-header h1 {
              margin: 0 0 10px 0;
              color: #333;
              font-size: 2rem;
              font-weight: 600;
            }

            .add-user-btn {
              background: linear-gradient(135deg, #28a745, #20c997);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.3s ease;
            }

            .add-user-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            }

            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }

            .modal {
              background: white;
              padding: 30px;
              border-radius: 12px;
              width: 500px;
              max-width: 90vw;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .modal h3 {
              margin: 0 0 20px 0;
              color: #333;
            }

            .modal form {
              display: flex;
              flex-direction: column;
              gap: 15px;
            }

            .modal input,
            .modal select {
              padding: 12px;
              border: 1px solid #ddd;
              border-radius: 6px;
              font-size: 1rem;
            }

            .form-buttons {
              display: flex;
              gap: 10px;
              margin-top: 10px;
            }

            .form-buttons button {
              flex: 1;
              padding: 12px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
            }

            .form-buttons button[type="submit"] {
              background: #28a745;
              color: white;
            }

            .form-buttons button[type="button"] {
              background: #6c757d;
              color: white;
            }

            .users-table {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }

            .users-table table {
              width: 100%;
              border-collapse: collapse;
            }

            .users-table th,
            .users-table td {
              padding: 15px;
              text-align: left;
              border-bottom: 1px solid #eee;
            }

            .users-table th {
              background: #f8f9fa;
              font-weight: 600;
              color: #333;
            }

            .role-badge {
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: 600;
              text-transform: uppercase;
            }

            .role-admin {
              background: #dc3545;
              color: white;
            }

            .role-manager {
              background: #ffc107;
              color: #212529;
            }

            .role-user {
              background: #6c757d;
              color: white;
            }

            .action-btn {
              padding: 6px 12px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 0.85rem;
              margin-right: 5px;
              transition: all 0.2s ease;
              font-weight: 500;
            }

            .edit-btn {
              background: #28a745;
              color: white;
            }

            .reset-btn {
              background: #007bff;
              color: white;
            }

            .delete-btn {
              background: #dc3545;
              color: white;
            }

            .action-btn:hover {
              opacity: 0.8;
              transform: translateY(-1px);
            }

            @media (max-width: 768px) {
              .users-table {
                overflow-x: auto;
              }

              .modal {
                margin: 20px;
                width: auto;
              }
            }
          `}</style>
        </main>
      </div>
    </div>
  );
} 