const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Increase width and padding of floating panel
html = html.replace('w-[300px] animate-in', 'w-[360px] animate-in');
html = html.replace('p-5 shadow-2xl', 'p-6 shadow-2xl');

// Increase mb-3 to mb-5
html = html.replace('<div class="flex items-center justify-between mb-3">', '<div class="flex items-center justify-between mb-5">');

// Add space after icon
html = html.replace('<i class="fa-solid fa-camera opacity-50 mr-2"></i>Ângulo 3D', '<i class="fa-solid fa-cube opacity-50 mr-2"></i> Ângulo 3D');

// Increase padding of inner box
html = html.replace('gap-4 p-4 bg-surface2/50', 'gap-6 p-6 bg-surface2/50');

// Also the Esquerda / Direita spacing in horizontal slider was a bit cramped.
// The horizontal slider div:
html = html.replace('<div class="flex gap-3 items-center justify-between mt-1 pt-4 border-t border-white/5">', '<div class="flex gap-4 items-center justify-between mt-2 pt-5 border-t border-white/5">');

fs.writeFileSync('index.html', html);
console.log('Fixed panel spacing');
