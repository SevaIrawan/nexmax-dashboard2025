import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    client = await pool.connect();
    console.log('🔨 Creating exchange_rate table...');

    // Create exchange_rate table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS exchange_rate (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        currency VARCHAR(10) NOT NULL,
        rate DECIMAL(10,4) NOT NULL,
        year INTEGER,
        month VARCHAR(20),
        uniquekey VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await client.query(createTableQuery);
    console.log('✅ exchange_rate table created successfully');

    res.status(200).json({
      success: true,
      message: 'exchange_rate table created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating exchange_rate table:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while creating table',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 