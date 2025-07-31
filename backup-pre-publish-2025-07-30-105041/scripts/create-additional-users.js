const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'crm_backend_data',
  password: process.env.DB_PASSWORD || 'CRM_Backend',
  port: process.env.DB_PORT || 5432,
});

async function createUsers() {
  try {
    console.log('🔄 Creating additional users...\n');
    
    // List of users to create
    const usersToCreate = [
      { username: 'executive', password: 'Executive2024!@#', role: 'manager' },
      { username: 'operator', password: 'Operator2024!@#', role: 'user' }
    ];
    
    for (const userData of usersToCreate) {
      try {
        // Check if user already exists
        const existingUser = await pool.query('SELECT username FROM users WHERE username = $1', [userData.username]);
        
        if (existingUser.rows.length > 0) {
          console.log(`⚠️  User ${userData.username} already exists, skipping...`);
          continue;
        }
        
        // Create new user
        const result = await pool.query(
          'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
          [userData.username, userData.password, userData.role]
        );
        
        console.log(`✅ Created user: ${result.rows[0].username} (${result.rows[0].role})`);
        
      } catch (userError) {
        console.error(`❌ Error creating user ${userData.username}:`, userError.message);
      }
    }
    
    console.log('\n🔍 Checking all users in database...\n');
    
    const allUsers = await pool.query('SELECT id, username, role, password FROM users ORDER BY id');
    
    console.log('👥 NEXMAX Dashboard Users:');
    console.log('='.repeat(60));
    
    allUsers.rows.forEach(user => {
      console.log(`🆔 ID: ${user.id}`);
      console.log(`👤 Username: ${user.username}`);
      console.log(`🏷️  Role: ${user.role}`);
      console.log(`🔑 Password: ${user.password}`);
      console.log('-'.repeat(40));
    });
    
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('='.repeat(40));
    allUsers.rows.forEach(user => {
      console.log(`Username: ${user.username} | Password: ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createUsers(); 