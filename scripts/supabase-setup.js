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
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Supabase Configuration:');
console.log('URL:', SUPABASE_URL);
console.log('Anon Key:', SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('Service Role Key:', SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  console.log('Please create .env.local file with the following variables:');
  console.log('- SUPABASE_URL');
  console.log('- SUPABASE_ANON_KEY');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupSupabaseDatabase() {
  try {
    console.log('🔄 Setting up Supabase database for NEXMAX Dashboard...');
    
    // 1. Test connection first
    console.log('🔍 Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('⚠️ Users table does not exist yet (this is normal)');
    } else {
      console.log('✅ Connection test successful');
    }
    
    // 2. Create tables
    await createTables();
    
    // 3. Load backup data
    await loadBackupData();
    
    // 4. Create indexes
    await createIndexes();
    
    // 5. Setup RLS (Row Level Security)
    await setupRLS();
    
    console.log('✅ Supabase database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Supabase setup failed:', error);
    process.exit(1);
  }
}

async function createTables() {
  console.log('📊 Creating database tables...');
  
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'executive', 'operator', 'user')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Deposit daily table
    `CREATE TABLE IF NOT EXISTS deposit_daily (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency VARCHAR(3) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Withdraw daily table
    `CREATE TABLE IF NOT EXISTS withdraw_daily (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency VARCHAR(3) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Exchange rate table
    `CREATE TABLE IF NOT EXISTS exchange_rate (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      currency VARCHAR(3) NOT NULL,
      rate DECIMAL(10,4) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Headcount department table
    `CREATE TABLE IF NOT EXISTS headcountdep (
      id SERIAL PRIMARY KEY,
      department VARCHAR(50) NOT NULL,
      headcount INTEGER NOT NULL,
      currency VARCHAR(3) NOT NULL,
      year INTEGER NOT NULL,
      month VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Member report daily table
    `CREATE TABLE IF NOT EXISTS member_report_daily (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      total_members INTEGER NOT NULL,
      active_members INTEGER NOT NULL,
      new_members INTEGER NOT NULL,
      churned_members INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Member report monthly table
    `CREATE TABLE IF NOT EXISTS member_report_monthly (
      id SERIAL PRIMARY KEY,
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      total_members INTEGER NOT NULL,
      active_members INTEGER NOT NULL,
      new_members INTEGER NOT NULL,
      churned_members INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // New depositor daily table
    `CREATE TABLE IF NOT EXISTS new_depositor_daily (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      new_depositors INTEGER NOT NULL,
      currency VARCHAR(3) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  
  for (const tableQuery of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: tableQuery });
      if (error) {
        console.error('❌ Error creating table:', error);
      } else {
        console.log('✅ Table created successfully');
      }
    } catch (error) {
      console.error('❌ Error executing table creation:', error);
    }
  }
}

async function loadBackupData() {
  console.log('📂 Loading backup data...');
  
  try {
    // Read backup file
    const backupFile = path.join(__dirname, '..', 'backups', 'FINAL-BACKUP-SUPABASE-MIGRATION.json');
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    for (const [tableName, tableData] of Object.entries(backupData.tables)) {
      if (tableData.error) {
        console.log(`⚠️ Skipping ${tableName}: ${tableData.error}`);
        continue;
      }
      
      if (tableData.data && tableData.data.length > 0) {
        console.log(`📊 Loading ${tableName}: ${tableData.data.length} records`);
        
        // Insert data in batches
        const batchSize = 1000;
        for (let i = 0; i < tableData.data.length; i += batchSize) {
          const batch = tableData.data.slice(i, i + batchSize);
          
          const { error } = await supabase
            .from(tableName)
            .insert(batch);
          
          if (error) {
            console.error(`❌ Error loading ${tableName} batch ${i/batchSize + 1}:`, error);
          } else {
            console.log(`✅ Loaded ${tableName} batch ${i/batchSize + 1}`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error loading backup data:', error);
  }
}

async function createIndexes() {
  console.log('🔍 Creating database indexes...');
  
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_deposit_daily_date ON deposit_daily(date)',
    'CREATE INDEX IF NOT EXISTS idx_withdraw_daily_date ON withdraw_daily(date)',
    'CREATE INDEX IF NOT EXISTS idx_exchange_rate_date ON exchange_rate(date)',
    'CREATE INDEX IF NOT EXISTS idx_member_report_daily_date ON member_report_daily(date)',
    'CREATE INDEX IF NOT EXISTS idx_member_report_monthly_year_month ON member_report_monthly(year, month)',
    'CREATE INDEX IF NOT EXISTS idx_new_depositor_daily_date ON new_depositor_daily(date)',
    'CREATE INDEX IF NOT EXISTS idx_headcountdep_year_month ON headcountdep(year, month)'
  ];
  
  for (const indexQuery of indexes) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: indexQuery });
      if (error) {
        console.error('❌ Error creating index:', error);
      } else {
        console.log('✅ Index created successfully');
      }
    } catch (error) {
      console.error('❌ Error executing index creation:', error);
    }
  }
}

async function setupRLS() {
  console.log('🔒 Setting up Row Level Security...');
  
  const rlsPolicies = [
    // Enable RLS on all tables
    'ALTER TABLE users ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE deposit_daily ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE withdraw_daily ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE exchange_rate ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE headcountdep ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE member_report_daily ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE member_report_monthly ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE new_depositor_daily ENABLE ROW LEVEL SECURITY',
    
    // Create policies for authenticated users
    'CREATE POLICY "Allow authenticated read" ON users FOR SELECT TO authenticated USING (true)',
    'CREATE POLICY "Allow authenticated read" ON deposit_daily FOR SELECT TO authenticated USING (true)',
    'CREATE POLICY "Allow authenticated read" ON withdraw_daily FOR SELECT TO authenticated USING (true)',
    'CREATE POLICY "Allow authenticated read" ON exchange_rate FOR SELECT TO authenticated USING (true)',
    'CREATE POLICY "Allow authenticated read" ON headcountdep FOR SELECT TO authenticated USING (true)',
    'CREATE POLICY "Allow authenticated read" ON member_report_daily FOR SELECT TO authenticated USING (true)',
    'CREATE POLICY "Allow authenticated read" ON member_report_monthly FOR SELECT TO authenticated USING (true)',
    'CREATE POLICY "Allow authenticated read" ON new_depositor_daily FOR SELECT TO authenticated USING (true)'
  ];
  
  for (const policyQuery of rlsPolicies) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: policyQuery });
      if (error) {
        console.error('❌ Error setting up RLS:', error);
      } else {
        console.log('✅ RLS policy created successfully');
      }
    } catch (error) {
      console.error('❌ Error executing RLS setup:', error);
    }
  }
}

// Run setup
setupSupabaseDatabase().catch(console.error); 