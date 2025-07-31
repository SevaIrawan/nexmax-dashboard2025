const fs = require('fs');

// List of files to fix
const files = [
  'pages/transaction/headcount.js',
  'pages/transaction/new-depositor.js',
  'pages/transaction/new-register.js'
];

function fixFile(filePath) {
  console.log(`🔧 Fixing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the broken useEffect pattern
  content = content.replace(
    /useEffect\(\(\) => \{\s*([^}]+)\s*\}, \[fetchSlicerOptions\(\);\s*([^}]+)\s*\.replace\([^)]+\)\]\);/g,
    'useEffect(() => {\n    $1\n  }, [fetchSlicerOptions, $2]);'
  );
  
  // Fix the second useEffect for data function
  const dataFunction = filePath.includes('headcount') ? 'fetchHeadcountData' :
                      filePath.includes('new-depositor') ? 'fetchNewDepositorData' :
                      filePath.includes('new-register') ? 'fetchNewRegisterData' : 'fetchData';
  
  content = content.replace(
    new RegExp(`useEffect\\(\\(\\) => \\{\\s*${dataFunction}\\(\\);\\s*\\}, \\[month, dateRange, useDateRange, pagination\\.currentPage\\]\\);`, 'g'),
    `useEffect(() => {\n    ${dataFunction}();\n  }, [month, dateRange, useDateRange, pagination.currentPage, ${dataFunction}]);`
  );
  
  // Wrap fetchSlicerOptions with useCallback
  content = content.replace(
    /const fetchSlicerOptions = async \(\) => \{([^}]+)\};/g,
    'const fetchSlicerOptions = useCallback(async () => {$1}, []);'
  );
  
  // Wrap data function with useCallback
  content = content.replace(
    new RegExp(`const ${dataFunction} = async \\(\\) => \\{([^}]+)\\};`, 'g'),
    `const ${dataFunction} = useCallback(async () => {$1}, [month, dateRange, useDateRange, pagination.currentPage, pagination.recordsPerPage]);`
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${filePath}`);
}

// Fix all files
files.forEach(fixFile);

console.log('🎉 All syntax errors fixed!'); 