/**
 * Generate PNG icons from SVG for the extension
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128, 512];
const svgPath = path.join(__dirname, 'assets', 'icon.svg');
const outputDir = path.join(__dirname, 'assets');

async function generateIcons() {
  const svg = fs.readFileSync(svgPath);
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon${size}.png`);
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon${size}.png`);
  }
  
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
