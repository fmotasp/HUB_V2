const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The line for the container:
// <div class="bg-[#151515] border border-white/10 rounded-full py-2 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3 w-full max-w-4xl pointer-events-auto backdrop-blur-2xl">
html = html.replace(
    '<div class="bg-[#151515] border border-white/10 rounded-full py-2 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3 w-full max-w-4xl pointer-events-auto backdrop-blur-2xl">',
    '<div class="bg-[#151515] border border-white/10 rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-3 w-full max-w-4xl pointer-events-auto backdrop-blur-2xl transition-all">\n            <textarea id="prompt-input" rows="1" class="w-full bg-transparent border-0 text-white placeholder-gray-500 outline-none px-3 pt-2 text-[15px] resize-none overflow-y-auto custom-scrollbar" style="min-height: 44px; max-height: 240px;" placeholder="O que vamos gerar hoje?" oninput="this.style.height = \'\'; this.style.height = Math.min(this.scrollHeight, 240) + \'px\'"></textarea>\n            <div class="flex items-center gap-3 w-full">'
);

// We need to find the old prompt-input and replace it with a spacer (flex-1)
html = html.replace(
    '<input type="text" id="prompt-input" class="flex-1 min-w-[200px] bg-transparent border-0 text-white placeholder-gray-500 outline-none px-2 text-[15px]" placeholder="O que vamos gerar hoje?">',
    '<div class="flex-1"></div>'
);

// We also need to remove the separator line since the buttons are now on their own row
html = html.replace('<div class="w-px h-6 bg-white/10 mx-2 shrink-0"></div>', '');

// And we need to close the inner div we added for the buttons row after the generate button
// Wait, the generate-btn is right before `</div>` which closes the whole prompt bar.
// Before my change, the structure was:
// <div ...> [popovers] [separator] [input] [generate-btn] </div>
// Now it's:
// <div ...> <textarea> <div flex items-center gap-3> [popovers] [spacer] [generate-btn] </div></div>
html = html.replace(
    '</button>\n        </div>\n    </div>\n    <!-- Canvas Toolbar -->',
    '</button>\n            </div>\n        </div>\n    </div>\n    <!-- Canvas Toolbar -->'
);

fs.writeFileSync('index.html', html);
console.log('Fixed prompt bar to use expanding textarea');
