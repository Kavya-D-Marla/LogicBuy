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

// Helper to delay requests so we don't spam the API too fast
const delay = ms => new Promise(res => setTimeout(res, ms));

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
      await delay(200); // 200ms delay to avoid rate limiting
    } catch (e) {
      console.error(`Error fetching ${query} page ${page}:`, e.message);
    }
  }
  return allResults;
}

async function updateProducts() {
  // Group products by category AND subcategory
  const subcategories = {};
  products.forEach(p => {
    const key = `${p.category} ${p.subcategory}`;
    if (!subcategories[key]) subcategories[key] = [];
    subcategories[key].push(p);
  });

  for (const [key, items] of Object.entries(subcategories)) {
    console.log(`Fetching matching images for ${key}...`);
    
    // Some subcategories need better keywords for Unsplash
    let query = key;
    if (key.includes('Ethnic')) query = 'indian ethnic wear women';
    if (key.includes('Dungarees')) query = 'kids overalls';
    if (key.includes('Bodysuits')) query = 'baby onesie';
    if (key.includes('Beauty')) query = key.replace('Beauty', 'makeup');
    
    // We need images for this specific subcategory
    const pagesNeeded = Math.ceil(items.length / 20) + 1;
    const results = await fetchUnsplashImages(query, pagesNeeded);
    
    // Filter out unique URLs just in case
    const uniquePhotos = Array.from(new Map(results.map(item => [item.id, item])).values());
    
    if (uniquePhotos.length === 0) {
      console.log(`Warning: No images found for ${key}`);
      continue;
    }

    items.forEach((p, idx) => {
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
  console.log('Successfully updated all products with uniquely matched pictures!');
}

updateProducts();
