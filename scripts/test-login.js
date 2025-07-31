import fetch from 'node-fetch';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    console.log('🧪 Testing login API...');
    
    const loginData = {
      username: 'admin',
      password: 'NexMax2024!@#'
    };
    
    console.log('📤 Sending login request...');
    console.log('   Username:', loginData.username);
    console.log('   Password:', loginData.password);
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    const result = await response.json();
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response body:', result);
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('🔑 Token:', result.token ? result.token.substring(0, 20) + '...' : 'No token');
    } else {
      console.log('❌ Login failed!');
      console.log('❌ Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Test bcrypt directly
async function testBcrypt() {
  console.log('\n🔧 Testing bcrypt directly...');
  
  const plainPassword = 'NexMax2024!@#';
  const hashedPassword = '$2a$10$WnadgAKZjj/FN...'; // From database
  
  console.log('   Plain password:', plainPassword);
  console.log('   Hashed password (from DB):', hashedPassword);
  
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('   Bcrypt compare result:', isValid);
  } catch (error) {
    console.log('   Bcrypt error:', error.message);
  }
}

testLogin();
testBcrypt(); 