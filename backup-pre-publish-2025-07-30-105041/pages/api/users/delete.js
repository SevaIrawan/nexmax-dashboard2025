import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  console.log('🗑️ Delete user request:', { userId });

  try {
    // Check if user exists first
    const checkUser = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
    
    if (checkUser.rows.length === 0) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const username = checkUser.rows[0].username;

    // Prevent deleting the last admin user
    const adminCount = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['admin']);
    const isAdmin = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    
    if (isAdmin.rows[0]?.role === 'admin' && parseInt(adminCount.rows[0].count) <= 1) {
      console.log('❌ Cannot delete last admin user');
      return res.status(400).json({ error: 'Cannot delete the last admin user' });
    }

    // Delete the user
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username', [userId]);

    if (result.rows.length === 0) {
      console.log('❌ Failed to delete user:', userId);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    console.log('✅ User deleted successfully:', { userId, username });

    res.status(200).json({
      success: true,
      message: `User "${username}" deleted successfully`,
      deletedUser: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ 
      error: 'Database error during user deletion',
      message: error.message 
    });
  }
} 