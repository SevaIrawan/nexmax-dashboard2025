import pool from '../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { currency = 'MYR', year = '2024' } = req.query;
  let client;

  try {
    console.log('📊 Fetching bar chart data from PostgreSQL...');
    client = await pool.connect();

    // Query 1: Deposit Amount by Month (Bar Chart 1)
    const depositQuery = `
      SELECT 
        month,
        COALESCE(SUM(deposit_amount), 0) as total_deposit
      FROM deposit_monthly 
      WHERE currency = $1 AND year = $2
      GROUP BY month 
      ORDER BY 
        CASE month
          WHEN 'January' THEN 1
          WHEN 'February' THEN 2
          WHEN 'March' THEN 3
          WHEN 'April' THEN 4
          WHEN 'May' THEN 5
          WHEN 'June' THEN 6
          WHEN 'July' THEN 7
          WHEN 'August' THEN 8
          WHEN 'September' THEN 9
          WHEN 'October' THEN 10
          WHEN 'November' THEN 11
          WHEN 'December' THEN 12
        END
    `;

    // Query 2: New Depositor by Month (Bar Chart 2)
    const newDepositorQuery = `
      SELECT 
        month,
        COALESCE(SUM(new_depositor), 0) as total_new_depositor
      FROM new_depositor 
      WHERE currency = $1 AND year = $2
      GROUP BY month 
      ORDER BY 
        CASE month
          WHEN 'January' THEN 1
          WHEN 'February' THEN 2
          WHEN 'March' THEN 3
          WHEN 'April' THEN 4
          WHEN 'May' THEN 5
          WHEN 'June' THEN 6
          WHEN 'July' THEN 7
          WHEN 'August' THEN 8
          WHEN 'September' THEN 9
          WHEN 'October' THEN 10
          WHEN 'November' THEN 11
          WHEN 'December' THEN 12
        END
    `;

    // Execute both queries
    const [depositResult, newDepositorResult] = await Promise.all([
      client.query(depositQuery, [currency, year]),
      client.query(newDepositorQuery, [currency, year])
    ]);

    // Process Deposit Data
    const depositCategories = depositResult.rows.map(row => 
      row.month.substring(0, 3) // Convert to short form (Jan, Feb, etc.)
    );
    const depositAmounts = depositResult.rows.map(row => 
      parseFloat(row.total_deposit || 0)
    );

    // Process New Depositor Data  
    const newDepositorCategories = newDepositorResult.rows.map(row => 
      row.month.substring(0, 3) // Convert to short form (Jan, Feb, etc.)
    );
    const newDepositorCounts = newDepositorResult.rows.map(row => 
      parseFloat(row.total_new_depositor || 0)
    );

    const response = {
      success: true,
      depositData: {
        series: [{
          name: 'Deposit Amount',
          data: depositAmounts
        }],
        categories: depositCategories
      },
      newDepositorData: {
        series: [{
          name: 'New Depositor',
          data: newDepositorCounts
        }],
        categories: newDepositorCategories
      }
    };

    console.log('✅ Bar chart data loaded successfully');
    console.log('📊 Deposit Data:', {
      categories: depositCategories,
      dataPoints: depositAmounts.length
    });
    console.log('📈 New Depositor Data:', {
      categories: newDepositorCategories,
      dataPoints: newDepositorCounts.length
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Bar chart data error:', error);
    
    // Fallback data in case of error
    const fallbackData = {
      success: false,
      error: error.message,
      depositData: {
        series: [{
          name: 'Deposit Amount',
          data: [44000, 55000, 57000, 56000, 61000, 58000, 63000]
        }],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      newDepositorData: {
        series: [{
          name: 'New Depositor',
          data: [12, 19, 15, 17, 22, 18, 25]
        }],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      }
    };
    
    res.status(500).json(fallbackData);
  } finally {
    if (client) {
      client.release();
    }
  }
} 