import pool from '../../../lib/database';

export default async function handler(req, res) {
  try {
    // Cek struktur tabel users
    const tableStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    
    // Ambil semua users (tanpa password untuk keamanan)
    const users = await pool.query(`
      SELECT id, username, email, role, created_at 
      FROM users 
      ORDER BY id
    `);

    res.status(200).json({
      table_structure: tableStructure.rows,
      users: users.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 