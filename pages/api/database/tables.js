import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;
  try {
    client = await pool.connect();
    console.log('🔍 Checking database tables and structure...');

    // 1. List all tables in database
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    const tables = await client.query(tablesQuery);
    console.log(`✅ Found ${tables.rows.length} tables`);

    // 2. Get structure for each table
    const tableStructures = {};
    
    for (const table of tables.rows) {
      const tableName = table.table_name;
      
      // Get columns for this table
      const columnsQuery = `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `;
      
      const columns = await client.query(columnsQuery, [tableName]);
      
      // Get sample data (first 3 rows)
      const sampleQuery = `SELECT * FROM ${tableName} LIMIT 3`;
      let sampleData = [];
      
      try {
        const sample = await client.query(sampleQuery);
        sampleData = sample.rows;
      } catch (error) {
        console.log(`⚠️ Could not get sample data for ${tableName}:`, error.message);
      }
      
      tableStructures[tableName] = {
        columns: columns.rows,
        sampleData: sampleData,
        rowCount: sampleData.length
      };
    }

    // 3. Check specifically for deposit_daily table
    const depositDailyQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'deposit_daily'
      )
    `;
    
    const depositDailyExists = await client.query(depositDailyQuery);

    res.status(200).json({
      success: true,
      totalTables: tables.rows.length,
      tableNames: tables.rows.map(t => t.table_name),
      tableStructures: tableStructures,
      depositDailyExists: depositDailyExists.rows[0].exists,
      message: 'Database structure retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database connection failed',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 