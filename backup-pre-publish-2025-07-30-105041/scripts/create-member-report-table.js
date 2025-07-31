const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgre',
  host: 'localhost',
  database: 'crm_backend_data',
  password: 'CRM_Backend',
  port: 5432,
});

async function createMemberReportTable() {
  try {
    console.log('🔨 Creating member_report_daily table...');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS member_report_daily (
        id SERIAL PRIMARY KEY,
        report_date DATE NOT NULL,
        member_id VARCHAR(50) NOT NULL,
        member_name VARCHAR(100),
        member_type VARCHAR(20) DEFAULT 'Regular',
        tier_level VARCHAR(20) DEFAULT 'Bronze',
        registration_date DATE,
        last_login_date DATE,
        total_deposits DECIMAL(15,2) DEFAULT 0,
        total_withdrawals DECIMAL(15,2) DEFAULT 0,
        games_played INTEGER DEFAULT 0,
        total_bets DECIMAL(15,2) DEFAULT 0,
        total_wins DECIMAL(15,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'Active',
        currency VARCHAR(5) DEFAULT 'MYR',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log('✅ member_report_daily table created successfully');

    // Insert sample data
    console.log('📊 Inserting sample data...');
    
    const sampleData = `
      INSERT INTO member_report_daily (
        report_date, member_id, member_name, member_type, tier_level,
        registration_date, last_login_date, total_deposits, total_withdrawals,
        games_played, total_bets, total_wins, status, currency
      ) VALUES 
      ('2025-01-15', 'MBR001', 'John Doe', 'Premium', 'Gold', '2024-06-15', '2025-01-15', 15000.00, 8000.00, 45, 25000.00, 18000.00, 'Active', 'MYR'),
      ('2025-01-15', 'MBR002', 'Jane Smith', 'VIP', 'Platinum', '2024-03-20', '2025-01-14', 35000.00, 20000.00, 120, 85000.00, 65000.00, 'Active', 'MYR'),
      ('2025-01-15', 'MBR003', 'Mike Johnson', 'Regular', 'Silver', '2024-12-01', '2025-01-13', 5000.00, 3000.00, 25, 12000.00, 8500.00, 'Active', 'SGD'),
      ('2025-01-14', 'MBR001', 'John Doe', 'Premium', 'Gold', '2024-06-15', '2025-01-14', 14500.00, 7500.00, 42, 24000.00, 17200.00, 'Active', 'MYR'),
      ('2025-01-14', 'MBR002', 'Jane Smith', 'VIP', 'Platinum', '2024-03-20', '2025-01-13', 34000.00, 19500.00, 118, 83000.00, 63500.00, 'Active', 'MYR'),
      ('2024-12-31', 'MBR004', 'Sarah Wilson', 'Premium', 'Diamond', '2024-01-15', '2024-12-31', 50000.00, 25000.00, 200, 150000.00, 120000.00, 'Active', 'USD')
      ON CONFLICT DO NOTHING;
    `;

    await pool.query(sampleData);
    console.log('✅ Sample data inserted successfully');

    // Create index for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_member_report_date ON member_report_daily(report_date);
      CREATE INDEX IF NOT EXISTS idx_member_report_member_id ON member_report_daily(member_id);
      CREATE INDEX IF NOT EXISTS idx_member_report_currency ON member_report_daily(currency);
    `);
    console.log('✅ Indexes created successfully');

    console.log('🎉 Member Report table setup completed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating member_report_daily table:', error);
    process.exit(1);
  }
}

createMemberReportTable(); 