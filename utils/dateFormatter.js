/**
 * Utility functions for consistent date formatting across all transaction pages
 */

/**
 * Format date to display only date (YYYY-MM-DD) without time
 * @param {string|Date} dateValue - The date value to format
 * @returns {string} - Formatted date string (YYYY-MM-DD) or '-' if invalid
 */
export const formatDateOnly = (dateValue) => {
  if (!dateValue) return '-';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '-';
    
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Format date for display in table (DD/MM/YYYY)
 * @param {string|Date} dateValue - The date value to format
 * @returns {string} - Formatted date string (DD/MM/YYYY) or '-' if invalid
 */
export const formatDateDisplay = (dateValue) => {
  if (!dateValue) return '-';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '-';
    
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '-';
  }
};

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {string|Date} dateValue - The date value to format
 * @returns {string} - Formatted date string for input field or empty string if invalid
 */
export const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    
    // Format as YYYY-MM-DD for input field
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Check if a value is a date column
 * @param {string} columnName - The column name to check
 * @returns {boolean} - True if it's a date column
 */
export const isDateColumn = (columnName) => {
  const dateColumns = ['date', 'created_at', 'updated_at', 'transaction_date', 'created_date', 'modified_date', 'create_date'];
  return dateColumns.includes(columnName.toLowerCase());
};

/**
 * Format table cell value based on column type
 * @param {string} columnName - The column name
 * @param {any} value - The cell value
 * @returns {string} - Formatted value for display
 */
export const formatTableCellValue = (columnName, value) => {
  if (value === null || value === undefined) return '-';
  
  // Format date columns
  if (isDateColumn(columnName)) {
    return formatDateDisplay(value);
  }
  
  // Return string value for other columns
  return String(value);
}; 