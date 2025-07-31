import fetch from 'node-fetch';

async function testNoLimitAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing APIs WITHOUT limit to get ALL data...\n');

  // Test 1: Deposit Data without limit
  console.log('1️⃣ Testing /api/deposit/data WITHOUT limit...');
  try {
    const response = await fetch(`${baseUrl}/api/deposit/data?currency=ALL&line=ALL&year=ALL&month=&startDate=&endDate=&filterMode=month&page=1`);
    const data = await response.json();
    console.log('✅ Deposit API (No Limit) Response:', {
      success: data.success,
      totalRecords: data.pagination?.totalRecords || 0,
      dataLength: data.data?.length || 0,
      recordsPerPage: data.pagination?.recordsPerPage || 0,
      totalPages: data.pagination?.totalPages || 0
    });
  } catch (error) {
    console.log('❌ Deposit API Error:', error.message);
  }

  // Test 2: Withdraw Data without limit
  console.log('\n2️⃣ Testing /api/withdraw/data WITHOUT limit...');
  try {
    const response = await fetch(`${baseUrl}/api/withdraw/data?currency=ALL&line=ALL&year=ALL&month=&startDate=&endDate=&filterMode=month&page=1`);
    const data = await response.json();
    console.log('✅ Withdraw API (No Limit) Response:', {
      success: data.success,
      totalRecords: data.pagination?.totalRecords || 0,
      dataLength: data.data?.length || 0,
      recordsPerPage: data.pagination?.recordsPerPage || 0,
      totalPages: data.pagination?.totalPages || 0
    });
  } catch (error) {
    console.log('❌ Withdraw API Error:', error.message);
  }

  // Test 3: Exchange Data without limit
  console.log('\n3️⃣ Testing /api/exchange/data WITHOUT limit...');
  try {
    const response = await fetch(`${baseUrl}/api/exchange/data?month=ALL&startDate=&endDate=&useDateRange=false&page=1`);
    const data = await response.json();
    console.log('✅ Exchange API (No Limit) Response:', {
      success: data.success,
      totalRecords: data.pagination?.totalRecords || 0,
      dataLength: data.data?.length || 0,
      recordsPerPage: data.pagination?.recordsPerPage || 0,
      totalPages: data.pagination?.totalPages || 0
    });
  } catch (error) {
    console.log('❌ Exchange API Error:', error.message);
  }

  // Test 4: Headcount Data without limit
  console.log('\n4️⃣ Testing /api/headcount/data WITHOUT limit...');
  try {
    const response = await fetch(`${baseUrl}/api/headcount/data?month=ALL&startDate=&endDate=&useDateRange=false&page=1`);
    const data = await response.json();
    console.log('✅ Headcount API (No Limit) Response:', {
      success: data.success,
      totalRecords: data.pagination?.totalRecords || 0,
      dataLength: data.data?.length || 0,
      recordsPerPage: data.pagination?.recordsPerPage || 0,
      totalPages: data.pagination?.totalPages || 0
    });
  } catch (error) {
    console.log('❌ Headcount API Error:', error.message);
  }

  console.log('\n🎉 No Limit API Testing Complete!');
}

testNoLimitAPIs().catch(console.error);