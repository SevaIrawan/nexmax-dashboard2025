import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase connection...');
console.log('URL:', SUPABASE_URL);
console.log('Anon Key:', SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('Service Role Key:', SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testConnection() {
  try {
    console.log('🔄 Testing connection to Supabase...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Response:', data);
    
    // Test if we can create a simple table
    console.log('🔄 Testing table creation capability...');
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, test_column VARCHAR(50))'
    });
    
    if (createError) {
      console.log('⚠️ Cannot create tables via RPC (this is normal for new projects)');
      console.log('Error:', createError.message);
    } else {
      console.log('✅ Table creation capability confirmed');
      
      // Clean up test table
      await supabase.rpc('exec_sql', {
        sql: 'DROP TABLE IF EXISTS test_connection'
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

// Run test
testConnection().then((success) => {
  if (success) {
    console.log('\n🎉 Supabase connection test completed successfully!');
    console.log('✅ Ready to proceed with migration');
  } else {
    console.log('\n❌ Supabase connection test failed');
    console.log('Please check your credentials and try again');
  }
  process.exit(success ? 0 : 1);
}); 