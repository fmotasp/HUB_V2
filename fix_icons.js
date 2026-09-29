const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The buttons look like this:
// <button id="btn-open-clients" class="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[12px] font-medium flex items-center gap-2 whitespace-nowrap transition-all">
//     <i class="fa-solid fa-briefcase opacity-70"></i> <span id="selected-client-label">Cliente</span>
// </button>

function makeCircular(htmlStr, btnId, iconClass) {
    const regex = new RegExp(`<button id="${btnId}"[\\s\\S]*?<i class="${iconClass}.*?"><\\/i>[\\s\\S]*?<\\/button>`);
    return htmlStr.replace(regex, `<button id="${btnId}" class="w-11 h-11 shrink-0 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-all transform active:scale-95">
                    <i class="${iconClass} opacity-70"></i>
                </button>`);
}

html = makeCircular(html, 'btn-open-clients', 'fa-solid fa-briefcase');
html = makeCircular(html, 'btn-open-formats', 'fa-regular fa-square');
html = makeCircular(html, 'btn-open-styles', 'fa-solid fa-star');
html = makeCircular(html, 'btn-open-character', 'fa-regular fa-user');

// Increase gap in the bar
html = html.replace('shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2', 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3');

fs.writeFileSync('index.html', html);
console.log('Icons made circular with more spacing');
