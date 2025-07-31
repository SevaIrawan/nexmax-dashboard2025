import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ error: 'User ID and new password are required' });
  }

  console.log('🔄 Password reset request:', { userId, hasPassword: !!newPassword });

  try {
    // Update password in database
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, email, role',
      [newPassword, userId]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = result.rows[0];
    console.log('✅ Password reset successful:', { 
      userId: updatedUser.id, 
      username: updatedUser.username 
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({ 
      error: 'Database error during password reset',
      message: error.message 
    });
  }
} 