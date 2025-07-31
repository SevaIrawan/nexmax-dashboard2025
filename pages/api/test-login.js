import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crm_backend_data',
  password: 'CRM_Backend',
  port: 5432,
});

export default async function handler(req, res) {
  const { username = 'admin', password = 'NexMax2024!@#' } = req.query;
  
  try {
    console.log('🔍 Testing login for:', { username, password });
    
    // Get user from database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    console.log('👤 User found:', userResult.rows.length > 0);
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('👤 User data:', {
        id: user.id,
        username: user.username,
        stored_password: user.password,
        provided_password: password,
        passwords_match: user.password === password,
        role: user.role
      });
    }

    res.status(200).json({
      success: true,
      user_found: userResult.rows.length > 0,
      user_data: userResult.rows[0] || null,
      password_match: userResult.rows.length > 0 && userResult.rows[0].password === password,
      test_info: {
        provided_username: username,
        provided_password: password,
        stored_password: userResult.rows[0]?.password
      }
    });

  } catch (error) {
    console.error('❌ Test login error:', error);
    res.status(500).json({ error: error.message });
  }
} 