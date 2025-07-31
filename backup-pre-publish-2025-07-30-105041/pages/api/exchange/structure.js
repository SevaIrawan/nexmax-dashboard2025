import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    client = await pool.connect();
    
    // Get table structure
    const structureQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'exchange_rate' 
      ORDER BY ordinal_position
    `;
    
    const result = await client.query(structureQuery);
    const columns = result.rows.map(row => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES'
    }));

    res.status(200).json({
      success: true,
      columns: columns
    });

  } catch (error) {
    console.error('Error fetching table structure:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while fetching table structure',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 