import pool from '../../../lib/database';
import * as XLSX from 'xlsx';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { month, startDate, endDate, useDateRange } = req.body;
  let client;

  try {
    client = await pool.connect();
    console.log('📊 Exporting exchange_rate data to Excel with filters:', { month, startDate, endDate, useDateRange });

    // Base query - same as data.js
    let query = `SELECT * FROM exchange_rate WHERE 1=1`;
    let params = [];
    let paramCount = 0;

    // Add filters based on selections
    if (month && month !== 'ALL' && useDateRange !== 'true') {
      paramCount++;
      query += ` AND EXTRACT(MONTH FROM date) = $${paramCount}`;
      params.push(parseInt(month));
    }

    if (useDateRange === 'true' && startDate && endDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
      
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    // Order by date descending with improved sorting
    query += ` ORDER BY date DESC`;

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exchange Daily');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // Create filename with timestamp and filters
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
    const filterSuffix = [
      month && month !== 'ALL' ? `Month${month}` : '',
      useDateRange === 'true' && startDate && endDate ? `${startDate}_${endDate}` : ''
    ].filter(Boolean).join('_');
    
    const filename = `Exchange_Rate_${timestamp}${filterSuffix ? '_' + filterSuffix : ''}.xlsx`;

    console.log(`✅ Excel file generated: ${filename} with ${result.rows.length} records`);

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);

    // Send the Excel file
    res.status(200).send(excelBuffer);

  } catch (error) {
    console.error('❌ Error exporting exchange_daily data:', error);
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