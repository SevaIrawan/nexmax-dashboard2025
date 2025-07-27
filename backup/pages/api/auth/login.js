import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    // Cari user berdasarkan username dengan query optimized
    const userResult = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username = $1 LIMIT 1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Compare password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Login berhasil, set session cookies
    res.setHeader('Set-Cookie', [
      `user_id=${user.id}; Path=/; SameSite=Strict; Max-Age=86400`,
      `username=${user.username}; Path=/; SameSite=Strict; Max-Age=86400`,
      `user_role=${user.role || 'user'}; Path=/; SameSite=Strict; Max-Age=86400`
    ]);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role || 'user'
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
} 