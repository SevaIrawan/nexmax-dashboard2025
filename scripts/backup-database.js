const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection untuk backup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nexmax_dashboard',
  password: 'your_password', // Ganti dengan password PostgreSQL local Anda
  port: 5432,
});

async function backupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database backup...');
    
    // List semua table yang perlu di-backup
    const tables = [
      'users',
      'deposit_daily',
      'withdraw_daily', 
      'exchange_rate',
      'headcountdep',
      'member_report_daily',
      'member_report_monthly',
      'new_depositor_daily',
      'new_register_daily',
      'adjustment_daily'
    ];
    
    const backupData = {};
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    for (const table of tables) {
      try {
        console.log(`📊 Backing up table: ${table}`);
        
        // Get table structure
        const structureQuery = `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `;
        const structureResult = await client.query(structureQuery, [table]);
        
        // Get table data
        const dataQuery = `SELECT * FROM ${table}`;
        const dataResult = await client.query(dataQuery);
        
        backupData[table] = {
          structure: structureResult.rows,
          data: dataResult.rows,
          recordCount: dataResult.rows.length,
          backupTime: new Date().toISOString()
        };
        
        console.log(`✅ ${table}: ${dataResult.rows.length} records backed up`);
        
      } catch (error) {
        console.error(`❌ Error backing up ${table}:`, error.message);
        backupData[table] = {
          error: error.message,
          backupTime: new Date().toISOString()
        };
      }
    }
    
    // Save backup to file
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFile = path.join(backupDir, `database-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log(`\n✅ Backup completed successfully!`);
    console.log(`📁 Backup file: ${backupFile}`);
    
    // Summary
    console.log('\n📊 Backup Summary:');
    Object.keys(backupData).forEach(table => {
      const tableData = backupData[table];
      if (tableData.error) {
        console.log(`❌ ${table}: ERROR - ${tableData.error}`);
      } else {
        console.log(`✅ ${table}: ${tableData.recordCount} records`);
      }
    });
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run backup
backupDatabase().catch(console.error); 