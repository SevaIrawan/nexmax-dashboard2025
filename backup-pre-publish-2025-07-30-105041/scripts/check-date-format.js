const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'CRM_Backend',
  database: 'crm_backend_data'
});

async function checkDateFormat() {
  let client;
  try {
    client = await pool.connect();
    console.log('🔍 Checking date format in member_report_monthly...');

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

    // Get sample dates
    const sampleQuery = `
      SELECT date, pg_typeof(date) as date_type
      FROM member_report_monthly 
      WHERE date IS NOT NULL 
      ORDER BY date DESC 
      LIMIT 3;
    `;
    
    const sample = await client.query(sampleQuery);
    console.log('📋 Sample dates:');
    sample.rows.forEach(row => {
      console.log(`  - ${row.date} (type: ${row.date_type})`);
    });

    // Check MAX date
    const maxDateQuery = `
      SELECT MAX(date) as max_date
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

checkDateFormat(); 