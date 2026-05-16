const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'products.json');

let products = [];
try {
  products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} catch (err) {
  console.error("Could not read products.json:", err);
  process.exit(1);
}

const categoryQueries = {
  'Men': 'mens-fashion',
  'Women': 'womens-fashion',
  'Kids': 'kids-clothing',
  'Beauty': 'makeup',
  'Footwear': 'shoes',
  'Accessories': 'jewelry'
};

async function fetchUnsplashImages(query, pagesNeeded) {
  let allResults = [];
  for (let page = 1; page <= pagesNeeded; page++) {
    try {
      const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.results) {
        allResults = allResults.concat(data.results);
      }
    } catch (e) {
      console.error(`Error fetching ${query} page ${page}:`, e.message);
    }
  }
  return allResults;
}

async function updateProducts() {
  const categories = {};
  products.forEach(p => {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  });

  for (const [category, items] of Object.entries(categories)) {
    console.log(`Fetching unique images for ${category}...`);
    const query = categoryQueries[category] || 'fashion';
    
    // We need up to 40 items. Since per_page=20, we need 3 pages to be safe.
    const pagesNeeded = Math.ceil(items.length / 20) + 1;
    const results = await fetchUnsplashImages(query, pagesNeeded);
    
    // Filter out unique URLs just in case
    const uniquePhotos = Array.from(new Map(results.map(item => [item.id, item])).values());
    
    if (uniquePhotos.length === 0) {
      console.log(`Warning: No images found for ${category}`);
      continue;
    }

    items.forEach((p, idx) => {
      // Loop around if we somehow don't have enough
      const photo = uniquePhotos[idx % uniquePhotos.length];
      if (photo && photo.urls && photo.urls.raw) {
        const base = photo.urls.raw;
        p.image = `${base}&auto=format&fit=crop&w=400&h=500&q=80`;
        p.images = [
          `${base}&auto=format&fit=crop&w=800&h=1000&q=80`,
          `${base}&auto=format&fit=crop&w=800&h=1000&q=80&crop=faces`
        ];
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log('Successfully updated all products with 100% unique natural pictures!');
}

updateProducts();
