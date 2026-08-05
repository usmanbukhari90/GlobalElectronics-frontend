const fs = require('fs');
const path = require('path');

const brands = ['apple', 'samsung', 'sony', 'lg', 'huawei', 'philips', 'hp', 'dell', 'xiaomi', 'lenovo'];
const srcDir = path.join(__dirname, 'node_modules', 'simple-icons', 'icons');
const destDir = path.join(__dirname, 'public', 'brands');

fs.mkdirSync(destDir, { recursive: true });

brands.forEach((slug) => {
  const src = path.join(srcDir, `${slug}.svg`);
  const dest = path.join(destDir, `${slug}.svg`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✔ copied ${slug}.svg`);
  } else {
    console.log(`✘ MISSING: ${slug}.svg — check exact filename in node_modules/simple-icons/icons/`);
  }
});