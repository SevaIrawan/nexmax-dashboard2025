import pool from '../../lib/database';

export default async function handler(req, res) {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test koneksi database
    const testConnection = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', testConnection.rows[0]);

    // Cek struktur tabel users
    console.log('🔍 Checking users table structure...');
    const tableStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log('📋 Table structure:', tableStructure.rows);

    // Ambil semua users dengan password (untuk debug saja)
    console.log('🔍 Fetching all users...');
    const users = await pool.query(`
      SELECT id, username, email, password, role, created_at 
      FROM users 
      ORDER BY id
    `);
    console.log('👥 Users found:', users.rows);

    // Cek apakah ada user 'admin'
    const adminUser = await pool.query(`
      SELECT * FROM users WHERE username = 'admin'
    `);
    console.log('👤 Admin user:', adminUser.rows);

    res.status(200).json({
      success: true,
      connection_test: testConnection.rows[0],
      table_structure: tableStructure.rows,
      total_users: users.rows.length,
      users: users.rows,
      admin_exists: adminUser.rows.length > 0,
      admin_user: adminUser.rows[0] || null
    });

  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack,
      code: error.code 
    });
  }
} 