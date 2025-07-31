const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'CRM_Backend',
  database: 'crm_backend_data'
});

async function checkMemberReportMonthlyStructure() {
  let client;
  try {
    client = await pool.connect();
    console.log('🔍 Checking member_report_monthly table structure...');

    // Check if table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'member_report_monthly'
      );
    `;
    
    const tableExists = await client.query(tableExistsQuery);
    console.log('📋 Table exists:', tableExists.rows[0].exists);

    if (!tableExists.rows[0].exists) {
      console.log('❌ Table member_report_monthly does not exist!');
      return;
    }

    // Get table structure
    const structureQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'member_report_monthly'
      ORDER BY ordinal_position;
    `;
    
    const structure = await client.query(structureQuery);
    console.log('📋 Table structure:');
    structure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Check sample data and date format
    const sampleQuery = `
      SELECT date, typeof(date) as date_type
      FROM member_report_monthly 
      WHERE date IS NOT NULL 
      ORDER BY date DESC 
      LIMIT 5;
    `;
    
    const sample = await client.query(sampleQuery);
    console.log('📋 Sample dates:');
    sample.rows.forEach(row => {
      console.log(`  - ${row.date} (type: ${row.date_type})`);
    });

    // Check MAX date
    const maxDateQuery = `
      SELECT MAX(date) as max_date, typeof(MAX(date)) as max_date_type
      FROM member_report_monthly 
      WHERE date IS NOT NULL;
    `;
    
    const maxDate = await client.query(maxDateQuery);
    console.log('📋 MAX date:', maxDate.rows[0]);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

checkMemberReportMonthlyStructure(); 