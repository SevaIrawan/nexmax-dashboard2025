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
    console.log('📊 Exporting adjusment_daily data with filters:', { currency, line, year, month, startDate, endDate, filterMode });

    // Base query
    let query = `SELECT * FROM adjusment_daily WHERE 1=1`;
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

    query += ` ORDER BY date DESC, year DESC, month DESC`;

    console.log('🔍 Executing export query:', query);
    console.log('📋 With parameters:', params);

    const result = await client.query(query, params);

    console.log(`✅ Exporting ${result.rows.length} records from adjusment_daily`);

    // Create Excel workbook using xlsx
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(result.rows);

    // Add headers if data exists
    if (result.rows.length > 0) {
      const headers = Object.keys(result.rows[0]).map(header => 
        header.replace(/_/g, ' ').toUpperCase()
      );
      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Adjustment Data');

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `adjustment_export_${timestamp}.xlsx`;

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Write to buffer and send
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);

  } catch (error) {
    console.error('❌ Error exporting adjusment_daily data:', error);
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