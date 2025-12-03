# Mock Excel Files for Testing

This directory contains mock Excel (.xlsx) files for testing the KYE Data Analysis Workspace application.

## Files Overview

### 1. `sales-q1-2024.xlsx`
**Headers:** `Date`, `Product`, `Amount`, `Quantity`, `Region`
- **Purpose:** Test common header detection
- **Data:** Q1 2024 sales data (8 rows)
- **Use Case:** Upload together with `sales-q2-2024.xlsx` to test automatic common header detection

### 2. `sales-q2-2024.xlsx`
**Headers:** `Date`, `Product`, `Amount`, `Quantity`, `Region` (same as Q1)
- **Purpose:** Test common header detection with identical headers
- **Data:** Q2 2024 sales data (7 rows)
- **Use Case:** Upload with `sales-q1-2024.xlsx` - all headers should be detected as common

### 3. `transactions-2024.xlsx`
**Headers:** `Transaction Date`, `Item Name`, `Total Price`, `Units Sold`, `Location`
- **Purpose:** Test manual header mapping functionality
- **Data:** Transaction records (6 rows)
- **Use Case:** Upload with sales files to test mapping:
  - `Transaction Date` → `Date`
  - `Item Name` → `Product`
  - `Total Price` → `Amount`
  - `Units Sold` → `Quantity`
  - `Location` → `Region`

### 4. `customers-2024.xlsx`
**Headers:** `Customer ID`, `Full Name`, `Email`, `Registration Date`, `Status`, `Total Orders`
- **Purpose:** Test files with completely unique headers
- **Data:** Customer information (6 rows)
- **Use Case:** Upload alone or with other files to test "no common headers" scenario

### 5. `inventory-2024.xlsx`
**Headers:** `Product Code`, `Product Name`, `Stock Quantity`, `Unit Price`, `Category`, `Supplier`
- **Purpose:** Test product/inventory data structure
- **Data:** Product inventory records (6 rows)
- **Use Case:** Test with different data types and structures

### 6. `financial-report-2024.xlsx`
**Headers:** `Month`, `Revenue`, `Expenses`, `Profit`, `Department`
- **Purpose:** Test financial data with different date format
- **Data:** Monthly financial summary (6 rows)
- **Use Case:** Test date parsing and financial calculations

### 7. `orders-2024.xlsx`
**Headers:** `Order ID`, `Date`, `Customer`, `Product`, `Amount`, `Status`
- **Purpose:** Test mixed headers (some common, some unique)
- **Data:** Order records (6 rows)
- **Use Case:** Upload with sales files - should detect `Date`, `Product`, `Amount` as common headers

## Testing Scenarios

### Scenario 1: Common Header Detection
1. Upload `sales-q1-2024.xlsx` and `sales-q2-2024.xlsx`
2. **Expected:** All 5 headers (`Date`, `Product`, `Amount`, `Quantity`, `Region`) should be detected as common

### Scenario 2: Manual Header Mapping
1. Upload `sales-q1-2024.xlsx` and `transactions-2024.xlsx`
2. **Expected:** No common headers detected initially
3. Use Header Mapping to map:
   - `Transaction Date` → `Date`
   - `Item Name` → `Product`
   - `Total Price` → `Amount`
   - `Units Sold` → `Quantity`
   - `Location` → `Region`

### Scenario 3: Partial Common Headers
1. Upload `sales-q1-2024.xlsx` and `orders-2024.xlsx`
2. **Expected:** 3 common headers detected: `Date`, `Product`, `Amount`

### Scenario 4: No Common Headers
1. Upload `customers-2024.xlsx` and `inventory-2024.xlsx`
2. **Expected:** No common headers detected, manual mapping required

### Scenario 5: Multiple Files with Mixed Headers
1. Upload all 7 files
2. **Expected:** Complex header detection scenario
3. Test alias creation for different header groups

## Regenerating Files

To regenerate these mock files, run:

```bash
npm run generate:mocks
```

This will recreate all files in the `public/mock-data/` directory.

## File Locations

Files are located at: `public/mock-data/`

You can access them via:
- Direct file system: `public/mock-data/[filename].xlsx`
- Via dev server: `http://localhost:5173/mock-data/[filename].xlsx` (if served statically)

## Notes

- All files use the `.xlsx` format (Excel 2007+)
- Files contain realistic sample data for testing
- Headers are intentionally varied to test different mapping scenarios
- Date formats vary between files to test parsing capabilities

