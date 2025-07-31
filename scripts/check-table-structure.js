import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking table structure in Supabase...');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkTableStructure() {
  try {
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
    
    for (const tableName of tables) {
      console.log(`\n📊 Checking table: ${tableName}`);
      
      try {
        // Try to get a sample record
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Error accessing ${tableName}:`, error.message);
        } else {
          console.log(`✅ Table ${tableName} exists`);
          if (data && data.length > 0) {
            console.log(`📋 Columns:`, Object.keys(data[0]));
            console.log(`📊 Sample data:`, data[0]);
          } else {
            console.log(`⚠️ Table ${tableName} is empty`);
          }
        }
      } catch (error) {
        console.log(`❌ Exception for ${tableName}:`, error.message);
      }
    }
    
    console.log('\n✅ Table structure check completed!');
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

// Run check
checkTableStructure().catch(console.error); 