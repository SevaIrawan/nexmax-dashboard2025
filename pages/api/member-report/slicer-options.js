import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { selectedCurrency } = req.query;
  let client;

  try {
    client = await pool.connect();
    console.log('🔍 Fetching unique values from member_report_daily for slicers...', { selectedCurrency });

    // Get unique currencies
    const currencyQuery = `
      SELECT DISTINCT currency 
      FROM member_report_daily 
      WHERE currency IS NOT NULL 
      ORDER BY currency
    `;

    // Get unique lines - dependent on selected currency
    let lineQuery = `
      SELECT DISTINCT line 
      FROM member_report_daily 
      WHERE line IS NOT NULL
    `;
    
    if (selectedCurrency && selectedCurrency !== 'ALL') {
      lineQuery += ` AND currency = $1`;
    }
    
    lineQuery += ` ORDER BY line`;

    // Get unique years
    const yearQuery = `
      SELECT DISTINCT EXTRACT(YEAR FROM date) as year 
      FROM member_report_daily 
      WHERE date IS NOT NULL 
      ORDER BY year DESC
    `;

    // Get unique months
    const monthQuery = `
      SELECT DISTINCT EXTRACT(MONTH FROM date) as month 
      FROM member_report_daily 
      WHERE date IS NOT NULL 
      ORDER BY month
    `;

    // Get date range (min and max dates)
    const dateRangeQuery = `
      SELECT 
        MIN(date) as min_date,
        MAX(date) as max_date 
      FROM member_report_daily 
      WHERE date IS NOT NULL
    `;

    // Execute queries
    const [currencyResult, yearResult, monthResult, dateRangeResult] = await Promise.all([
      client.query(currencyQuery),
      client.query(yearQuery),
      client.query(monthQuery),
      client.query(dateRangeQuery)
    ]);

    // Execute line query with currency filter if needed
    const lineParams = selectedCurrency && selectedCurrency !== 'ALL' ? [selectedCurrency] : [];
    const lineResult = await client.query(lineQuery, lineParams);

    const currencies = currencyResult.rows.map(row => row.currency);
    const lines = lineResult.rows.map(row => row.line);
    const years = yearResult.rows.map(row => row.year?.toString());
    const months = monthResult.rows.map(row => ({
      value: row.month?.toString(),
      label: new Date(2000, row.month - 1, 1).toLocaleString('en', { month: 'long' })
    }));

    const dateRange = dateRangeResult.rows[0];

    console.log('✅ Slicer options loaded:', {
      currencies: currencies.length,
      lines: lines.length,
      years: years.length,
      months: months.length,
      dateRange,
      selectedCurrency
    });

    res.status(200).json({
      success: true,
      options: {
        currencies,
        lines,
        years,
        months,
        dateRange: {
          min: dateRange.min_date,
          max: dateRange.max_date
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