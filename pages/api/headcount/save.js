import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  let client;

  try {
    client = await pool.connect();
    console.log('📝 Saving headcountdep data:', data);

    // Get table structure to validate required fields
    const structureQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'headcountdep' 
      ORDER BY ordinal_position
    `;
    
    const structureResult = await client.query(structureQuery);
    const columns = structureResult.rows.map(row => row.column_name);
    const requiredFields = structureResult.rows
      .filter(row => row.is_nullable === 'NO')
      .map(row => row.column_name);

    console.log('📋 Table columns:', columns);
    console.log('🔒 Required fields:', requiredFields);

    // Validate required fields
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields
      });
    }

    // Build INSERT query dynamically
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    
    const insertQuery = `
      INSERT INTO headcountdep (${fields.join(', ')}) 
      VALUES (${placeholders})
      RETURNING *
    `;

    console.log('🔍 Executing INSERT query:', insertQuery);
    console.log('📋 With values:', values);

    const result = await client.query(insertQuery, values);

    console.log(`✅ Successfully saved 1 record to headcountdep`);

    res.status(200).json({
      success: true,
      message: 'Data saved successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error saving headcountdep data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while saving data',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 