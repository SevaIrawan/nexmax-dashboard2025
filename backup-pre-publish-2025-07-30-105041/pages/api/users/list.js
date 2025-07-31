import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Fetching all users from database...');
    
    // First check what columns exist in users table
    const columnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Available columns:', columnsResult.rows.map(r => r.column_name));
    
    // Get all users with only existing columns
    const result = await pool.query(`
      SELECT 
        id, 
        username, 
        password,
        role
      FROM users 
      ORDER BY id ASC
    `);

    console.log(`✅ Found ${result.rows.length} users in database`);
    
    // Format the data for display
    const users = result.rows.map(user => ({
      id: user.id,
      username: user.username,
      password: user.password, // Show actual password for admin management
      role: user.role,
      created_at: 'Not available' // Column doesn't exist in current database
    }));

    res.status(200).json({
      success: true,
      users: users,
      total: users.length,
      message: `Successfully fetched ${users.length} users`
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while fetching users',
      message: error.message,
      users: []
    });
  }
} 