import * as XLSX from 'xlsx';

export interface ParsedFile {
    fileId: string;
    fileName: string;
    headers: string[];
    normalizedHeaders: string[];
    rows: Record<string, any>[];
    workbook: XLSX.WorkBook;
}

/**
 * Parse an Excel file and extract headers and rows
 */
export async function parseExcelFile(file: File): Promise<ParsedFile> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                // Get first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                if (jsonData.length === 0) {
                    throw new Error('Empty file');
                }

                // First row is headers
                const headers = jsonData[0] as string[];
                const normalizedHeaders = headers.map(h => normalizeHeader(h));

                // Convert rows to objects
                const rows = jsonData.slice(1).map(row => {
                    const obj: Record<string, any> = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });

                resolve({
                    fileId: crypto.randomUUID(),
                    fileName: file.name,
                    headers,
                    normalizedHeaders,
                    rows,
                    workbook
                });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsBinaryString(file);
    });
}

/**
 * Normalize header strings for comparison
 */
export function normalizeHeader(header: string): string {
    return header
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}
