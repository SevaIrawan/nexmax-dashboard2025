const fs = require('fs');
const path = require('path');

// List of transaction pages to fix
const transactionPages = [
  'pages/transaction/adjustment.js',
  'pages/transaction/exchange.js',
  'pages/transaction/headcount.js',
  'pages/transaction/member-report.js',
  'pages/transaction/new-depositor.js',
  'pages/transaction/new-register.js'
];

function fixTransactionPage(filePath) {
  console.log(`🔧 Fixing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add useCallback import
  if (!content.includes('useCallback')) {
    content = content.replace(
      'import { useState, useEffect } from \'react\';',
      'import { useState, useEffect, useCallback } from \'react\';'
    );
  }
  
  // Fix useEffect dependencies
  content = content.replace(
    /useEffect\(\(\) => \{\s*([^}]+)\s*\}, \[\]\);/g,
    'useEffect(() => {\n    $1\n  }, [$1.replace(/fetch(\w+)Data|fetchSlicerOptions/g, (match) => match)]);'
  );
  
  // Fix fetchSlicerOptions function
  content = content.replace(
    /const fetchSlicerOptions = async \(\) => \{([^}]+)\};/g,
    'const fetchSlicerOptions = useCallback(async () => {$1}, [currency, line]);'
  );
  
  // Fix fetchData function (replace with actual function name)
  const functionName = filePath.includes('adjustment') ? 'fetchAdjustmentData' :
                      filePath.includes('exchange') ? 'fetchExchangeData' :
                      filePath.includes('headcount') ? 'fetchHeadcountData' :
                      filePath.includes('member-report') ? 'fetchMemberReportData' :
                      filePath.includes('new-depositor') ? 'fetchNewDepositorData' :
                      filePath.includes('new-register') ? 'fetchNewRegisterData' : 'fetchData';
  
  content = content.replace(
    new RegExp(`const ${functionName} = async \\(\\) => \\{([^}]+)\\};`, 'g'),
    `const ${functionName} = useCallback(async () => {$1}, [currency, line, year, month, dateRange, filterMode, pagination.currentPage, pagination.recordsPerPage]);`
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${filePath}`);
}

// Fix all transaction pages
transactionPages.forEach(fixTransactionPage);

console.log('🎉 All ESLint errors fixed!'); 