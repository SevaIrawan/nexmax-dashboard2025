import fetch from 'node-fetch';

async function testWebAPI() {
  try {
    console.log('🔍 Testing web API endpoints...');
    
    // Test last-update endpoint
    console.log('🔄 Testing /api/last-update...');
    const lastUpdateResponse = await fetch('http://localhost:3000/api/last-update');
    
    if (lastUpdateResponse.ok) {
      const lastUpdateData = await lastUpdateResponse.json();
      console.log('✅ Last update API:', lastUpdateData);
    } else {
      console.error('❌ Last update API error:', lastUpdateResponse.status, lastUpdateResponse.statusText);
      const errorText = await lastUpdateResponse.text();
      console.error('Error details:', errorText);
    }
    
    // Test main dashboard endpoint
    console.log('\n🔄 Testing /api/main-dashboard...');
    const dashboardResponse = await fetch('http://localhost:3000/api/main-dashboard');
    
    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log('✅ Main dashboard API:', dashboardData);
    } else {
      console.error('❌ Main dashboard API error:', dashboardResponse.status, dashboardResponse.statusText);
      const errorText = await dashboardResponse.text();
      console.error('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
testWebAPI().catch(console.error); 