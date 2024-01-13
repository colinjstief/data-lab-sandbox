/**
 * Creates a promise that resolves after a specified number of milliseconds.
 * This function can be used to introduce a delay in asynchronous operations.
 *
 * @param ms - The number of milliseconds to wait before the promise resolves.
 * @returns A Promise that resolves after the specified delay.
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
};

/**
 * Sorts an array of objects by a specified property.
 * @param array - The array of objects to sort.
 * @param property - The property to sort by.
 * @param caseInsensitive - Set to true for case-insensitive sorting.
 * @returns The sorted array.
 */
export function sortByProperty<T>(
  array: T[],
  property: keyof T,
  caseInsensitive: boolean = true
): T[] {
  return array.sort((a, b) => {
    let aValue = String(a[property]);
    let bValue = String(b[property]);

    if (caseInsensitive) {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  });
}
