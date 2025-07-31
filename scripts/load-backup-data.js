import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function loadBackupData() {
  try {
    console.log('📂 Loading backup data to Supabase...');
    
    // Read backup file
    const backupFile = path.join(__dirname, '..', 'backups', 'FINAL-BACKUP-SUPABASE-MIGRATION.json');
    
    if (!fs.existsSync(backupFile)) {
      console.error('❌ Backup file not found:', backupFile);
      process.exit(1);
    }
    
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log('📊 Backup info:', {
      timestamp: backupData.backupInfo.timestamp,
      totalTables: backupData.backupInfo.totalTables,
      description: backupData.backupInfo.description
    });
    
    let totalRecordsLoaded = 0;
    let successTables = 0;
    
    for (const [tableName, tableData] of Object.entries(backupData.tables)) {
      if (tableData.error) {
        console.log(`⚠️ Skipping ${tableName}: ${tableData.error}`);
        continue;
      }
      
      if (tableData.data && tableData.data.length > 0) {
        console.log(`📊 Loading ${tableName}: ${tableData.data.length} records`);
        
        try {
          // Insert data in batches
          const batchSize = 500; // Smaller batch size for Supabase
          let loadedBatches = 0;
          
          for (let i = 0; i < tableData.data.length; i += batchSize) {
            const batch = tableData.data.slice(i, i + batchSize);
            
            const { error } = await supabase
              .from(tableName)
              .insert(batch);
            
            if (error) {
              console.error(`❌ Error loading ${tableName} batch ${loadedBatches + 1}:`, error);
              break;
            } else {
              loadedBatches++;
              console.log(`✅ Loaded ${tableName} batch ${loadedBatches} (${batch.length} records)`);
            }
          }
          
          if (loadedBatches > 0) {
            totalRecordsLoaded += tableData.data.length;
            successTables++;
            console.log(`✅ Successfully loaded ${tableName}: ${tableData.data.length} records`);
          }
          
        } catch (error) {
          console.error(`❌ Error processing ${tableName}:`, error);
        }
      } else {
        console.log(`⚠️ No data to load for ${tableName}`);
      }
    }
    
    console.log('\n📊 MIGRATION SUMMARY:');
    console.log(`✅ Success tables: ${successTables}/${Object.keys(backupData.tables).length}`);
    console.log(`📊 Total records loaded: ${totalRecordsLoaded.toLocaleString()}`);
    console.log(`🎯 Migration completed successfully!`);
    
  } catch (error) {
    console.error('❌ Error loading backup data:', error);
    process.exit(1);
  }
}

// Run migration
loadBackupData().catch(console.error); 