import { selectData } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { selectedCurrency } = req.query;

  try {
    console.log('🔍 Fetching unique values from member_report_daily for slicers...', { selectedCurrency });

    // Get all data from member_report_daily
    const allData = await selectData('member_report_daily', '*', {});
    
    // Ensure allData is an array
    const dataArray = Array.isArray(allData) ? allData : [];
    
    if (dataArray.length === 0) {
      return res.status(200).json({
        success: true,
        options: {
          currencies: [],
          lines: [],
          years: [],
          months: [],
          dateRange: { min: null, max: null }
        }
      });
    }

    // Extract unique values
    const currencies = [...new Set(dataArray.map(row => row.deposit_currency).filter(Boolean))].sort();
    const lines = [...new Set(dataArray.map(row => row.line).filter(Boolean))].sort();
    
    // Extract years from dates
    const years = [...new Set(dataArray.map(row => new Date(row.date).getFullYear()))].sort((a, b) => b - a).map(String);
    
    // Extract months from dates
    const months = [...new Set(dataArray.map(row => new Date(row.date).getMonth() + 1))].sort().map(month => ({
      value: month.toString(),
      label: new Date(2000, month - 1, 1).toLocaleString('en', { month: 'long' })
    }));

    // Get date range
    const dates = dataArray.map(row => new Date(row.date)).filter(date => !isNaN(date.getTime()));
    const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : null;
    const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;

    // Filter lines based on selected currency
    let filteredLines = lines;
    if (selectedCurrency && selectedCurrency !== 'ALL') {
      filteredLines = [...new Set(
        dataArray
          .filter(row => row.deposit_currency === selectedCurrency)
          .map(row => row.line)
          .filter(Boolean)
      )].sort();
    }

    console.log('✅ Slicer options loaded:', {
      currencies: currencies.length,
      lines: filteredLines.length,
      years: years.length,
      months: months.length,
      dateRange: { min: minDate, max: maxDate },
      selectedCurrency
    });

    res.status(200).json({
      success: true,
      options: {
        currencies,
        lines: filteredLines,
        years,
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