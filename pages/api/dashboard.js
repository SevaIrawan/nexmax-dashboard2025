import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crm_backend_data',
  password: 'CRM_Backend',
  port: 5432,
});

export default async function handler(req, res) {
  const { month = 'May', currency = 'MYR' } = req.query;
  
  try {
    console.log(`📊 Fetching REAL data from member_report_monthly for ${month} ${currency}`);
    
    // Net Profit dari member_report_monthly
    const netProfitResult = await pool.query(
      `SELECT SUM(net_profit) AS net_profit
       FROM member_report_monthly
       WHERE month = $1 AND currency = $2`,
      [month, currency]
    );

    // Active Member DBQ - count unique users
    const activeMemberResult = await pool.query(
      `SELECT COUNT(DISTINCT user_name) AS active_member_dbq
       FROM member_report_monthly
       WHERE month = $1 AND currency = $2 AND deposit_amount > 0`,
      [month, currency]
    );

    // Active Member Unique Code DBQ - count unique codes
    const uniqueCodeResult = await pool.query(
      `SELECT COUNT(DISTINCT unique_code) AS active_member_unique_code_dbq
       FROM member_report_monthly
       WHERE month = $1 AND currency = $2 AND deposit_amount > 0`,
      [month, currency]
    );

    // Net Profit Last DBQ - average net profit
    const netProfitLastResult = await pool.query(
      `SELECT AVG(net_profit) AS net_profit_last_dbq
       FROM member_report_monthly
       WHERE month = $1 AND currency = $2`,
      [month, currency]
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
      filters: { month, currency },
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
      filters: { month, currency }
    });
  }
}