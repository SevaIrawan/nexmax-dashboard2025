import { selectData } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currency, line, year, month, startDate, endDate, filterMode, page = 1, limit } = req.query;

  try {
    console.log('📊 Fetching withdraw_daily data with filters:', { currency, line, year, month, startDate, endDate, filterMode, page, limit });

    // Get all data from member_report_daily without limit
    const allData = await selectData('member_report_daily', '*', {}, null);
    
    // Ensure allData is an array
    const dataArray = Array.isArray(allData) ? allData : [];
    
    if (dataArray.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalRecords: 0,
          recordsPerPage: parseInt(limit),
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: { currency, line, year, month, startDate, endDate, filterMode }
      });
    }

    // Filter data based on parameters
    let filteredData = dataArray.filter(row => {
      // Filter by currency (if withdraw_currency exists)
      if (currency && currency !== 'ALL' && row.withdraw_currency && row.withdraw_currency !== currency) {
        return false;
      }
      
      // Filter by line (if line exists)
      if (line && line !== 'ALL' && row.line && row.line !== line) {
        return false;
      }
      
      // Filter by year
      if (year && year !== 'ALL') {
        const rowYear = new Date(row.date).getFullYear();
        if (rowYear !== parseInt(year)) {
          return false;
        }
      }
      
      // Filter by month
      if (month && month !== 'ALL' && filterMode === 'month') {
        const rowMonth = new Date(row.date).getMonth() + 1;
        if (rowMonth !== parseInt(month)) {
          return false;
        }
      }
      
      // Filter by date range
      if (filterMode === 'daterange' && startDate && endDate) {
        const rowDate = new Date(row.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (rowDate < start || rowDate > end) {
          return false;
        }
      }
      
      return true;
    });

    // Sort by date descending
    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply pagination only if limit is specified
    const totalRecords = filteredData.length;
    let paginatedData, pagination;
    
    if (limit && parseInt(limit) > 0) {
      // With pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      paginatedData = filteredData.slice(offset, offset + parseInt(limit));
      pagination = {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / parseInt(limit)),
        totalRecords,
        recordsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < Math.ceil(totalRecords / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      };
      console.log(`✅ Found ${paginatedData.length} records from member_report_daily (Page ${page} of ${Math.ceil(totalRecords / parseInt(limit))})`);
    } else {
      // Without pagination - return all data
      paginatedData = filteredData;
      pagination = {
        currentPage: 1,
        totalPages: 1,
        totalRecords,
        recordsPerPage: totalRecords,
        hasNextPage: false,
        hasPrevPage: false
      };
      console.log(`✅ Found all ${totalRecords} records from member_report_daily (No pagination)`);
    }

    res.status(200).json({
      success: true,
      data: paginatedData,
      pagination,
      filters: {
        currency,
        line,
        year,
        month,
        startDate,
        endDate,
        filterMode
      }
    });

  } catch (error) {
    console.error('❌ Error fetching withdraw data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while fetching data',
      message: error.message 
    });
  }
} 