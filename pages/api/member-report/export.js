import pool from '../../../lib/database';
import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currency, line, year, month, startDate, endDate, filterMode } = req.body;
  let client;

  try {
    client = await pool.connect();
    console.log('📊 Exporting member_report_daily data with filters:', { currency, line, year, month, startDate, endDate, filterMode });

    // Base query
    let query = `SELECT * FROM member_report_daily WHERE 1=1`;
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

    console.log(`✅ Exporting ${result.rows.length} records from member_report_daily`);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Member Report Data');

    // Add headers
    if (result.rows.length > 0) {
      const headers = Object.keys(result.rows[0]);
      worksheet.addRow(headers.map(header => header.replace(/_/g, ' ').toUpperCase()));
      
      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    }

    // Add data rows
    result.rows.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(
        column.header ? column.header.length : 10,
        ...column.values.map(v => v ? v.toString().length : 0)
      );
    });

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `member_report_export_${timestamp}.xlsx`;

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('❌ Error exporting member_report_daily data:', error);
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