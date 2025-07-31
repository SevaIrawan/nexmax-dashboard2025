import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection untuk backup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crm_backend_data',
  password: 'CRM_Backend',
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
    
    const backupData = {
      backupInfo: {
        timestamp: new Date().toISOString(),
        project: 'nexmax-dashboard',
        version: '1.0',
        description: 'Backup sebelum migrasi ke Supabase'
      },
      tables: {}
    };
    
    for (const table of tables) {
      try {
        console.log(`📊 Backing up table: ${table}`);
        
        // Get table data
        const dataQuery = `SELECT * FROM ${table}`;
        const dataResult = await client.query(dataQuery);
        
        backupData.tables[table] = {
          data: dataResult.rows,
          recordCount: dataResult.rows.length,
          backupTime: new Date().toISOString()
        };
        
        console.log(`✅ ${table}: ${dataResult.rows.length} records backed up`);
        
      } catch (error) {
        console.error(`❌ Error backing up ${table}:`, error.message);
        backupData.tables[table] = {
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
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `nexmax-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log(`\n✅ Backup completed successfully!`);
    console.log(`📁 Backup file: ${backupFile}`);
    
    // Summary
    console.log('\n📊 Backup Summary:');
    let totalRecords = 0;
    Object.keys(backupData.tables).forEach(table => {
      const tableData = backupData.tables[table];
      if (tableData.error) {
        console.log(`❌ ${table}: ERROR - ${tableData.error}`);
      } else {
        console.log(`✅ ${table}: ${tableData.recordCount} records`);
        totalRecords += tableData.recordCount;
      }
    });
    
    console.log(`\n📈 Total records backed up: ${totalRecords}`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run backup
backupDatabase().catch(console.error); 