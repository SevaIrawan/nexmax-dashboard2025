import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkSupabaseData() {
  console.log('🔍 Checking data in Supabase...\n');

  const tables = [
    'users',
    'member_report_daily', 
    'member_report_monthly',
    'exchange_rate',
    'headcountdep',
    'new_depositor_daily'
  ];

  for (const tableName of tables) {
    try {
      console.log(`📊 Checking table: ${tableName}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(5);

      if (error) {
        console.log(`❌ Error accessing ${tableName}:`, error.message);
      } else {
        console.log(`✅ ${tableName}: ${data.length} records found`);
        if (data.length > 0) {
          console.log(`   Sample data:`, data[0]);
        }
      }
    } catch (error) {
      console.log(`❌ Exception for ${tableName}:`, error.message);
    }
    console.log('');
  }

  console.log('🎉 Data check complete!');
}

checkSupabaseData().catch(console.error); 