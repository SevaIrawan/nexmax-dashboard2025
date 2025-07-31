import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    client = await pool.connect();
    console.log('🔍 Fetching unique values from exchange_rate for slicers...');

    // Get unique months
    const monthQuery = `
      SELECT DISTINCT EXTRACT(MONTH FROM date) as month 
      FROM exchange_rate 
      WHERE date IS NOT NULL 
      ORDER BY month
    `;

    // Get date range (min and max dates)
    const dateRangeQuery = `
      SELECT 
        MIN(date) as min_date,
        MAX(date) as max_date 
      FROM exchange_rate 
      WHERE date IS NOT NULL
    `;

    // Execute queries (removed currency and year queries since exchange_rate doesn't need them)
    const [monthResult, dateRangeResult] = await Promise.all([
      client.query(monthQuery),
      client.query(dateRangeQuery)
    ]);

    const currencies = []; // Empty array since no currency column
    const years = []; // Empty array since no year slicer needed
    const months = monthResult.rows.map(row => ({
      value: row.month?.toString(),
      label: new Date(2000, row.month - 1, 1).toLocaleString('en', { month: 'long' })
    }));

    const dateRange = dateRangeResult.rows[0];

    console.log('✅ Slicer options loaded:', {
      currencies: currencies.length,
      months: months.length,
      dateRange
    });

    res.status(200).json({
      success: true,
      options: {
        currencies,
        years,
        months,
        dateRange: {
          min: dateRange.min_date,
          max: dateRange.max_date
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching exchange_rate slicer options:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while fetching slicer options',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 