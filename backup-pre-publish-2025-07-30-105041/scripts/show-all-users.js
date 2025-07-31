const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'crm_backend_data',
  password: process.env.DB_PASSWORD || 'CRM_Backend',
  port: process.env.DB_PORT || 5432,
});

async function showAllUsers() {
  try {
    console.log('\n🔍 NEXMAX DASHBOARD - ALL USERS');
    console.log('='.repeat(50));
    
    const result = await pool.query('SELECT id, username, role, password FROM users ORDER BY id');
    
    if (result.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    console.log('\n👥 USER LIST:');
    console.log('-'.repeat(50));
    
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id} | User: ${user.username} | Role: ${user.role}`);
      console.log(`   Password: ${user.password}`);
      console.log('');
    });
    
    console.log('\n🔑 LOGIN CREDENTIALS SUMMARY:');
    console.log('='.repeat(50));
    
    const validUsers = result.rows.filter(user => 
      user.password && 
      !user.password.startsWith('$2a$') && 
      user.password.length > 5
    );
    
    if (validUsers.length === 0) {
      console.log('❌ No users with plain text passwords found');
      console.log('🔧 All passwords are hashed or invalid');
    } else {
      validUsers.forEach(user => {
        console.log(`👤 ${user.username.toUpperCase().padEnd(12)} | Password: ${user.password} | Role: ${user.role}`);
      });
    }
    
    console.log('\n📝 USAGE:');
    console.log('-'.repeat(30));
    console.log('Login URL: http://localhost:3000/login');
    console.log('Dashboard: http://localhost:3000/');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

showAllUsers(); 