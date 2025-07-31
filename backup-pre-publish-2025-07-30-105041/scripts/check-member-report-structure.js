const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'CRM_Backend',
  database: 'crm_backend_data'
});

async function checkMemberReportStructure() {
  let client;
  
  try {
    client = await pool.connect();
    console.log('🔍 Checking member_report_daily table structure...');
    
    // Get table structure
    const structureQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'member_report_daily'
      ORDER BY ordinal_position
    `;
    
    const result = await client.query(structureQuery);
    
    console.log('📋 member_report_daily table structure:');
    console.log('Column Name | Data Type | Nullable');
    console.log('------------|-----------|---------');
    
    result.rows.forEach(row => {
      console.log(`${row.column_name.padEnd(12)} | ${row.data_type.padEnd(9)} | ${row.is_nullable}`);
    });
    
    // Get sample data
    console.log('\n📊 Sample data from member_report_daily:');
    const sampleQuery = 'SELECT * FROM member_report_daily LIMIT 3';
    const sampleResult = await client.query(sampleQuery);
    
    if (sampleResult.rows.length > 0) {
      console.log('Sample row:', sampleResult.rows[0]);
    } else {
      console.log('No data found in member_report_daily table');
    }
    
  } catch (error) {
    console.error('❌ Error checking member_report_daily structure:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

checkMemberReportStructure(); 