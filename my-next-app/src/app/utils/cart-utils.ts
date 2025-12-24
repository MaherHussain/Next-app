/**
 * Utility functions for cart operations
 */

/**
 * Checks if two ingredient objects match exactly
 * Used to identify identical cart items (same product + same ingredients)
 */
export function ingredientsMatch(a: any, b: any): boolean {
    // If both are undefined or empty, they're considered matching
    if (!a && !b) return true;
    if (!a || !b) return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
        // Compare arrays for each ingredient group by JSON stringification
        if (JSON.stringify(a[key] || []) !== JSON.stringify(b[key] || [])) {
            return false;
        }
    }
    return true;
}
