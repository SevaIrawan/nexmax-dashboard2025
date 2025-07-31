import pool from '../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { currency = 'MYR', year = '2024' } = req.query;

  let client;
  try {
    client = await pool.connect();
    console.log('📈 Fetching line chart data from PostgreSQL...');

    // Get operational efficiency trend data
    const operationalEfficiencyQuery = `
      SELECT 
        month,
        SUM(deposit_amount + add_transaction) as total_revenue,
        SUM(withdraw_amount + deduct_transaction) as total_cost
      FROM member_report_monthly 
      WHERE currency = $1 AND year = $2
        AND month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July')
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
        END;
    `;

    // Get growth vs profitability analysis data
    const growthProfitabilityQuery = `
      SELECT 
        m.month,
        SUM(m.deposit_amount + m.add_transaction - m.withdraw_amount - m.deduct_transaction) as net_profit,
        COALESCE(nd.total_new_depositor, 0) as new_depositor
      FROM member_report_monthly m
      LEFT JOIN (
        SELECT 
          month,
          SUM(new_depositor) as total_new_depositor
        FROM new_depositor
        WHERE currency = $1 AND year = $2
          AND month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July')
        GROUP BY month
      ) nd ON m.month = nd.month
      WHERE m.currency = $1 AND m.year = $2
        AND m.month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July')
      GROUP BY m.month, nd.total_new_depositor
      ORDER BY 
        CASE m.month 
          WHEN 'January' THEN 1 
          WHEN 'February' THEN 2 
          WHEN 'March' THEN 3 
          WHEN 'April' THEN 4 
          WHEN 'May' THEN 5 
          WHEN 'June' THEN 6 
          WHEN 'July' THEN 7 
        END;
    `;

    const [growthProfitabilityResult, operationalEfficiencyResult] = await Promise.all([
      client.query(growthProfitabilityQuery, [currency, year]),
      client.query(operationalEfficiencyQuery, [currency, year])
    ]);

    // Format data for charts
    const growthProfitabilityData = {
      categories: growthProfitabilityResult.rows.map(row => row.month.substring(0, 3)), // Jan, Feb, etc
      series: [
        {
          name: 'Net Profit',
          data: growthProfitabilityResult.rows.map(row => Math.round(parseFloat(row.net_profit || 0)))
        },
        {
          name: 'New Depositor',
          data: growthProfitabilityResult.rows.map(row => parseInt(row.new_depositor || 0))
        }
      ]
    };

    const operationalEfficiencyData = {
      categories: operationalEfficiencyResult.rows.map(row => row.month.substring(0, 3)),
      series: [
        {
          name: 'Total Revenue',
          data: operationalEfficiencyResult.rows.map(row => Math.round(parseFloat(row.total_revenue || 0)))
        },
        {
          name: 'Total Cost',
          data: operationalEfficiencyResult.rows.map(row => Math.round(parseFloat(row.total_cost || 0)))
        }
      ]
    };

    console.log('✅ Line chart data loaded successfully');
    console.log('📊 Growth vs Profitability Data:', growthProfitabilityData);
    console.log('📈 Operational Efficiency Data:', operationalEfficiencyData);

    res.status(200).json({
      success: true,
      currency,
      growthProfitabilityTrend: growthProfitabilityData,
      operationalEfficiencyTrend: operationalEfficiencyData,
      totalMonths: growthProfitabilityResult.rows.length
    });

  } catch (error) {
    console.error('❌ Line chart data error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message,
      fallbackData: {
        growthProfitabilityTrend: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          series: [
            { name: 'Net Profit', data: [450000, 520000, 480000, 600000, 580000, 650000] },
            { name: 'New Depositor', data: [1200, 1350, 1280, 1450, 1380, 1500] }
          ]
        },
        operationalEfficiencyTrend: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          series: [
            { name: 'Total Revenue', data: [2400000, 2600000, 2500000, 2800000, 2700000, 3000000] },
            { name: 'Total Cost', data: [1950000, 2080000, 2020000, 2200000, 2120000, 2350000] }
          ]
        }
      }
    });
  } finally {
    if (client) client.release();
  }
} 