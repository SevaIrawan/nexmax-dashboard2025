import fs from 'fs';
import path from 'path';

const apiFiles = [
  'pages/api/deposit/slicer-options.js',
  'pages/api/withdraw/data.js',
  'pages/api/withdraw/slicer-options.js',
  'pages/api/exchange/data.js',
  'pages/api/exchange/slicer-options.js',
  'pages/api/headcount/data.js',
  'pages/api/headcount/slicer-options.js'
];

function fixApiFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the problematic pattern
    let fixedContent = content;
    
    // Fix the selectData result handling
    fixedContent = fixedContent.replace(
      /const allData = await selectData\([^)]+\);\s*\n\s*if \(!allData \|\| allData\.length === 0\)/g,
      'const allData = await selectData($1);\n    \n    // Ensure allData is an array\n    const dataArray = Array.isArray(allData) ? allData : [];\n    \n    if (dataArray.length === 0)'
    );
    
    // Fix the filter usage
    fixedContent = fixedContent.replace(
      /let filteredData = allData\.filter/g,
      'let filteredData = dataArray.filter'
    );
    
    // Fix the length usage
    fixedContent = fixedContent.replace(
      /allData\.length/g,
      'dataArray.length'
    );
    
    // Fix the map usage
    fixedContent = fixedContent.replace(
      /allData\.map/g,
      'dataArray.map'
    );
    
    // Fix the Set usage
    fixedContent = fixedContent.replace(
      /\[\.\.\.new Set\(allData\.map/g,
      '[...new Set(dataArray.map'
    );
    
    // Fix the dates usage
    fixedContent = fixedContent.replace(
      /const dates = allData\.map/g,
      'const dates = dataArray.map'
    );
    
    // Fix the min/max usage
    fixedContent = fixedContent.replace(
      /const minDate = dates\.length > 0 \? new Date\(Math\.min\(\.\.\.dates\)\) : null;\s*const maxDate = dates\.length > 0 \? new Date\(Math\.max\(\.\.\.dates\)\) : null;/g,
      'const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : null;\n    const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;'
    );
    
    // Fix the filter usage in slicer options
    fixedContent = fixedContent.replace(
      /allData\s*\.filter\(row => row\./g,
      'dataArray.filter(row => row.'
    );
    
    // Fix the map usage in slicer options
    fixedContent = fixedContent.replace(
      /\.map\(row => row\./g,
      '.map(row => row.'
    );
    
    // Write the fixed content back
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing all API endpoints...\n');

apiFiles.forEach(fixApiFile);

console.log('\n🎉 All API endpoints have been fixed!'); 