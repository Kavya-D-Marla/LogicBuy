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

// Extract natural Unsplash URLs from the first 25 items
const categoryImages = {};
products.slice(0, 25).forEach(p => {
  if (p.image && p.image.includes('unsplash.com')) {
    if (!categoryImages[p.category]) categoryImages[p.category] = [];
    categoryImages[p.category].push({ image: p.image, images: p.images });
  }
});

const priceRanges = {
  'Men': { min: 500, max: 2500, dMin: 10, dMax: 40 },
  'Women': { min: 600, max: 3000, dMin: 10, dMax: 50 },
  'Kids': { min: 300, max: 1500, dMin: 20, dMax: 50 },
  'Beauty': { min: 200, max: 1500, dMin: 10, dMax: 30 },
  'Footwear': { min: 1000, max: 5000, dMin: 15, dMax: 45 },
  'Accessories': { min: 300, max: 3000, dMin: 10, dMax: 40 }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

products = products.map((product, index) => {
  // Update images for generated products (id > 25)
  if (product.id > 25) {
    const imagesArray = categoryImages[product.category] || [];
    if (imagesArray.length > 0) {
      const selectedImg = getRandomElement(imagesArray);
      product.image = selectedImg.image;
      product.images = selectedImg.images;
    }
    
    // Update price and discount to be realistic
    const range = priceRanges[product.category] || { min: 500, max: 3000, dMin: 10, dMax: 50 };
    const originalPrice = getRandomInt(range.min, range.max);
    
    // Make prices end in 99 for realism
    const adjustedOriginal = Math.floor(originalPrice / 100) * 100 + 99;
    const discount = getRandomInt(range.dMin, range.dMax);
    
    const price = Math.floor(adjustedOriginal * (1 - discount / 100));
    const adjustedPrice = Math.floor(price / 10) * 10 + 9; // ends in 9
    
    product.originalPrice = adjustedOriginal;
    product.discount = discount;
    product.price = adjustedPrice;
  }
  
  return product;
});

fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
console.log(`Successfully updated products with realistic pricing and natural images!`);
