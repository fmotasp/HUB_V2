const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The old input area looks like this:
const oldInputRegex = /<!-- Input Area \(Fixed Bottom\) -->[\s\S]*?<textarea id="prompt-input"[\s\S]*?<button id="generate-btn"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

html = html.replace(oldInputRegex, '</div></div>');

// Also remove the empty tags from view-generate
const emptyTagsRegex = /<section>\s*<h2 class="text-sm font-medium text-gray-400 uppercase tracking-wider text-\[11px\] mb-4">Parâmetros de Geração<\/h2>\s*<div class="space-y-4">\s*<div>\s*<!-- Brand Grid \(Replaces Select Dropdown\) -->\s*<div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- 3D Camera Angle Control -->\s*<\/div>\s*<\/section>/;

html = html.replace(emptyTagsRegex, '');

fs.writeFileSync('index.html', html);
console.log('Fixed duplicates');
