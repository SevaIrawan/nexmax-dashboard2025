import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing API endpoints with Supabase...');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testEndpoints() {
  try {
    console.log('🔄 Testing last-update endpoint...');
    
    // Test last-update logic - get all dates and find latest
    const { data: memberData, error } = await supabase
      .from('member_report_daily')
      .select('date');
    
    if (error) {
      console.error('❌ Error fetching last update:', error);
      return;
    }
    
    if (memberData && memberData.length > 0) {
      const dates = memberData.map(row => new Date(row.date));
      const latestDate = new Date(Math.max(...dates));
      console.log('✅ Last update data:', {
        latestDate: latestDate.toISOString(),
        totalRecords: memberData.length
      });
    } else {
      console.log('⚠️ No member data found');
    }
    
    // Test main dashboard data
    console.log('🔄 Testing main dashboard data...');
    
    const { data: depositData, error: depositError } = await supabase
      .from('member_report_daily')
      .select('deposit_amount')
      .eq('currency', 'MYR');
    
    if (depositError) {
      console.error('❌ Error fetching deposit data:', depositError);
    } else {
      const totalDeposit = depositData?.reduce((sum, row) => sum + parseFloat(row.deposit_amount || 0), 0) || 0;
      console.log('✅ Deposit data:', {
        totalRecords: depositData?.length || 0,
        totalAmount: totalDeposit
      });
    }
    
    // Test member data
    const { data: memberData2, error: memberError } = await supabase
      .from('member_report_daily')
      .select('user_name')
      .limit(5);
    
    if (memberError) {
      console.error('❌ Error fetching member data:', memberError);
    } else {
      const uniqueUsers = new Set(memberData2?.map(row => row.user_name) || []).size;
      console.log('✅ Member data:', {
        sampleUsers: memberData2?.slice(0, 3).map(row => row.user_name),
        uniqueUsers: uniqueUsers
      });
    }
    
    console.log('✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testEndpoints().catch(console.error); 