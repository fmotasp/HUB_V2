const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old modals (clients-modal and formats-modal) completely.
const modalsRegex = /<!-- Clients Modal Overlay -->[\s\S]*?<!-- Formats Modal Overlay -->[\s\S]*?<\/div>\s*<\/div>/;
html = html.replace(modalsRegex, '');

// We need to extract the format selector HTML from our previous modal.
// Wait, since I'm removing the modals, I should recreate the format selector HTML cleanly for the popover.
const newFormatSelector = `
        <div class="p-3 flex flex-col gap-3" id="format-selector">
            <div class="grid grid-cols-4 gap-2">
                <button type="button" class="format-btn active flex items-center justify-center rounded-lg border-2 border-white text-white text-[10px] font-medium transition-all hover:bg-white/10 aspect-square" data-format="1:1">1:1</button>
                <button type="button" class="format-btn flex items-center justify-center rounded border border-white/20 text-gray-400 text-[10px] font-medium transition-all hover:bg-white/10 aspect-[4/3]" data-format="4:3">4:3</button>
                <button type="button" class="format-btn flex items-center justify-center rounded border border-white/20 text-gray-400 text-[10px] font-medium transition-all hover:bg-white/10 aspect-[3/2]" data-format="3:2">3:2</button>
                <button type="button" class="format-btn flex items-center justify-center rounded border border-white/20 text-gray-400 text-[10px] font-medium transition-all hover:bg-white/10 aspect-video" data-format="16:9">16:9</button>
                <button type="button" class="format-btn flex items-center justify-center rounded border border-white/20 text-gray-400 text-[10px] font-medium transition-all hover:bg-white/10 aspect-[3/4]" data-format="3:4">3:4</button>
                <button type="button" class="format-btn flex items-center justify-center rounded border border-white/20 text-gray-400 text-[10px] font-medium transition-all hover:bg-white/10 aspect-[2/3]" data-format="2:3">2:3</button>
                <button type="button" class="format-btn flex items-center justify-center rounded border border-white/20 text-gray-400 text-[10px] font-medium transition-all hover:bg-white/10 aspect-[9/16]" data-format="9:16">9:16</button>
                <button type="button" class="format-btn flex items-center justify-center rounded border border-white/20 text-gray-400 text-[10px] font-medium transition-all hover:bg-white/10 aspect-[4/5]" data-format="4:5">4:5</button>
            </div>
            <!-- Preview Box (Big Grid) -->
            <div class="w-full h-24 border border-white/10 rounded-xl bg-black/40 flex items-center justify-center">
                <div id="format-preview" class="w-12 h-12 border-2 border-white rounded-lg flex items-center justify-center transition-all duration-300 relative overflow-hidden shrink-0">
                    <div class="absolute inset-0 flex flex-col justify-evenly"><div class="w-full h-[1px] bg-white/20"></div><div class="w-full h-[1px] bg-white/20"></div></div>
                    <div class="absolute inset-0 flex flex-row justify-evenly"><div class="h-full w-[1px] bg-white/20"></div><div class="h-full w-[1px] bg-white/20"></div></div>
                </div>
            </div>
        </div>
`;

// 2. Replace the old prompt bar with the new one having hover popovers
const oldBarRegex = /<!-- Floating Prompt Bar \(Bottom Center\) -->[\s\S]*?<!-- Canvas Toolbar -->/;

const newBar = `
    <!-- Floating Prompt Bar (Bottom Center) -->
    <div class="absolute bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none px-8" style="padding-left: 540px;">
        <div class="bg-[#151515] border border-white/10 rounded-full py-2 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 w-full max-w-4xl pointer-events-auto backdrop-blur-2xl">
            
            <!-- Client Popover Group -->
            <div class="relative group/client flex items-center">
                <button id="btn-open-clients" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                    <i class="fa-solid fa-briefcase opacity-70"></i> <span id="selected-client-label">Cliente</span>
                </button>
                <div class="absolute bottom-full left-0 mb-3 hidden group-hover/client:flex flex-col bg-[#1f1f1f] border border-white/10 rounded-2xl p-2 shadow-2xl w-64 origin-bottom-left animate-in fade-in zoom-in-95 duration-200">
                    <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Cliente (Marca)</div>
                    <div id="client-grid" class="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar"></div>
                </div>
            </div>
            
            <!-- Format Popover Group -->
            <div class="relative group/format flex items-center">
                <button id="btn-open-formats" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                    <i class="fa-regular fa-square opacity-70"></i> <span id="selected-format-label">1:1</span>
                </button>
                <div class="absolute bottom-full left-0 mb-3 hidden group-hover/format:flex flex-col bg-[#1f1f1f] border border-white/10 rounded-2xl p-2 shadow-2xl w-72 origin-bottom-left animate-in fade-in zoom-in-95 duration-200">
                    <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Proporção</div>
                    ${newFormatSelector}
                </div>
            </div>

            <!-- Styles Popover Group -->
            <div class="relative group/style flex items-center">
                <button id="btn-open-styles" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                    <i class="fa-solid fa-star opacity-70"></i> <span id="selected-style-label">Estilo</span>
                </button>
                <!-- O modal de estilos já é muito complexo, podemos manter como modal ou fazer popover, mas o usuário pediu "passar sobre os botoes expandir dessa maneira". 
                     Vou manter o modal nativo mas mostrar um hint ou fazer ele abrir. -->
            </div>

            <button id="btn-open-character" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                <i class="fa-regular fa-user opacity-70"></i> <span>Personagem</span>
            </button>

            <div class="w-px h-6 bg-white/10 mx-2 shrink-0"></div>

            <input type="text" id="prompt-input" class="flex-1 min-w-[200px] bg-transparent border-0 text-white placeholder-gray-500 outline-none px-2 text-[15px]" placeholder="O que vamos gerar hoje?">
            
            <button id="generate-btn" class="w-10 h-10 shrink-0 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brandHover transition-all shadow-lg transform active:scale-95 ml-2">
                <i class="fa-solid fa-arrow-up"></i>
            </button>
        </div>
    </div>
    <!-- Canvas Toolbar -->
`;

html = html.replace(oldBarRegex, newBar);
fs.writeFileSync('index.html', html);
console.log('index.html updated successfully');
