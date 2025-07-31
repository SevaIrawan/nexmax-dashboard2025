import pool from '../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { currency = 'MYR', year = '2024' } = req.query;
  let client;

  try {
    console.log('📊 Fetching Retention vs Churn and CLV data...');
    client = await pool.connect();

    // Query 1: Retention vs Churn Rate (replacing Deposit Amount chart)
    const retentionQuery = `
      WITH monthly_data AS (
        SELECT 
          m.month,
          COUNT(DISTINCT m.userkey) as active_members_current,
          COALESCE(nd.total_new_depositor, 0) as new_depositors,
          CASE m.month 
            WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3 
            WHEN 'April' THEN 4 WHEN 'May' THEN 5 WHEN 'June' THEN 6 
            WHEN 'July' THEN 7 WHEN 'August' THEN 8 WHEN 'September' THEN 9 
            WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12 
          END as month_order
        FROM member_report_monthly m
        LEFT JOIN (
          SELECT month, SUM(new_depositor) as total_new_depositor
          FROM new_depositor
          WHERE currency = $1 AND year = $2
          GROUP BY month
        ) nd ON m.month = nd.month
        WHERE m.currency = $1 AND m.year = $2
        GROUP BY m.month, nd.total_new_depositor
      ),
      retention_calc AS (
        SELECT 
          month,
          month_order,
          active_members_current,
          new_depositors,
          LAG(active_members_current) OVER (ORDER BY month_order) as active_members_previous,
          CASE 
            WHEN LAG(active_members_current) OVER (ORDER BY month_order) IS NULL OR LAG(active_members_current) OVER (ORDER BY month_order) = 0 
            THEN 0
            ELSE GREATEST(0, CAST((active_members_current - new_depositors) AS DECIMAL) / CAST(LAG(active_members_current) OVER (ORDER BY month_order) AS DECIMAL))
          END as retention_rate
        FROM monthly_data
      )
      SELECT 
        month,
        ROUND(retention_rate * 100, 2) as retention_rate_percent,
        ROUND(GREATEST(0.01, 1 - retention_rate) * 100, 2) as churn_rate_percent
      FROM retention_calc
      WHERE month_order IS NOT NULL
      ORDER BY month_order;
    `;

    // Query 2: CLV and Purchase Frequency (replacing New Depositor chart)
    const clvQuery = `
      WITH monthly_metrics AS (
        SELECT 
          m.month,
          CASE m.month 
            WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3 
            WHEN 'April' THEN 4 WHEN 'May' THEN 5 WHEN 'June' THEN 6 
            WHEN 'July' THEN 7 WHEN 'August' THEN 8 WHEN 'September' THEN 9 
            WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12 
          END as month_order,
          COUNT(DISTINCT m.userkey) as active_members,
          COALESCE(SUM(m.deposit_cases), 0) as total_deposit_cases,
          COALESCE(SUM(m.deposit_amount), 0) as total_deposit_amount,
          COALESCE(nd.total_new_depositor, 0) as new_depositors,
          CASE 
            WHEN COUNT(DISTINCT m.userkey) = 0 THEN 0
            ELSE CAST(COALESCE(SUM(m.deposit_cases), 0) AS DECIMAL) / COUNT(DISTINCT m.userkey)
          END as purchase_frequency,
          CASE 
            WHEN COALESCE(SUM(m.deposit_cases), 0) = 0 THEN 0
            ELSE CAST(COALESCE(SUM(m.deposit_amount), 0) AS DECIMAL) / COALESCE(SUM(m.deposit_cases), 0)
          END as atv,
          LAG(COUNT(DISTINCT m.userkey)) OVER (ORDER BY 
            CASE m.month 
              WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3 
              WHEN 'April' THEN 4 WHEN 'May' THEN 5 WHEN 'June' THEN 6 
              WHEN 'July' THEN 7 WHEN 'August' THEN 8 WHEN 'September' THEN 9 
              WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12 
            END
          ) as previous_active_members
        FROM member_report_monthly m
        LEFT JOIN (
          SELECT month, SUM(new_depositor) as total_new_depositor
          FROM new_depositor
          WHERE currency = $1 AND year = $2
          GROUP BY month
        ) nd ON m.month = nd.month
        WHERE m.currency = $1 AND m.year = $2
        GROUP BY m.month, nd.total_new_depositor
      ),
      clv_calculations AS (
        SELECT 
          month,
          month_order,
          purchase_frequency,
          atv,
          CASE 
            WHEN previous_active_members IS NULL OR previous_active_members = 0 THEN 0.01
            ELSE GREATEST(0.01, 1 - GREATEST(0, 
              CAST((active_members - new_depositors) AS DECIMAL) / previous_active_members
            ))
          END as churn_rate
        FROM monthly_metrics
      )
      SELECT 
        month,
        ROUND(purchase_frequency, 4) as purchase_frequency,
        ROUND(purchase_frequency * atv * (1.0 / churn_rate), 2) as clv
      FROM clv_calculations
      WHERE month_order IS NOT NULL
      ORDER BY month_order;
    `;

    // Execute both queries
    const [retentionResult, clvResult] = await Promise.all([
      client.query(retentionQuery, [currency, year]),
      client.query(clvQuery, [currency, year])
    ]);

    // Format categories and data for charts
    const retentionCategories = retentionResult.rows.map(row => row.month.substring(0, 3));
    const retentionData = retentionResult.rows.map(row => parseFloat(row.retention_rate_percent || 0));
    const churnData = retentionResult.rows.map(row => parseFloat(row.churn_rate_percent || 1));

    const clvCategories = clvResult.rows.map(row => row.month.substring(0, 3));
    const clvData = clvResult.rows.map(row => parseFloat(row.clv || 0));
    const purchaseFreqData = clvResult.rows.map(row => parseFloat(row.purchase_frequency || 0));

    console.log('✅ Retention vs Churn and CLV data loaded successfully');
    console.log(`📊 Retention Data: { categories: ${JSON.stringify(retentionCategories)}, dataPoints: ${retentionData.length} }`);
    console.log(`💰 CLV Data: { categories: ${JSON.stringify(clvCategories)}, dataPoints: ${clvData.length} }`);

    res.status(200).json({
      success: true,
      currency,
      year,
      // Chart 1: Retention vs Churn (replacing Deposit Amount Analysis)
      retentionChurnData: {
        categories: retentionCategories,
        retentionData: retentionData,
        churnData: churnData,
        dataPoints: retentionData.length
      },
      // Chart 2: CLV vs Purchase Frequency (replacing New Depositor Growth)
      clvFrequencyData: {
        categories: clvCategories,
        clvData: clvData,
        purchaseFreqData: purchaseFreqData,
        dataPoints: clvData.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Retention/CLV API Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database connection error', 
      message: error.message,
      currency,
      year
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 