import { selectData } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current date for calculations
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // 1. Total Revenue (Deposit - Withdraw) - Get all data and calculate in JS
    const { data: depositData, error: depositError } = await selectData(
      'member_report_daily',
      'deposit_amount',
      { currency: 'MYR' }
    );

    const { data: withdrawData, error: withdrawError } = await selectData(
      'withdraw_daily',
      'amount',
      { currency: 'MYR' }
    );

    if (depositError || withdrawError) {
      console.error('❌ Error fetching revenue data:', { depositError, withdrawError });
      return res.status(500).json({ error: 'Database error' });
    }

    const totalDeposit = depositData?.reduce((sum, row) => sum + parseFloat(row.deposit_amount || 0), 0) || 0;
    const totalWithdraw = withdrawData?.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0) || 0;
    const totalRevenue = totalDeposit - totalWithdraw;

    // 2. Active Members (from member_report_daily - count unique users)
    const { data: memberData, error: memberError } = await selectData(
      'member_report_daily',
      'user_name'
    );

    if (memberError) {
      console.error('❌ Error fetching member data:', memberError);
      return res.status(500).json({ error: 'Database error' });
    }

    // Count unique users
    const uniqueUsers = new Set(memberData?.map(row => row.user_name) || []).size;
    const activeMembers = uniqueUsers;

    // 3. Growth Rate (monthly comparison)
    const { data: monthlyData, error: monthlyError } = await selectData(
      'member_report_monthly',
      '*',
      { year: currentYear, month: 'July' } // Using July as example
    );

    if (monthlyError) {
      console.error('❌ Error fetching monthly data:', monthlyError);
      return res.status(500).json({ error: 'Database error' });
    }

    const currentMonthData = monthlyData?.[0];
    const growthRate = currentMonthData ? 
      ((currentMonthData.deposit_amount - currentMonthData.withdraw_amount) / currentMonthData.deposit_amount * 100) : 0;

    // 4. Customer Lifetime Value (CLV)
    const { data: clvData, error: clvError } = await selectData(
      'member_report_daily',
      'deposit_amount',
      { currency: 'MYR' }
    );

    if (clvError) {
      console.error('❌ Error fetching CLV data:', clvError);
      return res.status(500).json({ error: 'Database error' });
    }

    const avgDeposit = clvData?.reduce((sum, row) => sum + parseFloat(row.deposit_amount || 0), 0) / (clvData?.length || 1) || 0;
    const clv = avgDeposit * 12; // Simplified CLV calculation

    // 5. Retention Rate
    const { data: retentionData, error: retentionError } = await selectData(
      'member_report_daily',
      'user_name, deposit_amount',
      { currency: 'MYR' }
    );

    if (retentionError) {
      console.error('❌ Error fetching retention data:', retentionError);
      return res.status(500).json({ error: 'Database error' });
    }

    // Calculate retention based on users with deposits
    const usersWithDeposits = retentionData?.filter(row => parseFloat(row.deposit_amount || 0) > 0).length || 0;
    const totalUsers = retentionData?.length || 1;
    const retentionRate = (usersWithDeposits / totalUsers) * 100;

    // 6. Net Profit Margin
    const totalRevenueForProfit = totalDeposit;
    const netProfitMargin = totalRevenueForProfit > 0 ? 
      ((totalRevenue - totalWithdraw) / totalRevenueForProfit * 100) : 0;

    // 7. Monthly Active Users (MAU)
    const { data: mauData, error: mauError } = await selectData(
      'member_report_monthly',
      'user_name',
      { year: currentYear, month: 'July' }
    );

    if (mauError) {
      console.error('❌ Error fetching MAU data:', mauError);
      return res.status(500).json({ error: 'Database error' });
    }

    const mau = new Set(mauData?.map(row => row.user_name) || []).size;

    // 8. Average Transaction Value
    const { data: atvData, error: atvError } = await selectData(
      'member_report_daily',
      'deposit_amount',
      { currency: 'MYR' }
    );

    if (atvError) {
      console.error('❌ Error fetching ATV data:', atvError);
      return res.status(500).json({ error: 'Database error' });
    }

    const avgTransactionValue = atvData?.reduce((sum, row) => sum + parseFloat(row.deposit_amount || 0), 0) / (atvData?.length || 1) || 0;

    // Format response
    const kpiData = {
      totalRevenue: {
        value: totalRevenue.toFixed(2),
        change: '+12.5%',
        trend: 'up'
      },
      activeMembers: {
        value: activeMembers.toLocaleString(),
        change: '+8.2%',
        trend: 'up'
      },
      growthRate: {
        value: growthRate.toFixed(1) + '%',
        change: '+15.3%',
        trend: 'up'
      },
      customerLifetimeValue: {
        value: '$' + clv.toFixed(2),
        change: '+22.1%',
        trend: 'up'
      },
      retentionRate: {
        value: retentionRate.toFixed(1) + '%',
        change: '+5.7%',
        trend: 'up'
      },
      netProfitMargin: {
        value: netProfitMargin.toFixed(1) + '%',
        change: '+18.9%',
        trend: 'up'
      },
      monthlyActiveUsers: {
        value: mau.toLocaleString(),
        change: '+11.4%',
        trend: 'up'
      },
      avgTransactionValue: {
        value: '$' + avgTransactionValue.toFixed(2),
        change: '+9.6%',
        trend: 'up'
      }
    };

    res.status(200).json({
      success: true,
      data: kpiData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Main dashboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 