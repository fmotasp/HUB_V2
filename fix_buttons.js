const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Change "Personagem" to "Referência" and make it a popover
const oldCharacterBtn = /<button id="btn-open-character"[\s\S]*?<i class="fa-regular fa-user opacity-70 shrink-0"><\/i>\s*<span class="whitespace-nowrap text-sm font-medium text-gray-200">Personagem<\/span>\s*<\/button>/;

const newReferencePopover = `
            <div class="relative group/reference flex items-center shrink-0">
                <button id="btn-open-reference" class="h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-all transform active:scale-95 w-auto px-4 gap-2">
                    <i class="fa-regular fa-image opacity-70 shrink-0"></i>
                    <span class="whitespace-nowrap text-sm font-medium text-gray-200">Referência</span>
                </button>
                <div class="absolute bottom-full left-0 mb-3 hidden group-hover/reference:flex flex-col bg-[#1f1f1f] border border-white/10 rounded-2xl p-4 shadow-2xl w-64 origin-bottom-left animate-in fade-in zoom-in-95 duration-200 after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-4">
                    <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Imagens de Referência</div>
                    <div class="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all" onclick="document.getElementById('reference-upload-input').click()">
                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-500 mb-2"></i>
                        <span class="text-xs text-gray-400 font-medium">Clique ou arraste imagens aqui</span>
                    </div>
                    <input type="file" id="reference-upload-input" accept="image/*" multiple class="hidden">
                </div>
            </div>
`;

if(oldCharacterBtn.test(html)) {
    html = html.replace(oldCharacterBtn, newReferencePopover);
} else {
    // maybe it doesn't have the span inside
    const fallbackRegex = /<button id="btn-open-character"[\s\S]*?<\/button>/;
    html = html.replace(fallbackRegex, newReferencePopover);
}

// 2. Change btn-upload-rembg to a circular button next to generate
const oldRembgBtn = /<button id="btn-upload-rembg"[\s\S]*?<\/button>/;
const newRembgBtn = `
            <button id="btn-upload-rembg" class="w-10 h-10 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all transform active:scale-95" title="Remover Fundo da Imagem">
                <i class="fa-solid fa-wand-magic-sparkles text-sm"></i>
            </button>
`;
html = html.replace(oldRembgBtn, newRembgBtn);

fs.writeFileSync('index.html', html);
console.log('Fixed buttons');
