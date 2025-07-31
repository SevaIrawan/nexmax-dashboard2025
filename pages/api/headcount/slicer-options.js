import { selectData } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Fetching unique values from headcountdep for slicers...');

    // Get all data from headcountdep
    const allData = await selectData('headcountdep', '*', {});
    
    // Ensure allData is an array
    const dataArray = Array.isArray(allData) ? allData : [];
    
    if (dataArray.length === 0) {
      return res.status(200).json({
        success: true,
        options: {
          months: [],
          dateRange: { min: null, max: null }
        }
      });
    }

    // Extract months from dates
    const months = [...new Set(dataArray.map(row => new Date(row.date).getMonth() + 1))].sort().map(month => ({
      value: month.toString(),
      label: new Date(2000, month - 1, 1).toLocaleString('en', { month: 'long' })
    }));

    // Get date range
    const dates = dataArray.map(row => new Date(row.date)).filter(date => !isNaN(date.getTime()));
    const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : null;
    const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;

    console.log('✅ Slicer options loaded:', {
      months: months.length,
      dateRange: { min: minDate, max: maxDate }
    });

    res.status(200).json({
      success: true,
      options: {
        months,
        dateRange: {
          min: minDate,
          max: maxDate
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
  }
} 