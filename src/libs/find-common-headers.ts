import { normalizeHeader } from './excel-parser';

export interface CommonHeaderResult {
    commonHeaders: string[];
    missingCommon: boolean;
    headersByFile: Map<string, string[]>;
}

/**
 * Find common headers across multiple files
 * Uses normalized headers for comparison
 */
export function findCommonHeaders(
    files: Array<{ fileId: string; normalizedHeaders: string[] }>
): CommonHeaderResult {
    if (files.length === 0) {
        return {
            commonHeaders: [],
            missingCommon: true,
            headersByFile: new Map()
        };
    }

    if (files.length === 1) {
        return {
            commonHeaders: files[0].normalizedHeaders,
            missingCommon: false,
            headersByFile: new Map([[files[0].fileId, files[0].normalizedHeaders]])
        };
    }

    // Find intersection of all headers
    const headersByFile = new Map<string, string[]>();
    files.forEach(f => headersByFile.set(f.fileId, f.normalizedHeaders));

    const firstFileHeaders = new Set(files[0].normalizedHeaders);
    const commonHeaders: string[] = [];

    for (const header of firstFileHeaders) {
        const isCommon = files.every(f =>
            f.normalizedHeaders.includes(header)
        );
        if (isCommon) {
            commonHeaders.push(header);
        }
    }

    return {
        commonHeaders,
        missingCommon: commonHeaders.length === 0,
        headersByFile
    };
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Calculate similarity score between two headers (0-1, where 1 is identical)
 */
export function headerSimilarity(header1: string, header2: string): number {
    const norm1 = normalizeHeader(header1);
    const norm2 = normalizeHeader(header2);

    if (norm1 === norm2) return 1.0;

    const maxLen = Math.max(norm1.length, norm2.length);
    if (maxLen === 0) return 1.0;

    const distance = levenshteinDistance(norm1, norm2);
    return 1.0 - (distance / maxLen);
}

/**
 * Find similar headers across files using fuzzy matching
 * Returns suggestions for manual mapping
 */
export function suggestHeaderMappings(
    files: Array<{ fileId: string; fileName: string; headers: string[]; normalizedHeaders: string[] }>,
    threshold: number = 0.7
): Array<{
    groupName: string;
    headers: Array<{ fileId: string; fileName: string; header: string; normalizedHeader: string }>;
    similarity: number;
}> {
    const suggestions: Array<{
        groupName: string;
        headers: Array<{ fileId: string; fileName: string; header: string; normalizedHeader: string }>;
        similarity: number;
    }> = [];

    const processed = new Set<string>();

    for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < files[i].headers.length; j++) {
            const header1 = files[i].headers[j];
            const norm1 = files[i].normalizedHeaders[j];
            const key1 = `${files[i].fileId}:${norm1}`;

            if (processed.has(key1)) continue;

            const group: Array<{ fileId: string; fileName: string; header: string; normalizedHeader: string }> = [
                { fileId: files[i].fileId, fileName: files[i].fileName, header: header1, normalizedHeader: norm1 }
            ];

            let minSimilarity = 1.0;

            // Look for similar headers in other files
            for (let k = i + 1; k < files.length; k++) {
                let bestMatch: { header: string; normalizedHeader: string; similarity: number } | null = null;

                for (let l = 0; l < files[k].headers.length; l++) {
                    const header2 = files[k].headers[l];
                    const norm2 = files[k].normalizedHeaders[l];
                    const key2 = `${files[k].fileId}:${norm2}`;

                    if (processed.has(key2)) continue;

                    const similarity = headerSimilarity(header1, header2);
                    if (similarity >= threshold && (!bestMatch || similarity > bestMatch.similarity)) {
                        bestMatch = { header: header2, normalizedHeader: norm2, similarity };
                    }
                }

                if (bestMatch) {
                    group.push({
                        fileId: files[k].fileId,
                        fileName: files[k].fileName,
                        header: bestMatch.header,
                        normalizedHeader: bestMatch.normalizedHeader
                    });
                    minSimilarity = Math.min(minSimilarity, bestMatch.similarity);
                    processed.add(`${files[k].fileId}:${bestMatch.normalizedHeader}`);
                }
            }

            if (group.length > 1) {
                suggestions.push({
                    groupName: header1, // Use first header as group name
                    headers: group,
                    similarity: minSimilarity
                });
            }

            processed.add(key1);
        }
    }

    return suggestions.sort((a, b) => b.similarity - a.similarity);
}
