export interface HeaderAlias {
    id: string;
    alias: string;
    originalHeaders: string[];
}

/**
 * Create an alias mapping
 */
export function createAlias(alias: string, originalHeaders: string[]): HeaderAlias {
    return {
        id: crypto.randomUUID(),
        alias,
        originalHeaders
    };
}

/**
 * Apply aliases to normalize data across files
 */
export function applyAliases(
    row: Record<string, any>,
    aliases: HeaderAlias[]
): Record<string, any> {
    const normalized: Record<string, any> = {};

    for (const alias of aliases) {
        // Find first matching header in the row
        for (const originalHeader of alias.originalHeaders) {
            if (row[originalHeader] !== undefined) {
                normalized[alias.alias] = row[originalHeader];
                break;
            }
        }
    }

    // Include any non-aliased fields as-is
    for (const key in row) {
        const isAliased = aliases.some(a => a.originalHeaders.includes(key));
        if (!isAliased) {
            normalized[key] = row[key];
        }
    }

    return normalized;
}
