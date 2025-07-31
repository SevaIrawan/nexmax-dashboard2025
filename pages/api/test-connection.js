import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crm_backend_data',
  password: 'CRM_Backend',
  port: 5432,
});

export default async function handler(req, res) {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const testResult = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully');
    
    // Check available tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Available tables:', tablesResult.rows.map(row => row.table_name));
    
    // Check deposit_monthly structure
    let depositMonthlyColumns = [];
    try {
      const columnsResult = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'deposit_monthly'
        ORDER BY ordinal_position
      `);
      depositMonthlyColumns = columnsResult.rows;
      console.log('📊 deposit_monthly columns:', depositMonthlyColumns);
    } catch (error) {
      console.log('⚠️ deposit_monthly table not found or no access');
    }
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      current_time: testResult.rows[0].current_time,
      available_tables: tablesResult.rows.map(row => row.table_name),
      deposit_monthly_columns: depositMonthlyColumns,
      database_info: {
        host: 'localhost',
        database: 'crm_backend_data',
        user: 'postgres'
      }
    });

  } catch (error) {
    console.error('❌ Database connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: error.message,
      details: {
        code: error.code,
        detail: error.detail,
        hint: error.hint
      }
    });
  }
} 