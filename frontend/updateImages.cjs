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

const categoryKeywords = {
  'Men': 'menswear,clothing',
  'Women': 'womenswear,fashion',
  'Kids': 'kids,clothes',
  'Beauty': 'cosmetics,makeup',
  'Footwear': 'shoes,sneakers',
  'Accessories': 'accessories,jewelry'
};

products = products.map((product) => {
  // Only update images that have 'picsum.photos' to preserve the original 25 products which have good unsplash images
  if (product.image && product.image.includes('picsum.photos')) {
    const keywords = categoryKeywords[product.category] || 'fashion';
    const lock1 = product.id;
    const lock2 = product.id + 1000;
    const lock3 = product.id + 2000;
    
    // loremflickr caches images based on the lock parameter, ensuring static images per product
    product.image = `https://loremflickr.com/400/500/${keywords}?lock=${lock1}`;
    product.images = [
      `https://loremflickr.com/800/1000/${keywords}?lock=${lock2}`,
      `https://loremflickr.com/800/1000/${keywords}?lock=${lock3}`
    ];
  }
  return product;
});

fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
console.log(`Successfully updated images for products to match categories!`);
