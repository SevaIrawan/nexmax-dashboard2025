import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    client = await pool.connect();
    console.log('🔍 Fetching headcountdep table structure...');

    // Get table structure
    const structureQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns 
      WHERE table_name = 'headcountdep' 
      ORDER BY ordinal_position
    `;
    
    const result = await client.query(structureQuery);
    
    const columns = result.rows.map(row => ({
      name: row.column_name,
      type: row.data_type,
      required: row.is_nullable === 'NO',
      defaultValue: row.column_default,
      maxLength: row.character_maximum_length,
      precision: row.numeric_precision,
      scale: row.numeric_scale
    }));

    console.log(`✅ Found ${columns.length} columns in headcountdep table`);

    res.status(200).json({
      success: true,
      tableName: 'headcountdep',
      columns
    });

  } catch (error) {
    console.error('❌ Error fetching table structure:', error);
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