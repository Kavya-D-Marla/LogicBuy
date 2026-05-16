const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'products.json');

let existingProducts = [];
try {
  existingProducts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} catch (err) {
  console.error("Could not read existing products.json:", err);
}

const categories = {
  'Men': {
    subcats: ['Shirts', 'T-Shirts', 'Jeans', 'Blazers', 'Jackets'],
    brands: ['ThreadCraft', 'StreetVibe', 'DenimCo', 'UrbanMen']
  },
  'Women': {
    subcats: ['Dresses', 'Tops', 'Skirts', 'Ethnic', 'Sweaters'],
    brands: ['Aurelia', 'GlowUp', 'DenimCo', 'ChicStyle']
  },
  'Kids': {
    subcats: ['Hoodies', 'Dresses', 'Dungarees', 'Bodysuits', 'T-Shirts'],
    brands: ['TinyTrend', 'KiddoWear', 'LittleStars']
  },
  'Beauty': {
    subcats: ['Lipstick', 'Skincare', 'Fragrance', 'Makeup', 'Haircare'],
    brands: ['GlowUp', 'PureEssence', 'Glamour']
  },
  'Footwear': {
    subcats: ['Sneakers', 'Sports', 'Heels', 'Boots', 'Sandals'],
    brands: ['UrbanStride', 'RunFast', 'ComfortWalk']
  },
  'Accessories': {
    subcats: ['Sunglasses', 'Bags', 'Watches', 'Belts', 'Wallets'],
    brands: ['OpticLux', 'LeatherCraft', 'TimePiece']
  }
};

const adjectives = ['Premium', 'Classic', 'Modern', 'Elegant', 'Casual', 'Luxury', 'Minimalist', 'Stylish', 'Comfortable', 'Trendy'];

const colors = [
  "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#00FFFF", "#FF00FF", "#C0C0C0", "#808080", 
  "#800000", "#808000", "#008000", "#800080", "#008080", "#000080"
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let newProducts = [...existingProducts];
let currentId = newProducts.length > 0 ? Math.max(...newProducts.map(p => p.id)) + 1 : 1;

for (const [categoryName, categoryData] of Object.entries(categories)) {
  const currentCount = newProducts.filter(p => p.category === categoryName).length;
  const needed = Math.max(0, 40 - currentCount);
  
  for (let i = 0; i < needed; i++) {
    const subcat = getRandomElement(categoryData.subcats);
    const brand = getRandomElement(categoryData.brands);
    const adj = getRandomElement(adjectives);
    
    const title = `${adj} ${subcat} by ${brand}`;
    const originalPrice = getRandomInt(1000, 10000);
    const discount = getRandomInt(10, 60);
    const price = Math.floor(originalPrice * (1 - discount / 100));
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
    const reviews = getRandomInt(10, 5000);
    
    let sizes = [];
    if (['Men', 'Women'].includes(categoryName) && !['Beauty', 'Accessories'].includes(categoryName)) {
      sizes = ["S", "M", "L", "XL"];
    } else if (categoryName === 'Footwear') {
      sizes = ["7", "8", "9", "10"];
    } else if (categoryName === 'Kids') {
      sizes = ["2-3Y", "4-5Y", "6-7Y"];
    }

    const numColors = getRandomInt(1, 4);
    const itemColors = [];
    for(let c=0; c<numColors; c++) itemColors.push(getRandomElement(colors));

    const tags = [];
    if (Math.random() > 0.7) tags.push("bestseller");
    if (Math.random() > 0.7) tags.push("trending");
    if (Math.random() > 0.8) tags.push("new");

    // Using placeholder images for dynamically generated content to prevent broken unsplash links
    // Unsplash source is deprecated, so using a reliable placeholder service
    const seed = currentId + i * 100;
    const imageUrl = `https://picsum.photos/seed/${seed}/400/500`;
    const imageLargeUrl1 = `https://picsum.photos/seed/${seed}/800/1000`;
    const imageLargeUrl2 = `https://picsum.photos/seed/${seed+1}/800/1000`;

    newProducts.push({
      id: currentId++,
      title,
      brand,
      category: categoryName,
      subcategory: subcat,
      price,
      originalPrice,
      discount,
      rating: parseFloat(rating),
      reviews,
      sizes,
      colors: [...new Set(itemColors)],
      image: imageUrl,
      images: [imageLargeUrl1, imageLargeUrl2],
      tags,
      description: `This ${adj.toLowerCase()} ${subcat.toLowerCase()} is brought to you by ${brand}. Perfect for any occasion with top-notch quality.`
    });
  }
}

fs.writeFileSync(filePath, JSON.stringify(newProducts, null, 2));
console.log(`Successfully generated products! Total products: ${newProducts.length}`);
