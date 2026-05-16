// Quick Sort: Sort products by price
// Time Complexity: O(N log N) average, O(N^2) worst case
// Space Complexity: O(log N) due to recursive call stack

function partition(arr, low, high, key) {
  const pivot = arr[high][key];
  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    if (arr[j][key] < pivot) {
      i++;
      // Swap arr[i] and arr[j]
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  // Swap arr[i + 1] and arr[high]
  const temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}

function quickSort(arr, low, high, key = 'price') {
  if (low < high) {
    const pi = partition(arr, low, high, key);
    quickSort(arr, low, pi - 1, key);
    quickSort(arr, pi + 1, high, key);
  }
  return arr;
}

// Wrapper function for easier usage
const sortByPrice = (products) => {
  if (!products || products.length <= 1) return products;
  // Clone array to avoid mutating original data
  const cloned = [...products];
  return quickSort(cloned, 0, cloned.length - 1, 'price');
};

module.exports = { quickSort, sortByPrice };
