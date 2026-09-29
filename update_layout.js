const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. EXTRACT CLIENT GRID
const clientGridRegex = /<div id="client-grid"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const clientGridMatch = html.match(clientGridRegex);
const clientGridHtml = clientGridMatch ? clientGridMatch[0] : '';
html = html.replace(clientGridRegex, '');

// 2. EXTRACT FORMAT SELECTOR
const formatRegex = /<div class="p-4 bg-\[#1a1a1a\] rounded-2xl flex gap-4" id="format-selector">[\s\S]*?<!-- Preview Box \(Big Grid\) -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const formatMatch = html.match(formatRegex);
const formatHtml = formatMatch ? formatMatch[0] : '';
html = html.replace(formatRegex, '');

// 3. EXTRACT REFERENCIAS BUTTONS
const refRegex = /<div class="mt-6">\s*<div class="flex items-center justify-between mb-3">\s*<label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Referências<\/label>\s*<span class="text-xs text-gray-500">0\/8<\/span>\s*<\/div>\s*<div class="flex gap-3">[\s\S]*?<\/div>\s*<\/div>/;
const refMatch = html.match(refRegex);
html = html.replace(refRegex, '');

// 4. EXTRACT INPUT AREA (Prompt)
const inputRegex = /<!-- Input Area \(Fixed Bottom\) -->\s*<div class="p-6 border-t border-white\/5 bg-surface\/80 backdrop-blur-md">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- Main Canvas Area -->/;
const inputMatch = html.match(inputRegex);
// We don't need the old input area, we will build a new one.
html = html.replace(inputRegex, '</div>\n    <!-- Main Canvas Area -->');


// NEW BAR HTML
const newBarHtml = `
    <!-- Floating Prompt Bar (Bottom Center) -->
    <div class="absolute bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none px-8" style="padding-left: 540px;">
        <div class="bg-[#151515] border border-white/10 rounded-full py-2 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 w-full max-w-4xl pointer-events-auto backdrop-blur-2xl">
            
            <button id="btn-open-clients" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                <i class="fa-solid fa-briefcase opacity-70"></i> <span id="selected-client-label">Cliente</span>
            </button>
            
            <button id="btn-open-formats" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                <i class="fa-regular fa-square opacity-70"></i> <span id="selected-format-label">1:1</span>
            </button>

            <button id="btn-open-styles" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                <i class="fa-solid fa-star opacity-70"></i> <span id="selected-style-label">Estilo</span>
            </button>

            <button id="btn-open-character" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                <i class="fa-regular fa-user opacity-70"></i> <span>Personagem</span>
            </button>

            <div class="w-px h-6 bg-white/10 mx-2"></div>

            <input type="text" id="prompt-input" class="flex-1 bg-transparent border-0 text-white placeholder-gray-500 outline-none px-2 text-[15px]" placeholder="Ask to generate anything...">
            
            <button id="generate-btn" class="w-10 h-10 shrink-0 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brandHover transition-all shadow-lg transform active:scale-95 ml-2">
                <i class="fa-solid fa-arrow-up"></i>
            </button>
        </div>
    </div>
`;

// Insert the new bar inside main, right after the toolbar
html = html.replace('<!-- Canvas Toolbar -->', newBarHtml + '\n        <!-- Canvas Toolbar -->');


// NEW MODALS
const modalsHtml = `
    <!-- Clients Modal Overlay -->
    <div id="clients-modal" class="fixed inset-0 bg-[#000000]/80 backdrop-blur-3xl z-[100] hidden flex-col items-center justify-center">
        <div class="bg-surface rounded-2xl p-6 w-full max-w-2xl border border-white/10 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-white">Selecionar Cliente (Marca)</h2>
                <button id="close-clients-modal" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            ${clientGridHtml}
        </div>
    </div>

    <!-- Formats Modal Overlay -->
    <div id="formats-modal" class="fixed inset-0 bg-[#000000]/80 backdrop-blur-3xl z-[100] hidden flex-col items-center justify-center">
        <div class="bg-surface rounded-2xl p-6 w-full max-w-2xl border border-white/10 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-white">Selecionar Formato</h2>
                <button id="close-formats-modal" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            ${formatHtml}
        </div>
    </div>
`;

// Insert modals before styles-modal
html = html.replace('<!-- Styles Modal Overlay -->', modalsHtml + '\n    <!-- Styles Modal Overlay -->');

// Also remove labels like "Cliente (Marca)" and "Formatos (Selecione um ou mais)" from the previous locations which were left behind
html = html.replace(/<label class="block text-xs text-gray-400 mb-2">Cliente \(Marca\)<\/label>/, '');
html = html.replace(/<label class="block text-xs text-gray-400 mb-2">Formatos \(Selecione um ou mais\)<\/label>/, '');

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully');
