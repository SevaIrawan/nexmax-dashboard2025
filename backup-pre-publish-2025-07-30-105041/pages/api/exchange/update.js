import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uniqueKey, data } = req.body;
  let client;

  try {
    client = await pool.connect();
    console.log('📝 Updating exchangedaily data:', { uniqueKey, data });

    // Get the original uniquekey from the data (before it was updated)
    const originalUniqueKey = data.originalUniquekey;
    console.log('🔑 Original uniquekey for WHERE clause:', originalUniqueKey);
    console.log('🔑 New uniquekey to update:', uniqueKey);

    // Get table structure to validate fields
    const structureQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'exchange_rate' 
      ORDER BY ordinal_position
    `;
    
    const structureResult = await client.query(structureQuery);
    const columns = structureResult.rows.map(row => row.column_name);
    const requiredFields = structureResult.rows
      .filter(row => row.is_nullable === 'NO')
      .map(row => row.column_name);

    console.log('📋 Table columns:', columns);
    console.log('🔒 Required fields:', requiredFields);

    // Validate required fields (excluding originalUniquekey)
    const { originalUniquekey: originalKey, ...dataToValidate } = data;
    const missingFields = requiredFields.filter(field => !dataToValidate[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields
      });
    }

    // Build UPDATE query dynamically - use originalUniqueKey for WHERE clause
    // Remove originalUniquekey from data to avoid updating it
    const { originalUniquekey: _, ...updateData } = data;
    const updateFields = Object.keys(updateData).map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = Object.values(updateData);
    
    const updateQuery = `
      UPDATE exchange_rate 
      SET ${updateFields}
      WHERE uniquekey = $1
      RETURNING *
    `;

    const allValues = [originalUniqueKey, ...values];

    console.log('🔍 Executing UPDATE query:', updateQuery);
    console.log('📋 With values:', allValues);
    console.log('🔑 Looking for uniquekey:', originalUniqueKey);
    console.log('📋 Update data (without originalUniquekey):', updateData);

    // First, let's check if the record exists
    const checkQuery = `SELECT uniquekey FROM exchange_rate WHERE uniquekey = $1`;
    const checkResult = await client.query(checkQuery, [originalUniqueKey]);
    console.log('🔍 Check result:', checkResult.rows);

    // Let's also see all uniquekeys in the table
    const allKeysQuery = `SELECT uniquekey FROM exchange_rate LIMIT 10`;
    const allKeysResult = await client.query(allKeysQuery);
    console.log('🔍 All uniquekeys in table:', allKeysResult.rows);

    const result = await client.query(updateQuery, allValues);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    console.log(`✅ Successfully updated 1 record in exchange_rate`);

    res.status(200).json({
      success: true,
      message: 'Data updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating exchangedaily data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while updating data',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 