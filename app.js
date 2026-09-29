document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const loadingState = document.getElementById('loading-state');
    const loadingText = document.getElementById('loading-text');
    const emptyState = document.getElementById('empty-state');
    const resultContainer = document.getElementById('result-container');
    const formatSelect = document.getElementById('format-select');
    const formatDisplay = document.getElementById('format-display');
    const saveBrandBtn = document.getElementById('save-brand-btn');
    const newBrandName = document.getElementById('new-brand-name');
    const newBrandDirection = document.getElementById('new-brand-direction');
    const newBrandFile = document.getElementById('new-brand-file');

    // Navigation
    const navCreateBrand = document.getElementById('nav-create-brand');
    const navGenerate = document.getElementById('nav-generate');
    const viewCreateBrand = document.getElementById('view-create-brand');
    const viewGenerate = document.getElementById('view-generate');
    const sidebarTitle = document.getElementById('sidebar-title');

    function setActiveNav(activeId) {
        if (activeId === 'create') {
            navCreateBrand.className = 'flex-1 px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-medium transition flex items-center justify-center gap-2 transform active:scale-95';
            navGenerate.className = 'flex-1 px-4 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-xs font-medium transition flex items-center justify-center gap-2 transform active:scale-95';
            
            viewCreateBrand.classList.remove('hidden');
            viewCreateBrand.classList.add('block');
            viewGenerate.classList.add('hidden');
            viewGenerate.classList.remove('flex');
            sidebarTitle.textContent = "Nova Marca";
        } else {
            navGenerate.className = 'flex-1 px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-medium transition flex items-center justify-center gap-2 transform active:scale-95';
            navCreateBrand.className = 'flex-1 px-4 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-xs font-medium transition flex items-center justify-center gap-2 transform active:scale-95';
            
            viewCreateBrand.classList.add('hidden');
            viewCreateBrand.classList.remove('block');
            viewGenerate.classList.remove('hidden');
            viewGenerate.classList.add('flex');
            sidebarTitle.textContent = "Gerar Imagens";
        }
    }

    navCreateBrand.addEventListener('click', () => setActiveNav('create'));
    navGenerate.addEventListener('click', () => setActiveNav('generate'));

    // Format Selection Logic
    const formatBtns = document.querySelectorAll('.format-btn');
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.contains('active');
            if (isActive) {
                // Prevent unselecting if it's the last one
                if (document.querySelectorAll('.format-btn.active').length > 1) {
                    btn.classList.remove('active', 'border-brand', 'bg-brand/10', 'text-white');
                    btn.classList.add('border-transparent', 'hover:bg-white/5', 'text-gray-300');
                }
            } else {
                btn.classList.add('active', 'border-brand', 'bg-brand/10', 'text-white');
                btn.classList.remove('border-transparent', 'hover:bg-white/5', 'text-gray-300');
            }
        });
    });

    // Brand storage
    let brands = JSON.parse(localStorage.getItem('savedBrands')) || [];
    const clientGrid = document.getElementById('client-grid');
    const newBrandLogo = document.getElementById('new-brand-logo');
    let selectedBrandIndex = null;

    const editBrandGrid = document.getElementById('edit-brand-grid');
    let editingBrandIndex = 'new'; // 'new' ou number

    function selectEditMode(val) {
        editingBrandIndex = val;
        updateClientGrid(); // refresh grids to show active state
        
        if (val === 'new') {
            newBrandName.value = '';
            newBrandDirection.value = '';
            saveBrandBtn.innerHTML = '<i class="fa-solid fa-check text-xs"></i> Criar Marca';
        } else {
            const b = brands[parseInt(val)];
            newBrandName.value = b.name;
            newBrandDirection.value = b.direction || '';
            saveBrandBtn.innerHTML = '<i class="fa-solid fa-save text-xs"></i> Salvar Alterações';
        }
    }

    function createBrandTile(brandData, index, isEditGrid) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl border border-white/5 bg-surface2 hover:bg-white/5 transition-all transform active:scale-95 snap-start overflow-hidden relative group';
        
        // Active logic depends on which grid it's rendering for
        const isActive = isEditGrid ? (editingBrandIndex === index) : (selectedBrandIndex === index);
        
        if (isActive) {
            btn.classList.add('ring-2', 'ring-brand', 'border-brand');
        }

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

        if (brandData && brandData.logo) {
            const overlay = document.createElement('div');
            overlay.className = 'absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity';
            const text = document.createElement('span');
            text.className = 'text-[10px] text-white font-medium text-center px-1';
            text.textContent = brandData.name;
            overlay.appendChild(text);
            btn.appendChild(overlay);
        }

        btn.addEventListener('click', () => {
            if (isEditGrid) {
                selectEditMode(index);
            } else {
                selectedBrandIndex = index;
                updateClientGrid();
            }
        });

        return btn;
    }

    function updateClientGrid() {
        // Render Generation Grid
        clientGrid.innerHTML = '';
        if (brands.length === 0) {
            clientGrid.innerHTML = '<div class="text-xs text-gray-500 italic py-2">Nenhum cliente cadastrado</div>';
        } else {
            brands.forEach((brand, index) => {
                clientGrid.appendChild(createBrandTile(brand, index, false));
            });
        }

        // Render Edit Grid
        if (editBrandGrid) {
            editBrandGrid.innerHTML = '';
            
            // "New" Button
            const newBtn = createBrandTile(null, 'new', true);
            if (editingBrandIndex === 'new') newBtn.classList.add('ring-2', 'ring-brand', 'border-brand', 'bg-brand/10');
            editBrandGrid.appendChild(newBtn);

            // Existing Brands
            brands.forEach((brand, index) => {
                editBrandGrid.appendChild(createBrandTile(brand, index, true));
            });
        }

        // Auto-select first in generation grid if none selected
        if (selectedBrandIndex === null && brands.length > 0) {
            selectedBrandIndex = 0;
            updateClientGrid();
        }
    }

    // Initialize list on load
    updateClientGrid();

    saveBrandBtn.addEventListener('click', () => {
        const name = newBrandName.value;
        const direction = newBrandDirection.value;
        const logoFile = newBrandLogo ? newBrandLogo.files[0] : null;
        const file = newBrandFile ? newBrandFile.files[0] : null;
        const brandbookName = file ? file.name : null;
        
        if (name) {
            const saveBrand = (logoBase64 = null) => {
                const brandData = { name, direction };
                if (brandbookName) brandData.brandbook = brandbookName;
                
                if (editingBrandIndex === 'new') {
                    if (logoBase64) brandData.logo = logoBase64;
                    brands.push(brandData);
                } else {
                    const idx = parseInt(editingBrandIndex);
                    brandData.logo = logoBase64 || brands[idx].logo;
                    if (!brandbookName && brands[idx].brandbook) brandData.brandbook = brands[idx].brandbook;
                    brands[idx] = brandData;
                }
                
                localStorage.setItem('savedBrands', JSON.stringify(brands));
                updateClientGrid();

                saveBrandBtn.innerHTML = '<i class="fa-solid fa-check text-xs"></i> Sucesso!';
                setTimeout(() => {
                    saveBrandBtn.innerHTML = editingBrandIndex === 'new' ? '<i class="fa-solid fa-check text-xs"></i> Criar Marca' : '<i class="fa-solid fa-save text-xs"></i> Salvar Alterações';
                }, 2000);
                
                if (editingBrandIndex === 'new') {
                    newBrandName.value = '';
                    newBrandDirection.value = '';
                    if (newBrandLogo) newBrandLogo.value = '';
                }
            };

            if (logoFile) {
                const reader = new FileReader();
                reader.onload = (e) => saveBrand(e.target.result);
                reader.readAsDataURL(logoFile);
            } else {
                saveBrand(null);
            }
        }
    });

    // Reference Modals Logic
    const stylesModal = document.getElementById('styles-modal');
    const btnOpenStyles = document.getElementById('btn-open-styles');
    const closeStylesModal = document.getElementById('close-styles-modal');
    const stylesGridContent = document.getElementById('styles-grid-content');
    
    // Create Style Logic
    const btnCreateStyle = document.getElementById('btn-create-style');
    const createStyleModal = document.getElementById('create-style-modal');
    const closeCreateStyleModal = document.getElementById('close-create-style-modal');
    const saveNewStyleBtn = document.getElementById('save-new-style-btn');
    const newStyleName = document.getElementById('new-style-name');
    const newStyleDirection = document.getElementById('new-style-direction');

    let selectedStyleTag = { name: "realistic", prompt: "realistic" };
    let characterReference = "";
    
    const btnOpenCharacter = document.getElementById('btn-open-character');
    if (btnOpenCharacter) {
        btnOpenCharacter.addEventListener('click', () => {
            const charRef = prompt("Descreva o Personagem (ex: homem jovem com jaqueta preta):", characterReference);
            if (charRef !== null) {
                characterReference = charRef;
                if (charRef.trim() !== "") {
                    btnOpenCharacter.classList.add('border-brand', 'bg-brand/10', 'text-white');
                    btnOpenCharacter.classList.remove('border-white/20', 'bg-surface', 'text-gray-400');
                    btnOpenCharacter.innerHTML = `
                        <i class="fa-solid fa-check text-xl mb-1 text-brand"></i>
                        <span class="text-[10px] font-medium truncate w-full px-1 text-center">Salvo</span>
                    `;
                } else {
                    btnOpenCharacter.classList.remove('border-brand', 'bg-brand/10', 'text-white');
                    btnOpenCharacter.classList.add('border-white/20', 'bg-surface', 'text-gray-400');
                    btnOpenCharacter.innerHTML = `
                        <i class="fa-regular fa-user text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                        <span class="text-[10px] font-medium">Personagem</span>
                    `;
                }
            }
        });
    }

    const defaultStyles = [
        { name: "photo", prompt: "photorealistic, hyperrealistic, 85mm lens", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop" },
        { name: "natural", prompt: "natural lighting, candid, unedited look", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
        { name: "popsurrealism", prompt: "pop surrealism, vibrant colors, dreamlike", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&h=300&fit=crop" },
        { name: "editorial", prompt: "high fashion editorial, studio lighting, vogue", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop" },
        { name: "illustration", prompt: "digital illustration, flat colors, clean lines", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop" },
        { name: "character3d", prompt: "3d character render, Pixar style, octane render", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=300&fit=crop" },
        { name: "classic-anime", prompt: "90s classic anime style, cel shaded", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=300&fit=crop" }
    ];

    let customStyles = JSON.parse(localStorage.getItem('customStyles')) || [];

    function renderStylesGrid() {
        if (!stylesGridContent) return;
        stylesGridContent.innerHTML = '';
        
        const fullList = [...customStyles, ...defaultStyles];
        
        fullList.forEach(style => {
            const btn = document.createElement('button');
            btn.className = 'flex flex-col gap-2 text-left group transform transition-transform active:scale-95';
            const displayImg = style.img || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&blur=100'; // fallback
            
            btn.innerHTML = `
                <div class="aspect-square w-full rounded-2xl overflow-hidden bg-surface2 relative border-2 border-transparent focus-within:border-brand transition-colors ring-offset-dark focus-within:ring-2 focus-within:ring-brand">
                    <img src="${displayImg}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    ${!style.img ? `<div class="absolute inset-0 flex items-center justify-center bg-black/40"><i class="fa-solid fa-wand-magic-sparkles text-white text-2xl"></i></div>` : ''}
                </div>
                <span class="text-[11px] text-gray-400 font-medium px-1 truncate w-full">#${style.name}</span>
            `;
            
            btn.addEventListener('click', () => {
                selectedStyleTag = style;
                stylesModal.classList.add('hidden');
                stylesModal.classList.remove('flex');
                
                // Visual feedback
                if(btnOpenStyles) {
                    btnOpenStyles.classList.add('border-brand', 'bg-brand/10', 'text-white');
                    btnOpenStyles.classList.remove('border-white/20', 'bg-surface', 'text-gray-400');
                    btnOpenStyles.innerHTML = `
                        <div class="w-full h-full rounded-2xl overflow-hidden relative">
                            <img src="${displayImg}" class="w-full h-full object-cover opacity-60">
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <i class="fa-solid fa-check text-xl mb-1 text-white drop-shadow-md"></i>
                                <span class="text-[10px] font-medium text-white drop-shadow-md truncate max-w-full px-1">${style.name}</span>
                            </div>
                        </div>
                    `;
                }
            });
            stylesGridContent.appendChild(btn);
        });
    }

    if (btnOpenStyles && stylesModal) {
        btnOpenStyles.addEventListener('click', () => {
            renderStylesGrid();
            stylesModal.classList.remove('hidden');
            stylesModal.classList.add('flex');
        });

        closeStylesModal.addEventListener('click', () => {
            stylesModal.classList.add('hidden');
            stylesModal.classList.remove('flex');
        });
    }

    // Create custom style events
    if (btnCreateStyle && createStyleModal) {
        btnCreateStyle.addEventListener('click', () => {
            createStyleModal.classList.remove('hidden');
            createStyleModal.classList.add('flex');
        });

        closeCreateStyleModal.addEventListener('click', () => {
            createStyleModal.classList.add('hidden');
            createStyleModal.classList.remove('flex');
        });

        saveNewStyleBtn.addEventListener('click', () => {
            const name = newStyleName.value.trim().toLowerCase().replace(/\s+/g, '-');
            const direction = newStyleDirection.value.trim();
            
            if (name && direction) {
                customStyles.unshift({
                    name: name,
                    prompt: direction,
                    img: null // user can't upload yet, we use fallback
                });
                localStorage.setItem('customStyles', JSON.stringify(customStyles));
                
                newStyleName.value = '';
                newStyleDirection.value = '';
                
                createStyleModal.classList.add('hidden');
                createStyleModal.classList.remove('flex');
                renderStylesGrid(); // refresh grid
            }
        });
    }

    // Camera Angle Logic
    const cameraAngleRangeY = document.getElementById('camera-angle-range-y');
    const cameraAngleRangeX = document.getElementById('camera-angle-range-x');
    const cameraAngleValueY = document.getElementById('camera-angle-value-y');
    const cameraAngleValueX = document.getElementById('camera-angle-value-x');
    const cameraCube = document.getElementById('camera-cube');

    function updateCameraCube() {
        if (!cameraCube) return;
        const valY = cameraAngleRangeY ? parseInt(cameraAngleRangeY.value) : 0;
        const valX = cameraAngleRangeX ? parseInt(cameraAngleRangeX.value) : 0;
        cameraCube.style.transform = `rotateX(${valY}deg) rotateY(${valX}deg)`;
    }

    if (cameraAngleRangeY && cameraAngleValueY) {
        cameraAngleRangeY.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            let label = "Frontal";
            if (val >= 20 && val < 80) label = "High Angle";
            else if (val >= 80) label = "Top Down";
            else if (val <= -20 && val > -80) label = "Low Angle";
            else if (val <= -80) label = "Worm's Eye";
            cameraAngleValueY.textContent = `Vertical: ${val}° (${label})`;
            updateCameraCube();
        });
    }

    if (cameraAngleRangeX && cameraAngleValueX) {
        cameraAngleRangeX.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            let label = "Centro";
            if (val >= 20 && val < 80) label = "Direita";
            else if (val >= 80) label = "Perfil Direito";
            else if (val <= -20 && val > -80) label = "Esquerda";
            else if (val <= -80) label = "Perfil Esquerdo";
            cameraAngleValueX.textContent = `Lateral: ${val}° (${label})`;
            updateCameraCube();
        });
    }

    const loadingPhrases = [
        "Analisando prompt & brandbook...",
        "Aplicando color grading da marca...",
        "Renderizando texturas em alta resolução...",
        "Finalizando detalhes..."
    ];

    generateBtn.addEventListener('click', async () => {
        const promptInput = document.getElementById('prompt-input').value;
        // Usa a variável global selectedBrandIndex
        
        let currentBrand = "Sem Marca";
        let brandStyle = "";
        let brandbookAttached = "";

        if (selectedBrandIndex !== null && brands[selectedBrandIndex]) {
            currentBrand = brands[selectedBrandIndex].name;
            brandStyle = brands[selectedBrandIndex].direction || "";
            if (brands[selectedBrandIndex].brandbook) {
                brandbookAttached = ` (Brandbook Reference: ${brands[selectedBrandIndex].brandbook})`;
            }
        }

        const styleSelect = selectedStyleTag.prompt; // Use the actual prompt direction

        if(!promptInput.trim()) {
            document.getElementById('prompt-input').classList.add('border-red-500');
            setTimeout(() => document.getElementById('prompt-input').classList.remove('border-red-500'), 1000);
            return;
        }

        // Setup loading UI
        loadingState.classList.remove('hidden');
        if(emptyState) emptyState.classList.add('hidden');
        
        const existingImg = resultContainer.querySelector('img.img-reveal');
        if(existingImg) existingImg.classList.add('opacity-50', 'blur-sm');

        let phraseIndex = 0;
        const phraseInterval = setInterval(() => {
            phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
            loadingText.textContent = loadingPhrases[phraseIndex];
        }, 1500);

        let cameraPromptY = "eye level shot";
        let cameraPromptX = "frontal view";
        
        if (cameraAngleRangeY) {
            const valY = parseInt(cameraAngleRangeY.value);
            if (valY >= 20 && valY < 80) cameraPromptY = "high angle shot, looking down";
            else if (valY >= 80) cameraPromptY = "top down shot, bird's eye view";
            else if (valY <= -20 && valY > -80) cameraPromptY = "low angle shot, looking up";
            else if (valY <= -80) cameraPromptY = "worm's eye view, extreme low angle";
        }
        
        if (cameraAngleRangeX) {
            const valX = parseInt(cameraAngleRangeX.value);
            if (valX >= 20 && valX < 80) cameraPromptX = "shot from the right side";
            else if (valX >= 80) cameraPromptX = "profile shot from the right";
            else if (valX <= -20 && valX > -80) cameraPromptX = "shot from the left side";
            else if (valX <= -80) cameraPromptX = "profile shot from the left";
        }

        let characterPrompt = "";
        if (typeof characterReference !== 'undefined' && characterReference.trim() !== "") {
            characterPrompt = ` Character Reference: ${characterReference}.`;
        }

        const cameraPrompt = ` Camera Angle: ${cameraPromptY}, ${cameraPromptX}.`;

        const finalPrompt = `Subject: ${promptInput}. Brand Direction: ${brandStyle}${brandbookAttached}.${characterPrompt}${cameraPrompt} Style: ${styleSelect}. Masterpiece, 8k, highly detailed.`;
        console.log(`[Frontend] Enviando para Backend Ponte: ${finalPrompt}`);

        try {
            const selectedFormats = Array.from(document.querySelectorAll('.format-btn.active')).map(b => b.getAttribute('data-format'));

            const response = await fetch('/api/generate-krea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: finalPrompt,
                    formats: selectedFormats, // Send array of formats
                    style: styleSelect
                })
            });

            if (!response.ok) throw new Error("Erro no servidor ponte");
            const data = await response.json();
            
            // Fallback for demo if API fails silently or has no key
            const baseImageUrl = data.image_url || `https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&auto=format&fit=crop`;

            clearInterval(phraseInterval);
            loadingState.classList.add('hidden');
            
            const existingImgs = resultContainer.querySelectorAll('.img-container, img.img-reveal');
            existingImgs.forEach(el => el.remove());
            
            resultContainer.className = 'relative w-full h-full flex flex-wrap items-center justify-center p-8 gap-8 overflow-y-auto custom-scrollbar content-center';

            selectedFormats.forEach((fmt, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'img-container relative flex items-center justify-center shadow-2xl rounded-xl ring-1 ring-white/10';
                
                if(fmt === '1:1') imgContainer.classList.add('aspect-square', 'w-full', 'max-w-sm');
                else if(fmt === '16:9') imgContainer.classList.add('aspect-video', 'w-full', 'max-w-lg');
                else if(fmt === '9:16') imgContainer.classList.add('aspect-[9/16]', 'w-full', 'max-w-[260px]');
                else if(fmt === '2:3') imgContainer.classList.add('aspect-[2/3]', 'w-full', 'max-w-[280px]');
                else if(fmt === '3:4') imgContainer.classList.add('aspect-[3/4]', 'w-full', 'max-w-[320px]');
                else if(fmt === '4:3') imgContainer.classList.add('aspect-[4/3]', 'w-full', 'max-w-[400px]');
                else imgContainer.classList.add('aspect-square', 'w-full', 'max-w-sm'); // fallback for the others

                const img = document.createElement('img');
                img.src = `${baseImageUrl}&w=800&random=${Math.random() + index}`;
                img.className = 'w-full h-full object-cover rounded-xl img-reveal';
                
                imgContainer.appendChild(img);
                resultContainer.appendChild(imgContainer);
            });

        } catch (error) {
            console.error("Erro ao gerar:", error);
            clearInterval(phraseInterval);
            loadingState.classList.add('hidden');
            if(emptyState) emptyState.classList.remove('hidden');
            
            generateBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-red-500"></i>';
            setTimeout(() => generateBtn.innerHTML = '<i class="fa-solid fa-paper-plane text-sm"></i>', 2000);
        }
    });
});
