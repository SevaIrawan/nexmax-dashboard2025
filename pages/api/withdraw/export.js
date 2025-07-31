import pool from '../../../lib/database';
import * as XLSX from 'xlsx';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currency, line, year, month, startDate, endDate, filterMode } = req.body;
  let client;

  try {
    client = await pool.connect();
    console.log('📊 Exporting withdraw_daily data to Excel with filters:', { currency, line, year, month, startDate, endDate, filterMode });

    // Base query - same as data.js
    let query = `SELECT * FROM withdraw_daily WHERE 1=1`;
    let params = [];
    let paramCount = 0;

    // Add filters based on selections
    if (currency && currency !== 'ALL') {
      paramCount++;
      query += ` AND currency = $${paramCount}`;
      params.push(currency);
    }

    if (line && line !== 'ALL') {
      paramCount++;
      query += ` AND line = $${paramCount}`;
      params.push(line);
    }

    if (year && year !== 'ALL') {
      paramCount++;
      query += ` AND EXTRACT(YEAR FROM date) = $${paramCount}`;
      params.push(parseInt(year));
    }

    // Handle month vs date range filtering
    if (filterMode === 'month' && month && month !== 'ALL') {
      paramCount++;
      query += ` AND EXTRACT(MONTH FROM date) = $${paramCount}`;
      params.push(parseInt(month));
    } else if (filterMode === 'daterange' && startDate && endDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
      
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    // Order by date descending with improved sorting
    query += ` ORDER BY date DESC, year DESC, month DESC`;

    console.log('🔍 Executing export query:', query);
    const result = await client.query(query, params);

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No data found for the selected filters'
      });
    }

    // Create Excel workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(result.rows);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Withdraw Daily');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // Create filename with timestamp and filters
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
    const filterSuffix = [
      currency && currency !== 'ALL' ? currency : '',
      line && line !== 'ALL' ? line : '',
      year && year !== 'ALL' ? year : '',
      filterMode === 'month' && month && month !== 'ALL' ? `Month${month}` : '',
      filterMode === 'daterange' && startDate && endDate ? `${startDate}_${endDate}` : ''
    ].filter(Boolean).join('_');
    
    const filename = `withdraw_Daily_${timestamp}${filterSuffix ? '_' + filterSuffix : ''}.xlsx`;

    console.log(`✅ Excel file generated: ${filename} with ${result.rows.length} records`);

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);

    // Send the Excel file
    res.status(200).send(excelBuffer);

  } catch (error) {
    console.error('❌ Error exporting withdraw_daily data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error while exporting data',
      message: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
} 