const fs = require('fs');

// List of remaining files to fix
const files = [
  'pages/transaction/headcount.js',
  'pages/transaction/member-report.js',
  'pages/transaction/new-depositor.js',
  'pages/transaction/new-register.js'
];

function fixFile(filePath) {
  console.log(`🔧 Fixing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the broken useEffect - replace the entire broken pattern
  content = content.replace(
    /useEffect\(\(\) => \{\s*([^}]+)\s*\}, \[fetchSlicerOptions\(\);\s*([^}]+)\s*\.replace\([^)]+\)\]\);/g,
    'useEffect(() => {\n    $1\n  }, [fetchSlicerOptions, $2]);'
  );
  
  // Fix the second useEffect
  const dataFunction = filePath.includes('headcount') ? 'fetchHeadcountData' :
                      filePath.includes('member-report') ? 'fetchMemberReportData' :
                      filePath.includes('new-depositor') ? 'fetchNewDepositorData' :
                      filePath.includes('new-register') ? 'fetchNewRegisterData' : 'fetchData';
  
  content = content.replace(
    new RegExp(`useEffect\\(\\(\\) => \\{\\s*${dataFunction}\\(\\);\\s*\\}, \\[currency, line, year, month, dateRange, filterMode, pagination\\.currentPage\\]\\);`, 'g'),
    `useEffect(() => {\n    ${dataFunction}();\n  }, [currency, line, year, month, dateRange, filterMode, pagination.currentPage, ${dataFunction}]);`
  );
  
  // Wrap fetchSlicerOptions with useCallback
  content = content.replace(
    /const fetchSlicerOptions = async \(\) => \{([^}]+)\};/g,
    'const fetchSlicerOptions = useCallback(async () => {$1}, [currency, line]);'
  );
  
  // Wrap data function with useCallback
  content = content.replace(
    new RegExp(`const ${dataFunction} = async \\(\\) => \\{([^}]+)\\};`, 'g'),
    `const ${dataFunction} = useCallback(async () => {$1}, [currency, line, year, month, dateRange, filterMode, pagination.currentPage, pagination.recordsPerPage]);`
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${filePath}`);
}

// Fix all files
files.forEach(fixFile);

console.log('🎉 All remaining files fixed!'); 