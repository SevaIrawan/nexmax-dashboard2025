import pool from '../../lib/database';

export default async function handler(req, res) {
  const { currency = 'MYR',month = 'May' } = req.query;
  
  try {
    console.log(`📊 Fetching REAL data from member_report_monthly for ${currency} ${month}`);
    
    // Net Profit dari member_report_monthly
    const netProfitResult = await pool.query(
      `SELECT SUM(net_profit) AS net_profit
       FROM member_report_monthly
       WHERE Currency = $1 AND Month = $2`,
      [currency, month]
    );

    // Active Member DBQ - count unique users
    const activeMemberResult = await pool.query(
      `SELECT COUNT(DISTINCT user_name) AS active_member_dbq
       FROM member_report_monthly
       WHERE Currency = $1 AND Month = $2 AND deposit_amount > 0`,
       [currency, month]
    );

    // Active Member Unique Code DBQ - count unique codes
    const uniqueCodeResult = await pool.query(
      `SELECT COUNT(DISTINCT unique_code) AS active_member_unique_code_dbq
       FROM member_report_monthly
       WHERE Currency = $1 AND Month = $2 AND deposit_amount > 0`,
       [currency, month]
    );

    // Net Profit Last DBQ - average net profit
    const netProfitLastResult = await pool.query(
      `SELECT AVG(net_profit) AS net_profit_last_dbq
       FROM member_report_monthly
       WHERE Currency = $1 AND Month = $2`,
       [currency, month]
    );

    // Get real data values
    const netProfit = parseFloat(netProfitResult.rows[0]?.net_profit || 0);
    const activeMemberDbq = parseInt(activeMemberResult.rows[0]?.active_member_dbq || 0);
    const activeMemberUniqueCodeDbq = parseInt(uniqueCodeResult.rows[0]?.active_member_unique_code_dbq || 0);
    const netProfitLastDbq = parseFloat(netProfitLastResult.rows[0]?.net_profit_last_dbq || 0);

    console.log(`✅ REAL DATA: Net Profit: ${netProfit}, Active Member: ${activeMemberDbq}, Unique Code: ${activeMemberUniqueCodeDbq}, Last DBQ: ${netProfitLastDbq}`);

    res.status(200).json({
      net_profit: netProfit,
      active_member_dbq: activeMemberDbq,
      active_member_unique_code_dbq: activeMemberUniqueCodeDbq,
      net_profit_last_dbq: netProfitLastDbq,
      status: 'success',
      source: 'member_report_monthly',
      filters: { currency, month },
      debug: {
        net_profit_raw: netProfitResult.rows[0],
        active_member_raw: activeMemberResult.rows[0],
        unique_code_raw: uniqueCodeResult.rows[0],
        last_dbq_raw: netProfitLastResult.rows[0]
      }
    });

  } catch (error) {
    console.error('❌ Dashboard API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      month,
      currency
    });
    
    res.status(500).json({ 
      error: 'Database connection error', 
      message: error.message,
      source: 'member_report_monthly',
      filters: { currency, month }
    });
  }
}