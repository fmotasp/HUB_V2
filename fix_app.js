const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

// Change createBrandTile class
js = js.replace(/btn\.className = 'flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl border border-white\/5 bg-surface2 hover:bg-white\/5 transition-all transform active:scale-95 snap-start overflow-hidden relative group';/,
"btn.className = 'w-full flex items-center justify-start px-3 py-2.5 rounded-xl border border-transparent hover:bg-white/5 transition-all text-left group ' + (isEditGrid ? 'snap-start flex-shrink-0 w-20 h-20 flex-col justify-center bg-surface2 rounded-2xl' : '');");

// We need to differentiate between isEditGrid and client-grid.
// Let's just override createBrandTile for the client grid.
const override = `
    function createBrandTile(brandData, index, isEditGrid) {
        const btn = document.createElement('button');
        btn.type = 'button';
        
        // Active logic depends on which grid it's rendering for
        const isActive = isEditGrid ? (editingBrandIndex === index) : (selectedBrandIndex === index);
        
        if (isEditGrid) {
            btn.className = 'flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl border border-white/5 bg-surface2 hover:bg-white/5 transition-all transform active:scale-95 snap-start overflow-hidden relative group';
            if (isActive) btn.classList.add('ring-2', 'ring-brand', 'border-brand');
            
            if (brandData && brandData.logo) {
                const img = document.createElement('img');
                img.src = brandData.logo;
                img.className = 'w-full h-full object-cover';
                btn.appendChild(img);
            } else {
                const icon = document.createElement('i');
                icon.className = brandData ? 'fa-solid fa-briefcase text-2xl text-gray-400 mb-1' : 'fa-solid fa-plus text-2xl text-white mb-1';
                btn.appendChild(icon);
                
                const text = document.createElement('span');
                text.className = 'text-[10px] text-gray-300 font-medium truncate w-full px-1 text-center absolute bottom-2';
                text.textContent = brandData ? brandData.name : 'Novo';
                btn.appendChild(text);
            }
        } else {
            // Dropdown List Item Style
            btn.className = 'w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-white/5 transition-all text-left';
            if (isActive) btn.classList.add('bg-white/10');
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'w-6 h-6 shrink-0 rounded flex items-center justify-center ' + (brandData && brandData.logo ? 'bg-transparent overflow-hidden' : 'bg-white/10 text-gray-400');
            
            if (brandData && brandData.logo) {
                const img = document.createElement('img');
                img.src = brandData.logo;
                img.className = 'w-full h-full object-cover';
                iconDiv.appendChild(img);
            } else {
                const icon = document.createElement('i');
                icon.className = brandData ? 'fa-solid fa-briefcase text-xs' : 'fa-solid fa-plus text-xs';
                iconDiv.appendChild(icon);
            }
            btn.appendChild(iconDiv);
            
            const textDiv = document.createElement('div');
            textDiv.className = 'flex flex-col flex-1 overflow-hidden';
            
            const title = document.createElement('span');
            title.className = 'text-sm font-medium text-white truncate';
            title.textContent = brandData ? brandData.name : 'Nova Marca';
            
            const subtitle = document.createElement('span');
            subtitle.className = 'text-[10px] text-gray-400 truncate';
            subtitle.textContent = brandData && brandData.direction ? brandData.direction : 'Adicionar nova marca';
            
            textDiv.appendChild(title);
            textDiv.appendChild(subtitle);
            btn.appendChild(textDiv);
            
            if (isActive) {
                const check = document.createElement('i');
                check.className = 'fa-solid fa-check text-brand text-sm';
                btn.appendChild(check);
            }
        }

        btn.addEventListener('click', () => {
            if (isEditGrid) {
                selectEditMode(index);
            } else {
                selectedBrandIndex = index;
                updateClientGrid();
                const label = document.getElementById('selected-client-label');
                if (label) label.textContent = brandData ? brandData.name : 'Sem Marca';
            }
        });

        return btn;
    }
`;

js = js.replace(/function createBrandTile\([\s\S]*?return btn;\n    }/, override);

// Remove the modal JS logic we added earlier (since we use CSS group-hover now)
const modalJsRegex = /\/\/ New Modals for Clients and Formats[\s\S]*?\/\/ Styles Modal Logic/;
js = js.replace(modalJsRegex, '// Styles Modal Logic');

fs.writeFileSync('app.js', js);
console.log('app.js fixed');
