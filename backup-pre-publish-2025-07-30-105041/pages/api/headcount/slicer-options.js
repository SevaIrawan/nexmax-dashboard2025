import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    client = await pool.connect();
    console.log('🔍 Fetching unique values from headcountdep for slicers...');

    // Get unique months
    const monthQuery = `
      SELECT DISTINCT EXTRACT(MONTH FROM date) as month 
      FROM headcountdep 
      WHERE date IS NOT NULL 
      ORDER BY month
    `;

    // Get date range
    const dateRangeQuery = `
      SELECT 
        MIN(date) as min_date,
        MAX(date) as max_date
      FROM headcountdep 
      WHERE date IS NOT NULL
    `;

    // Execute queries (removed year and currency queries)
    const [monthResult, dateRangeResult] = await Promise.all([
      client.query(monthQuery),
      client.query(dateRangeQuery)
    ]);

    const years = []; // Empty array since no year slicer needed
    const currencies = []; // Empty array since no currency slicer needed
    const months = monthResult.rows.map(row => ({
      value: row.month?.toString(),
      label: new Date(2000, row.month - 1, 1).toLocaleString('en', { month: 'long' })
    }));

    console.log('✅ Slicer options loaded:', {
      years: years.length,
      currencies: currencies.length,
      months: months.length
    });

    res.status(200).json({
      success: true,
      options: {
        years,
        currencies,
        months,
        dateRange: {
          min: dateRangeResult.rows[0]?.min_date || null,
          max: dateRangeResult.rows[0]?.max_date || null
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching slicer options:', error);
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