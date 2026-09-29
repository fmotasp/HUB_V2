const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div id="view-generate" class="flex-1 overflow-y-auto hidden flex-col">[\s\S]*?<\/aside>/;
html = html.replace(regex, `<div id="view-generate" class="flex-1 overflow-y-auto hidden flex-col items-center justify-center p-6 text-center">
            <i class="fa-solid fa-wand-magic-sparkles text-3xl text-white/20 mb-4"></i>
            <p class="text-sm text-gray-500">Utilize a barra flutuante abaixo para configurar a geração de imagens.</p>
        </div>
    </aside>`);

fs.writeFileSync('index.html', html);
console.log('Fixed view-generate');
