/**
 * TEST DATABASE STRUCTURE READER
 * Script untuk test automatic database structure detection
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

import { Database } from '../logic/index.js';

async function testDatabaseStructure() {
  console.log('🚀 TESTING DATABASE STRUCTURE READER');
  console.log('═'.repeat(60));

  try {
    // 1. Test database connection
    console.log('\n1. 🔍 Testing Database Connection...');
    const isConnected = await Database.checkConnection();
    
    if (!isConnected) {
      console.log('❌ Database connection failed. Please check:');
      console.log('   - PostgreSQL server is running');
      console.log('   - Database: crm_backend_data exists');
      console.log('   - Username: postgre');
      console.log('   - Password: CRM_Backend');
      return;
    }

    // 2. Get all tables
    console.log('\n2. 📋 Reading All Tables...');
    const tables = await Database.getAllTables();
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   • ${table.tablename} (owner: ${table.tableowner})`);
    });

    // 3. Get complete database structure
    console.log('\n3. 🏗️ Reading Complete Database Structure...');
    const structure = await Database.getDatabaseStructure();
    
    // Display structure
    Database.displayStructure(structure);

    // 4. Generate detailed report
    console.log('\n4. 📊 Generating Database Report...');
    const report = await Database.generateReport();
    
    if (report) {
      console.log('\n📈 DATABASE REPORT SUMMARY:');
      console.log('─'.repeat(40));
      console.log(`Database: ${report.summary.database}`);
      console.log(`Total Tables: ${report.summary.totalTables}`);
      console.log(`Generated: ${new Date(report.summary.timestamp).toLocaleString()}`);
      
      console.log('\n📊 TABLE DETAILS:');
      for (const [tableName, tableInfo] of Object.entries(report.tables)) {
        console.log(`\n  Table: ${tableName}`);
        console.log(`  ├─ Columns: ${tableInfo.columnCount}`);
        console.log(`  ├─ Rows: ${tableInfo.rowCount}`);
        console.log(`  └─ Sample Data: ${tableInfo.sampleData.length} records`);
      }
    }

    // 5. Test specific table
    if (tables.length > 0) {
      const testTable = tables[0].tablename;
      console.log(`\n5. 🔬 Testing Specific Table: ${testTable}`);
      
      const tableStructure = await Database.getTableStructure(testTable);
      console.log(`   Columns (${tableStructure.length}):`);
      tableStructure.forEach(col => {
        console.log(`   • ${col.column_name} - ${col.data_type}`);
      });
      
      const sampleData = await Database.getTableSample(testTable, 2);
      console.log(`   Sample data (${sampleData.length} rows):`);
      console.log('   ', JSON.stringify(sampleData, null, 2));
      
      const rowCount = await Database.getTableCount(testTable);
      console.log(`   Total rows: ${rowCount}`);
    }

    // 6. Check foreign keys
    console.log('\n6. 🔗 Checking Foreign Key Relationships...');
    const foreignKeys = await Database.getForeignKeys();
    if (foreignKeys.length > 0) {
      console.log(`✅ Found ${foreignKeys.length} foreign key relationships:`);
      foreignKeys.forEach(fk => {
        console.log(`   • ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('ℹ️ No foreign key relationships found');
    }

    console.log('\n✅ Database structure reading test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error during database structure test:', error);
  }
}

// Export function for use in other scripts
export { testDatabaseStructure };

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseStructure()
    .then(() => {
      console.log('\n🎉 Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
} 