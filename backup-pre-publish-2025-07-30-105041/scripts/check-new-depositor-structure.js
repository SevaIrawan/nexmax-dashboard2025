const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'CRM_Backend',
  database: 'crm_backend_data'
});

async function checkNewDepositorStructure() {
  let client;
  try {
    client = await pool.connect();
    console.log('🔍 Checking new_depositor_daily table structure...');

    // Check if table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'new_depositor_daily'
      );
    `;
    
    const tableExists = await client.query(tableExistsQuery);
    console.log('📋 Table exists:', tableExists.rows[0].exists);

    if (!tableExists.rows[0].exists) {
      console.log('❌ Table new_depositor_daily does not exist!');
      return;
    }

    // Get column names and data types
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'new_depositor_daily'
      ORDER BY ordinal_position;
    `;
    
    const columns = await client.query(columnsQuery);
    console.log('📋 Table columns:');
    columns.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
    });

    // Get sample data
    const sampleQuery = `
      SELECT * FROM new_depositor_daily 
      LIMIT 3;
    `;
    
    const sample = await client.query(sampleQuery);
    console.log('📋 Sample data:');
    sample.rows.forEach((row, index) => {
      console.log(`  Row ${index + 1}:`, row);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

checkNewDepositorStructure(); 