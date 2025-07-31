import pool from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    client = await pool.connect();
    
    // Check if table exists and has data
    const checkQuery = 'SELECT COUNT(*) as count FROM member_report_daily';
    const checkResult = await client.query(checkQuery);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      return res.status(200).json({
        success: true,
        message: 'Table already has data'
      });
    }

    // Sample data for member_report_daily
    const sampleData = [
      {
        date: '2025-07-01',
        currency: 'MYR',
        line: 'FWMY',
        year: 2025,
        month: 7,
        active_member: 150,
        new_register: 25,
        new_depositor: 18,
        deposit_cases: 45,
        deposit_amount: 12500.50,
        withdraw_cases: 12,
        withdraw_amount: 3500.25,
        cases_adjustment: 3,
        add_bonus: 250.00,
        deduct_bonus: 0,
        add_transaction: 500.00
      },
      {
        date: '2025-07-02',
        currency: 'MYR',
        line: 'FWMY',
        year: 2025,
        month: 7,
        active_member: 165,
        new_register: 30,
        new_depositor: 22,
        deposit_cases: 52,
        deposit_amount: 15800.75,
        withdraw_cases: 15,
        withdraw_amount: 4200.50,
        cases_adjustment: 2,
        add_bonus: 300.00,
        deduct_bonus: 50.00,
        add_transaction: 600.00
      },
      {
        date: '2025-07-03',
        currency: 'MYR',
        line: 'FWMY',
        year: 2025,
        month: 7,
        active_member: 180,
        new_register: 35,
        new_depositor: 28,
        deposit_cases: 60,
        deposit_amount: 18200.25,
        withdraw_cases: 18,
        withdraw_amount: 4800.75,
        cases_adjustment: 4,
        add_bonus: 350.00,
        deduct_bonus: 75.00,
        add_transaction: 700.00
      }
    ];

    // Insert sample data
    for (const data of sampleData) {
      const insertQuery = `
        INSERT INTO member_report_daily (
          date, currency, line, year, month, 
          active_member, new_register, new_depositor,
          deposit_cases, deposit_amount, withdraw_cases, withdraw_amount,
          cases_adjustment, add_bonus, deduct_bonus, add_transaction
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;
      
      const values = [
        data.date, data.currency, data.line, data.year, data.month,
        data.active_member, data.new_register, data.new_depositor,
        data.deposit_cases, data.deposit_amount, data.withdraw_cases, data.withdraw_amount,
        data.cases_adjustment, data.add_bonus, data.deduct_bonus, data.add_transaction
      ];
      
      await client.query(insertQuery, values);
    }

    console.log('✅ Sample data added to member_report_daily');

    res.status(200).json({
      success: true,
      message: 'Sample data added successfully',
      recordsAdded: sampleData.length
    });

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while adding sample data',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 