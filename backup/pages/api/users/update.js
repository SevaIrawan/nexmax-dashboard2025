import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, username, email, password, role } = req.body;

  if (!id || !username || !password || !role) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields: id, username, password, role' 
    });
  }

  try {
    console.log(`📝 Updating user ID ${id}: ${username} (${role})`);
    
    // Update user in database
    const result = await pool.query(
      `UPDATE users 
       SET username = $1, password = $2, role = $3
       WHERE id = $4
       RETURNING id, username, role`,
      [username, password, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log(`✅ User updated successfully: ${result.rows[0].username}`);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating user:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Database error while updating user',
        message: error.message
      });
    }
  }
} 