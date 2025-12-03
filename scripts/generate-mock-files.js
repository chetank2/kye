import * as XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = join(__dirname, '..', 'public', 'mock-data');

// Ensure output directory exists
import { mkdirSync } from 'fs';
try {
    mkdirSync(outputDir, { recursive: true });
} catch (e) {
    // Directory might already exist
}

// Helper function to create Excel file
function createExcelFile(filename, data, headers) {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    const filePath = join(outputDir, filename);
    XLSX.writeFile(workbook, filePath);
    console.log(`Created: ${filename}`);
}

// File 1: Sales Data (Q1 2024)
const salesHeaders = ['Date', 'Product', 'Amount', 'Quantity', 'Region'];
const salesData = [
    ['2024-01-15', 'Widget A', 1250.50, 25, 'North'],
    ['2024-01-20', 'Widget B', 890.25, 15, 'South'],
    ['2024-02-05', 'Widget A', 1500.00, 30, 'East'],
    ['2024-02-12', 'Widget C', 2100.75, 35, 'West'],
    ['2024-02-28', 'Widget B', 1100.00, 20, 'North'],
    ['2024-03-10', 'Widget A', 1750.25, 35, 'South'],
    ['2024-03-22', 'Widget C', 1950.50, 32, 'East'],
    ['2024-03-30', 'Widget B', 950.75, 18, 'West'],
];
createExcelFile('sales-q1-2024.xlsx', salesData, salesHeaders);

// File 2: Sales Data (Q2 2024) - Same headers as File 1
const salesQ2Data = [
    ['2024-04-10', 'Widget A', 1320.00, 26, 'North'],
    ['2024-04-18', 'Widget B', 920.50, 16, 'South'],
    ['2024-05-05', 'Widget A', 1600.25, 32, 'East'],
    ['2024-05-15', 'Widget C', 2250.00, 38, 'West'],
    ['2024-05-28', 'Widget B', 1150.75, 21, 'North'],
    ['2024-06-12', 'Widget A', 1800.50, 36, 'South'],
    ['2024-06-25', 'Widget C', 2100.25, 34, 'East'],
];
createExcelFile('sales-q2-2024.xlsx', salesQ2Data, salesHeaders);

// File 3: Transactions - Different header names (for mapping test)
const transactionsHeaders = ['Transaction Date', 'Item Name', 'Total Price', 'Units Sold', 'Location'];
const transactionsData = [
    ['2024-01-10', 'Gadget X', 2340.00, 45, 'Store A'],
    ['2024-01-25', 'Gadget Y', 1890.50, 38, 'Store B'],
    ['2024-02-08', 'Gadget X', 2560.25, 50, 'Store C'],
    ['2024-02-20', 'Gadget Z', 3200.75, 60, 'Store A'],
    ['2024-03-05', 'Gadget Y', 2100.00, 42, 'Store B'],
    ['2024-03-18', 'Gadget X', 2800.50, 55, 'Store C'],
];
createExcelFile('transactions-2024.xlsx', transactionsData, transactionsHeaders);

// File 4: Customer Data - Unique headers
const customerHeaders = ['Customer ID', 'Full Name', 'Email', 'Registration Date', 'Status', 'Total Orders'];
const customerData = [
    ['CUST001', 'John Doe', 'john.doe@email.com', '2023-05-15', 'Active', 12],
    ['CUST002', 'Jane Smith', 'jane.smith@email.com', '2023-06-20', 'Active', 8],
    ['CUST003', 'Bob Johnson', 'bob.johnson@email.com', '2023-07-10', 'Inactive', 3],
    ['CUST004', 'Alice Williams', 'alice.williams@email.com', '2023-08-05', 'Active', 15],
    ['CUST005', 'Charlie Brown', 'charlie.brown@email.com', '2023-09-12', 'Active', 9],
    ['CUST006', 'Diana Prince', 'diana.prince@email.com', '2023-10-22', 'Active', 20],
];
createExcelFile('customers-2024.xlsx', customerData, customerHeaders);

// File 5: Product Inventory - Different structure
const inventoryHeaders = ['Product Code', 'Product Name', 'Stock Quantity', 'Unit Price', 'Category', 'Supplier'];
const inventoryData = [
    ['PROD001', 'Widget A', 150, 50.00, 'Electronics', 'Supplier X'],
    ['PROD002', 'Widget B', 200, 45.50, 'Electronics', 'Supplier Y'],
    ['PROD003', 'Widget C', 75, 60.00, 'Electronics', 'Supplier X'],
    ['PROD004', 'Gadget X', 120, 52.00, 'Gadgets', 'Supplier Z'],
    ['PROD005', 'Gadget Y', 180, 49.75, 'Gadgets', 'Supplier Y'],
    ['PROD006', 'Gadget Z', 90, 53.25, 'Gadgets', 'Supplier Z'],
];
createExcelFile('inventory-2024.xlsx', inventoryData, inventoryHeaders);

// File 6: Financial Report - Similar to sales but with different date format
const financialHeaders = ['Month', 'Revenue', 'Expenses', 'Profit', 'Department'];
const financialData = [
    ['January 2024', 45000, 32000, 13000, 'Sales'],
    ['February 2024', 52000, 35000, 17000, 'Sales'],
    ['March 2024', 48000, 33000, 15000, 'Sales'],
    ['April 2024', 51000, 34000, 17000, 'Sales'],
    ['May 2024', 55000, 36000, 19000, 'Sales'],
    ['June 2024', 53000, 35000, 18000, 'Sales'],
];
createExcelFile('financial-report-2024.xlsx', financialData, financialHeaders);

// File 7: Orders - Mix of common and unique headers
const ordersHeaders = ['Order ID', 'Date', 'Customer', 'Product', 'Amount', 'Status'];
const ordersData = [
    ['ORD001', '2024-01-05', 'John Doe', 'Widget A', 1250.50, 'Completed'],
    ['ORD002', '2024-01-12', 'Jane Smith', 'Widget B', 890.25, 'Completed'],
    ['ORD003', '2024-01-20', 'Bob Johnson', 'Widget C', 2100.75, 'Pending'],
    ['ORD004', '2024-02-03', 'Alice Williams', 'Widget A', 1500.00, 'Completed'],
    ['ORD005', '2024-02-15', 'Charlie Brown', 'Widget B', 1100.00, 'Shipped'],
    ['ORD006', '2024-03-01', 'Diana Prince', 'Widget C', 1950.50, 'Completed'],
];
createExcelFile('orders-2024.xlsx', ordersData, ordersHeaders);

console.log(`\n✅ Generated ${7} mock Excel files in ${outputDir}`);
console.log('\nFiles created:');
console.log('  - sales-q1-2024.xlsx (Date, Product, Amount, Quantity, Region)');
console.log('  - sales-q2-2024.xlsx (Same headers as Q1 - for common header test)');
console.log('  - transactions-2024.xlsx (Different header names - for mapping test)');
console.log('  - customers-2024.xlsx (Unique headers)');
console.log('  - inventory-2024.xlsx (Product inventory data)');
console.log('  - financial-report-2024.xlsx (Financial data)');
console.log('  - orders-2024.xlsx (Order data with mix of headers)');

