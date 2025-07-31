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
    console.log('📊 Exporting headcountdep data to Excel with filters:', { month, startDate, endDate, useDateRange });

    // First, get table structure to build dynamic query
    const structureQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'headcountdep' 
      ORDER BY ordinal_position
    `;
    
    const structureResult = await client.query(structureQuery);
    const columns = structureResult.rows.map(row => row.column_name);
    
    console.log('📋 Table columns for export:', columns);

    // Build dynamic SELECT query
    let selectFields = columns.map(col => {
      if (col === 'date') {
        return 'DATE(date) as date';
      }
      return col;
    }).join(', ');

    // Base query with dynamic columns
    let query = `SELECT ${selectFields} FROM headcountdep WHERE 1=1`;
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Headcount Data');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // Create filename with timestamp and filters
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
    const filterSuffix = [
      year && year !== 'ALL' ? year : '',
      currency && currency !== 'ALL' ? currency : '',
      month && month !== 'ALL' ? `Month${month}` : ''
    ].filter(Boolean).join('_');
    
    const filename = `Headcount_Data_${timestamp}${filterSuffix ? '_' + filterSuffix : ''}.xlsx`;

    console.log(`✅ Excel file generated: ${filename} with ${result.rows.length} records`);

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);

    // Send the Excel file
    res.status(200).send(excelBuffer);

  } catch (error) {
    console.error('❌ Error exporting headcountdep data:', error);
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