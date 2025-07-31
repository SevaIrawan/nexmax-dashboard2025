import fetch from 'node-fetch';

async function testFixedAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Fixed API Endpoints...\n');

  // Test 1: Users List API
  console.log('1️⃣ Testing /api/users/list...');
  try {
    const response = await fetch(`${baseUrl}/api/users/list`);
    const data = await response.json();
    console.log('✅ Users API Response:', {
      success: data.success,
      totalUsers: data.users?.length || 0,
      message: data.message
    });
  } catch (error) {
    console.log('❌ Users API Error:', error.message);
  }

  // Test 2: Deposit Data API
  console.log('\n2️⃣ Testing /api/deposit/data...');
  try {
    const response = await fetch(`${baseUrl}/api/deposit/data?currency=ALL&line=ALL&year=ALL&month=&startDate=&endDate=&filterMode=month&page=1&limit=10`);
    const data = await response.json();
    console.log('✅ Deposit API Response:', {
      success: data.success,
      totalRecords: data.pagination?.totalRecords || 0,
      dataLength: data.data?.length || 0
    });
  } catch (error) {
    console.log('❌ Deposit API Error:', error.message);
  }

  // Test 3: Deposit Slicer Options API
  console.log('\n3️⃣ Testing /api/deposit/slicer-options...');
  try {
    const response = await fetch(`${baseUrl}/api/deposit/slicer-options`);
    const data = await response.json();
    console.log('✅ Deposit Slicer Options Response:', {
      success: data.success,
      currencies: data.options?.currencies?.length || 0,
      lines: data.options?.lines?.length || 0,
      years: data.options?.years?.length || 0,
      months: data.options?.months?.length || 0
    });
  } catch (error) {
    console.log('❌ Deposit Slicer Options Error:', error.message);
  }

  // Test 4: Withdraw Data API
  console.log('\n4️⃣ Testing /api/withdraw/data...');
  try {
    const response = await fetch(`${baseUrl}/api/withdraw/data?currency=ALL&line=ALL&year=ALL&month=&startDate=&endDate=&filterMode=month&page=1&limit=10`);
    const data = await response.json();
    console.log('✅ Withdraw API Response:', {
      success: data.success,
      totalRecords: data.pagination?.totalRecords || 0,
      dataLength: data.data?.length || 0
    });
  } catch (error) {
    console.log('❌ Withdraw API Error:', error.message);
  }

  // Test 5: Exchange Data API
  console.log('\n5️⃣ Testing /api/exchange/data...');
  try {
    const response = await fetch(`${baseUrl}/api/exchange/data?month=ALL&startDate=&endDate=&useDateRange=false&page=1&limit=10`);
    const data = await response.json();
    console.log('✅ Exchange API Response:', {
      success: data.success,
      totalRecords: data.pagination?.totalRecords || 0,
      dataLength: data.data?.length || 0
    });
  } catch (error) {
    console.log('❌ Exchange API Error:', error.message);
  }

  // Test 6: Headcount Data API
  console.log('\n6️⃣ Testing /api/headcount/data...');
  try {
    const response = await fetch(`${baseUrl}/api/headcount/data?month=ALL&startDate=&endDate=&useDateRange=false&page=1&limit=10`);
    const data = await response.json();
    console.log('✅ Headcount API Response:', {
      success: data.success,
      totalRecords: data.pagination?.totalRecords || 0,
      dataLength: data.data?.length || 0
    });
  } catch (error) {
    console.log('❌ Headcount API Error:', error.message);
  }

  // Test 7: Main Dashboard API
  console.log('\n7️⃣ Testing /api/main-dashboard...');
  try {
    const response = await fetch(`${baseUrl}/api/main-dashboard`);
    const data = await response.json();
    console.log('✅ Main Dashboard API Response:', {
      success: data.success,
      hasKPIs: !!data.kpis,
      kpiCount: Object.keys(data.kpis || {}).length
    });
  } catch (error) {
    console.log('❌ Main Dashboard API Error:', error.message);
  }

  // Test 8: Last Update API
  console.log('\n8️⃣ Testing /api/last-update...');
  try {
    const response = await fetch(`${baseUrl}/api/last-update`);
    const data = await response.json();
    console.log('✅ Last Update API Response:', {
      success: data.success,
      lastUpdate: data.date,
      totalRecords: data.totalRecords
    });
  } catch (error) {
    console.log('❌ Last Update API Error:', error.message);
  }

  console.log('\n🎉 API Testing Complete!');
}

testFixedAPIs().catch(console.error); 