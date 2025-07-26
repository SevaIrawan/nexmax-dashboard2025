const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'crm_backend_data',
  password: process.env.DB_PASSWORD || 'CRM_Backend',
  port: process.env.DB_PORT || 5432,
});

async function createAdminUser() {
  try {
    console.log('🔍 Connecting to database...');
    
    // Test koneksi
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', testResult.rows[0]);

    // Cek apakah tabel users ada
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('📝 Creating users table...');
      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ Users table created successfully!');
    } else {
      console.log('✅ Users table already exists');
    }

    // Cek apakah admin user sudah ada
    const adminExists = await pool.query(`
      SELECT * FROM users WHERE username = 'admin'
    `);

    if (adminExists.rows.length > 0) {
      console.log('👤 Admin user already exists:', adminExists.rows[0]);
      
      // Update password admin jika diperlukan
      const updateResult = await pool.query(`
        UPDATE users 
        SET password = 'admin123', role = 'admin' 
        WHERE username = 'admin'
        RETURNING *
      `);
      console.log('🔄 Admin password updated:', updateResult.rows[0]);
    } else {
      console.log('👤 Creating admin user...');
      const insertResult = await pool.query(`
        INSERT INTO users (username, email, password, role, created_at)
        VALUES ('admin', 'admin@nexmax.com', 'admin123', 'admin', NOW())
        RETURNING *
      `);
      console.log('✅ Admin user created successfully:', insertResult.rows[0]);
    }

    // Tampilkan semua users
    const allUsers = await pool.query('SELECT * FROM users ORDER BY id');
    console.log('📋 All users in database:');
    allUsers.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}, Password: ${user.password}`);
    });

    console.log('\n🎉 Setup completed! You can now login with:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

createAdminUser(); 