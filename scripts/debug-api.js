import dotenv from 'dotenv';
import { selectData } from '../lib/supabase.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function debugAPI() {
  console.log('🔍 Debugging API and Supabase connection...\n');

  // Test 1: Direct Supabase connection
  console.log('1️⃣ Testing direct Supabase connection...');
  try {
    const usersData = await selectData('users', '*', {});
    console.log('✅ Users data:', {
      isArray: Array.isArray(usersData),
      length: usersData?.length || 0,
      sample: usersData?.[0] || 'No data'
    });
  } catch (error) {
    console.log('❌ Users API Error:', error.message);
  }

  // Test 2: Member report daily
  console.log('\n2️⃣ Testing member_report_daily...');
  try {
    const memberData = await selectData('member_report_daily', '*', {});
    console.log('✅ Member report data:', {
      isArray: Array.isArray(memberData),
      length: memberData?.length || 0,
      sample: memberData?.[0] || 'No data'
    });
  } catch (error) {
    console.log('❌ Member report API Error:', error.message);
  }

  // Test 3: Exchange rate
  console.log('\n3️⃣ Testing exchange_rate...');
  try {
    const exchangeData = await selectData('exchange_rate', '*', {});
    console.log('✅ Exchange rate data:', {
      isArray: Array.isArray(exchangeData),
      length: exchangeData?.length || 0,
      sample: exchangeData?.[0] || 'No data'
    });
  } catch (error) {
    console.log('❌ Exchange rate API Error:', error.message);
  }

  // Test 4: Headcount
  console.log('\n4️⃣ Testing headcountdep...');
  try {
    const headcountData = await selectData('headcountdep', '*', {});
    console.log('✅ Headcount data:', {
      isArray: Array.isArray(headcountData),
      length: headcountData?.length || 0,
      sample: headcountData?.[0] || 'No data'
    });
  } catch (error) {
    console.log('❌ Headcount API Error:', error.message);
  }

  console.log('\n🎉 Debug complete!');
}

debugAPI().catch(console.error); 