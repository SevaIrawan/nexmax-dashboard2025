import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    client = await pool.connect();
    console.log('🔍 Testing exchange_rate table...');

    // Check table structure
    const structureQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'exchange_rate' 
      ORDER BY ordinal_position
    `;
    
    const structureResult = await client.query(structureQuery);
    console.log('📋 Table structure:', structureResult.rows);

    // Check if table has data
    const countQuery = `SELECT COUNT(*) as total FROM exchange_rate`;
    const countResult = await client.query(countQuery);
    const totalRecords = parseInt(countResult.rows[0].total);
    console.log('📊 Total records:', totalRecords);

    // Get sample data
    const sampleQuery = `SELECT * FROM exchange_rate LIMIT 5`;
    const sampleResult = await client.query(sampleQuery);
    console.log('📋 Sample data:', sampleResult.rows);

    res.status(200).json({
      success: true,
      structure: structureResult.rows,
      totalRecords,
      sampleData: sampleResult.rows
    });

  } catch (error) {
    console.error('❌ Error testing exchange_rate table:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while testing table',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 