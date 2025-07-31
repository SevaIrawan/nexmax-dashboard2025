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

async function finalBackup() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting FINAL backup for Supabase migration...');
    
    // List semua table yang ada dan berfungsi
    const tables = [
      'users',
      'deposit_daily',
      'withdraw_daily', 
      'exchange_rate',
      'headcountdep',
      'member_report_daily',
      'member_report_monthly',
      'new_depositor_daily'
    ];
    
    const backupData = {
      backupInfo: {
        timestamp: new Date().toISOString(),
        project: 'nexmax-dashboard',
        version: 'FINAL',
        description: 'FINAL BACKUP - Sebelum migrasi ke Supabase',
        migrationTarget: 'Supabase',
        totalTables: tables.length
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
    
    // Clean backup directory - hapus semua file lama
    const backupDir = path.join(__dirname, '..', 'backups');
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(backupDir, file));
          console.log(`🗑️ Deleted old backup: ${file}`);
        }
      });
    } else {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Save FINAL backup
    const backupFile = path.join(backupDir, `FINAL-BACKUP-SUPABASE-MIGRATION.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log(`\n✅ FINAL BACKUP completed successfully!`);
    console.log(`📁 Backup file: ${backupFile}`);
    
    // Summary
    console.log('\n📊 FINAL BACKUP Summary:');
    let totalRecords = 0;
    let successTables = 0;
    Object.keys(backupData.tables).forEach(table => {
      const tableData = backupData.tables[table];
      if (tableData.error) {
        console.log(`❌ ${table}: ERROR - ${tableData.error}`);
      } else {
        console.log(`✅ ${table}: ${tableData.recordCount} records`);
        totalRecords += tableData.recordCount;
        successTables++;
      }
    });
    
    console.log(`\n📈 FINAL BACKUP STATS:`);
    console.log(`✅ Success tables: ${successTables}/${tables.length}`);
    console.log(`📊 Total records: ${totalRecords.toLocaleString()}`);
    console.log(`📁 File size: ${(fs.statSync(backupFile).size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🎯 Ready for Supabase migration!`);
    
  } catch (error) {
    console.error('❌ Final backup failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run final backup
finalBackup().catch(console.error); 