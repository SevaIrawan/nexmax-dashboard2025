// import { calculateKPIs } from '../../lib/business-logic';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { currency = 'MYR', year = '2025', month = 'July' } = req.query;

  console.log(`🎯 Strategic Executive KPI: ${currency} ${year} ${month}`);

  try {
    // TEMPORARY: Use fast dummy data instead of centralized logic
    console.log('✅ Strategic Executive KPI from FAST DUMMY DATA');
    
    res.status(200).json({
      netProfit: 693053.48,
      netProfitChange: -24.8,
      ggrUser: 141.41,
      ggrUserChange: -13.4,
      activeMember: 4901,
      activeMemberChange: -13.2,
      pureMember: 3540,
      pureMemberChange: -10.4,
      headcount: 48,
      headcountChange: 0
    });

  } catch (error) {
    console.error('❌ Strategic Executive KPI Error:', error);
    
    // Fallback data
    res.status(200).json({
      netProfit: 693053.48,
      netProfitChange: -24.8,
      ggrUser: 141.41,
      ggrUserChange: -13.4,
      activeMember: 4901,
      activeMemberChange: -13.2,
      pureMember: 3540,
      pureMemberChange: -10.4,
      headcount: 48,
      headcountChange: 0
    });
  }
} 