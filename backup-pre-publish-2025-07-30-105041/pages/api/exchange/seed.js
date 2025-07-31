import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    client = await pool.connect();
    console.log('🌱 Seeding exchange_rate table...');

    // Check if table has data
    const countQuery = `SELECT COUNT(*) as total FROM exchange_rate`;
    const countResult = await client.query(countQuery);
    const totalRecords = parseInt(countResult.rows[0].total);

    if (totalRecords > 0) {
      return res.status(200).json({
        success: true,
        message: 'Table already has data',
        totalRecords
      });
    }

    // Sample data for exchange_rate
    const sampleData = [
      {
        date: '2024-01-01',
        currency: 'USD',
        rate: 3.75,
        year: 2024,
        month: 'January',
        uniquekey: '2024-01-01-USD'
      },
      {
        date: '2024-01-02',
        currency: 'USD',
        rate: 3.76,
        year: 2024,
        month: 'January',
        uniquekey: '2024-01-02-USD'
      },
      {
        date: '2024-01-01',
        currency: 'SGD',
        rate: 2.80,
        year: 2024,
        month: 'January',
        uniquekey: '2024-01-01-SGD'
      },
      {
        date: '2024-01-02',
        currency: 'SGD',
        rate: 2.81,
        year: 2024,
        month: 'January',
        uniquekey: '2024-01-02-SGD'
      },
      {
        date: '2024-02-01',
        currency: 'USD',
        rate: 3.77,
        year: 2024,
        month: 'February',
        uniquekey: '2024-02-01-USD'
      },
      {
        date: '2024-02-01',
        currency: 'SGD',
        rate: 2.82,
        year: 2024,
        month: 'February',
        uniquekey: '2024-02-01-SGD'
      },
      {
        date: '2023-12-01',
        currency: 'USD',
        rate: 3.74,
        year: 2023,
        month: 'December',
        uniquekey: '2023-12-01-USD'
      },
      {
        date: '2023-12-01',
        currency: 'SGD',
        rate: 2.79,
        year: 2023,
        month: 'December',
        uniquekey: '2023-12-01-SGD'
      }
    ];

    // Insert sample data
    for (const data of sampleData) {
      const insertQuery = `
        INSERT INTO exchange_rate (date, currency, rate, year, month, uniquekey)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      await client.query(insertQuery, [
        data.date,
        data.currency,
        data.rate,
        data.year,
        data.month,
        data.uniquekey
      ]);
    }

    console.log(`✅ Successfully seeded ${sampleData.length} records into exchange_rate`);

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${sampleData.length} records`,
      totalRecords: sampleData.length
    });

  } catch (error) {
    console.error('❌ Error seeding exchange_rate table:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while seeding data',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 