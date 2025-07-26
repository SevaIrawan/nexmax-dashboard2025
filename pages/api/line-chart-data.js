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

    // Get net profit trend data (last 6 months)
    const netProfitQuery = `
      SELECT 
        month,
        SUM(net_profit) as total_net_profit,
        COUNT(DISTINCT userkey) as active_members
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

    // Get member growth trend data
    const memberGrowthQuery = `
      SELECT 
        month,
        COUNT(DISTINCT uniquekey) as unique_members,
        AVG(ggr) as avg_ggr
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

    const [netProfitResult, memberGrowthResult] = await Promise.all([
      client.query(netProfitQuery, [currency, year]),
      client.query(memberGrowthQuery, [currency, year])
    ]);

    // Format data for charts
    const netProfitData = {
      categories: netProfitResult.rows.map(row => row.month.substring(0, 3)), // Jan, Feb, etc
      series: [
        {
          name: 'Net Profit',
          data: netProfitResult.rows.map(row => Math.round(parseFloat(row.total_net_profit || 0)))
        },
        {
          name: 'Active Members',
          data: netProfitResult.rows.map(row => parseInt(row.active_members || 0))
        }
      ]
    };

    const memberGrowthData = {
      categories: memberGrowthResult.rows.map(row => row.month.substring(0, 3)),
      series: [
        {
          name: 'Unique Members',
          data: memberGrowthResult.rows.map(row => parseInt(row.unique_members || 0))
        },
        {
          name: 'Avg GGR',
          data: memberGrowthResult.rows.map(row => Math.round(parseFloat(row.avg_ggr || 0)))
        }
      ]
    };

    console.log('✅ Line chart data loaded successfully');
    console.log('📊 Net Profit Data:', netProfitData);
    console.log('📈 Member Growth Data:', memberGrowthData);

    res.status(200).json({
      success: true,
      currency,
      netProfitTrend: netProfitData,
      memberGrowthTrend: memberGrowthData,
      totalMonths: netProfitResult.rows.length
    });

  } catch (error) {
    console.error('❌ Line chart data error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message,
      fallbackData: {
        netProfitTrend: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          series: [
            { name: 'Net Profit', data: [450000, 520000, 480000, 600000, 580000, 650000] },
            { name: 'Active Members', data: [3200, 3500, 3300, 3800, 3600, 4000] }
          ]
        },
        memberGrowthTrend: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          series: [
            { name: 'Unique Members', data: [2400, 2600, 2500, 2800, 2700, 3000] },
            { name: 'Avg GGR', data: [150, 175, 160, 190, 180, 200] }
          ]
        }
      }
    });
  } finally {
    if (client) client.release();
  }
} 