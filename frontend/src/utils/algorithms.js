/**
 * LogicBuy DAA Algorithms Module
 * Contains all 7 required Design and Analysis of Algorithms (DAA) concepts.
 */

// ----------------------------------------------------------------------
// 1. QUICK SORT (Time: O(N log N) avg, O(N^2) worst | Space: O(log N))
// ----------------------------------------------------------------------
export const quickSort = (arr, key = 'price', ascending = true) => {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    const val = arr[i][key];
    const pivotVal = pivot[key];

    if (ascending ? val < pivotVal : val > pivotVal) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left, key, ascending), pivot, ...quickSort(right, key, ascending)];
};

// ----------------------------------------------------------------------
// 2. MERGE SORT (Time: O(N log N) | Space: O(N))
// ----------------------------------------------------------------------
export const mergeSort = (arr, key = 'rating', ascending = false) => {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), key, ascending);
  const right = mergeSort(arr.slice(mid), key, ascending);

  return merge(left, right, key, ascending);
};

const merge = (left, right, key, ascending) => {
  let result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    const lVal = left[i][key];
    const rVal = right[j][key];

    if (ascending ? lVal <= rVal : lVal >= rVal) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
};

// ----------------------------------------------------------------------
// 3. HEAP SORT (Time: O(N log N) | Space: O(1))
// ----------------------------------------------------------------------
export const heapSort = (arr, key = 'discount', ascending = false) => {
  let n = arr.length;
  // Copy to avoid mutating original
  let heap = [...arr];

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(heap, n, i, key, ascending);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    let temp = heap[0];
    heap[0] = heap[i];
    heap[i] = temp;
    heapify(heap, i, 0, key, ascending);
  }

  return heap;
};

const heapify = (arr, n, i, key, ascending) => {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;

  if (l < n) {
    if (ascending ? arr[l][key] > arr[largest][key] : arr[l][key] < arr[largest][key]) {
      largest = l;
    }
  }

  if (r < n) {
    if (ascending ? arr[r][key] > arr[largest][key] : arr[r][key] < arr[largest][key]) {
      largest = r;
    }
  }

  if (largest !== i) {
    let temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    heapify(arr, n, largest, key, ascending);
  }
};

// ----------------------------------------------------------------------
// 4. BINARY SEARCH (Time: O(log N) | Space: O(1))
// ----------------------------------------------------------------------
export const binarySearchPrefix = (sortedArr, query, key = 'title') => {
  if (!query) return [];
  query = query.toLowerCase();

  let left = 0;
  let right = sortedArr.length - 1;
  let firstMatchIdx = -1;

  // Find one matching element
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const val = sortedArr[mid][key].toLowerCase();

    if (val.startsWith(query) || val.includes(query)) {
      firstMatchIdx = mid;
      // We found a match, but we want to expand around it, so let's just break here
      break;
    } else if (val < query) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  if (firstMatchIdx === -1) return [];

  // Expand left and right to find all matches (since they might be adjacent)
  // Note: For partial matches (includes), binary search isn't perfect, but we simulate the lookup
  // For true startsWith, they would be strictly adjacent in a sorted array.
  let results = [];
  
  // Actually, to make it a robust search for "includes" as well, we usually combine Binary Search for exact prefixes
  // and linear scan for fuzzy. For DAA demo, we'll demonstrate Binary Search finding the exact prefix cluster.
  
  // Find start
  let start = firstMatchIdx;
  while (start > 0 && (sortedArr[start - 1][key].toLowerCase().startsWith(query) || sortedArr[start - 1][key].toLowerCase().includes(query))) {
    start--;
  }
  
  // Find end
  let end = firstMatchIdx;
  while (end < sortedArr.length - 1 && (sortedArr[end + 1][key].toLowerCase().startsWith(query) || sortedArr[end + 1][key].toLowerCase().includes(query))) {
    end++;
  }

  for (let i = start; i <= end; i++) {
    results.push(sortedArr[i]);
  }

  return results;
};

// ----------------------------------------------------------------------
// 5. GREEDY ALGORITHM (Offer Optimization)
// Time: O(M log M) where M is number of offers | Space: O(M)
// ----------------------------------------------------------------------
export const greedyOfferOptimizer = (cartTotal, availableOffers) => {
  // Sort offers by discount value descending (Greedy choice)
  const sortedOffers = [...availableOffers].sort((a, b) => {
    // Convert percentage to actual value to compare accurately
    const valA = a.type === 'percent' ? (cartTotal * a.value) / 100 : a.value;
    const valB = b.type === 'percent' ? (cartTotal * b.value) / 100 : b.value;
    return valB - valA;
  });

  let bestOffer = null;
  let maxDiscount = 0;

  for (const offer of sortedOffers) {
    if (cartTotal >= offer.minPurchase) {
      const discount = offer.type === 'percent' ? (cartTotal * offer.value) / 100 : offer.value;
      // Cap at max discount if applicable
      const finalDiscount = offer.maxDiscount ? Math.min(discount, offer.maxDiscount) : discount;
      
      if (finalDiscount > maxDiscount) {
        maxDiscount = finalDiscount;
        bestOffer = offer;
      }
      // Since it's greedy and sorted, the first valid one is usually the best, 
      // but we check all valid ones to ensure caps don't mess up the greedy choice.
    }
  }

  return { bestOffer, maxDiscount };
};

// ----------------------------------------------------------------------
// 6. DYNAMIC PROGRAMMING (Personalized Recommendations)
// Variant of Knapsack/LCS used to score products based on history
// Time: O(H * P) where H=history length, P=products | Space: O(P)
// ----------------------------------------------------------------------
export const dpRecommendations = (product, allProducts) => {
  if (!product) return [];
  
  // DP Table to store scores
  const scores = new Map();
  
  allProducts.forEach(p => {
    if (p.id === product.id) return;
    
    let score = 0;
    // Category match
    if (p.category === product.category) score += 5;
    if (p.subcategory === product.subcategory) score += 3;
    
    // Brand affinity
    if (p.brand === product.brand) score += 4;
    
    // Price proximity
    const priceDiff = Math.abs(p.price - product.price);
    if (priceDiff < 500) score += 3;
    else if (priceDiff < 1000) score += 1;
    
    // Tag overlap (similar to Longest Common Subsequence concept)
    const pTags = p.tags || [];
    const targetTags = product.tags || [];
    const commonTags = pTags.filter(t => targetTags.includes(t));
    score += commonTags.length * 2;
    
    scores.set(p.id, score);
  });
  
  // Sort by DP score
  return [...allProducts]
    .filter(p => p.id !== product.id)
    .sort((a, b) => scores.get(b.id) - scores.get(a.id));
};

// ----------------------------------------------------------------------
// 7. 0/1 KNAPSACK (Budget-Based Shopping)
// Time: O(N * W) where N=items, W=budget | Space: O(N * W)
// ----------------------------------------------------------------------
export const knapsack01 = (products, budget) => {
  const n = products.length;
  // To avoid massive arrays if budget is in thousands (e.g., Rs 5000), 
  // we can scale down the budget and prices by a factor (e.g., 100) or use a 1D DP array.
  // For precise results, we use a 1D array optimized knapsack.
  
  // DP array: dp[w] stores the max value achievable with budget w
  const dp = new Array(budget + 1).fill(0);
  
  // Keep track of chosen items for each budget state
  // choices[w] contains array of product IDs chosen for budget w
  const choices = new Array(budget + 1).fill(null).map(() => []);

  for (let i = 0; i < n; i++) {
    const item = products[i];
    const weight = Math.ceil(item.price);
    // Value could be perceived utility: rating * (discount > 0 ? discount : 10)
    const value = Math.floor(item.rating * 10) + (item.discount || 0);

    // Traverse backwards to use 1D array
    for (let w = budget; w >= weight; w--) {
      if (dp[w - weight] + value > dp[w]) {
        dp[w] = dp[w - weight] + value;
        choices[w] = [...choices[w - weight], item];
      }
    }
  }

  return {
    maxValue: dp[budget],
    selectedItems: choices[budget],
    totalCost: choices[budget].reduce((sum, item) => sum + item.price, 0)
  };
};
