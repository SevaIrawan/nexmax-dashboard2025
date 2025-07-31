const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'crm_backend_data',
  password: process.env.DB_PASSWORD || 'CRM_Backend',
  port: process.env.DB_PORT || 5432,
});

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n');
    
    const result = await pool.query('SELECT id, username, role, password FROM users ORDER BY id');
    
    if (result.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    console.log('👥 NEXMAX Dashboard Users:');
    console.log('='.repeat(60));
    
    result.rows.forEach(user => {
      console.log(`🆔 ID: ${user.id}`);
      console.log(`👤 Username: ${user.username}`);
      console.log(`🏷️  Role: ${user.role}`);
      console.log(`🔑 Password: ${user.password}`);
      console.log('-'.repeat(40));
    });
    
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('='.repeat(40));
    result.rows.forEach(user => {
      console.log(`${user.username} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsers(); 