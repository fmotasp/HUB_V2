const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The line to replace:
// <div class="flex flex-col gap-6 p-6 bg-surface2/50 rounded-xl border border-white/5">
html = html.replace('<div class="flex flex-col gap-6 p-6 bg-surface2/50 rounded-xl border border-white/5">', '<div class="flex flex-col gap-6 pt-2">');

fs.writeFileSync('index.html', html);
console.log('Removed inner box styling');
