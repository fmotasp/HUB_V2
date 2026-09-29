const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function updateButton(htmlStr, btnId, defaultText) {
    const regex = new RegExp(`(<button id="${btnId}" class=".*?)(px-4)(.*?)(transition-all)(">[\\s\\S]*?<i class=".*?></i>\\s*)(<span.*?>.*?</span>|<span>.*?</span>)([\\s\\S]*?</button>)`);
    
    return htmlStr.replace(regex, (match, p1, px, p3, trans, p5, span, p7) => {
        // p1: <button ... class="...
        // px: px-4 (we'll change to px-3 to be more circular when closed, but keep it balanced)
        // p3: ...
        // trans: transition-all
        // p5: "> ... <i ...></i> 
        // span: <span id="...">Text</span>
        // p7:  </button>
        
        // Add 'group' to button classes
        const newClassStart = p1 + 'group px-3' + p3 + 'transition-all duration-300 ease-out';
        
        // Modify span
        // Inject max-w-0 opacity-0 overflow-hidden group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 ease-out
        let newSpan = span;
        if (newSpan.includes('class="')) {
            newSpan = newSpan.replace('class="', 'class="inline-block max-w-0 opacity-0 overflow-hidden group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-300 ease-out align-middle whitespace-nowrap ');
        } else {
            newSpan = newSpan.replace('<span', '<span class="inline-block max-w-0 opacity-0 overflow-hidden group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-300 ease-out align-middle whitespace-nowrap"');
        }
        
        return newClassStart + p5 + newSpan + p7;
    });
}

html = updateButton(html, 'btn-open-clients');
html = updateButton(html, 'btn-open-formats');
html = updateButton(html, 'btn-open-styles');
html = updateButton(html, 'btn-open-character');

fs.writeFileSync('index.html', html);
console.log('Buttons updated to expand on hover');
