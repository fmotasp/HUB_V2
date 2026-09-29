const fs = require('fs');

let js = fs.readFileSync('app.js', 'utf8');

const newModalsLogic = `
    // New Modals for Clients and Formats
    const clientsModal = document.getElementById('clients-modal');
    const btnOpenClients = document.getElementById('btn-open-clients');
    const closeClientsModal = document.getElementById('close-clients-modal');

    const formatsModal = document.getElementById('formats-modal');
    const btnOpenFormats = document.getElementById('btn-open-formats');
    const closeFormatsModal = document.getElementById('close-formats-modal');

    if (btnOpenClients && clientsModal && closeClientsModal) {
        btnOpenClients.addEventListener('click', () => {
            clientsModal.classList.remove('hidden');
            clientsModal.classList.add('flex');
        });
        closeClientsModal.addEventListener('click', () => {
            clientsModal.classList.add('hidden');
            clientsModal.classList.remove('flex');
        });
    }

    if (btnOpenFormats && formatsModal && closeFormatsModal) {
        btnOpenFormats.addEventListener('click', () => {
            formatsModal.classList.remove('hidden');
            formatsModal.classList.add('flex');
        });
        closeFormatsModal.addEventListener('click', () => {
            formatsModal.classList.add('hidden');
            formatsModal.classList.remove('flex');
        });
    }

    // Update labels when things change
    function updateFormatLabel(formatStr) {
        const label = document.getElementById('selected-format-label');
        if (label) label.textContent = formatStr;
    }
`;

// Insert after existing modal logic
js = js.replace('// Styles Modal Logic', newModalsLogic + '\n    // Styles Modal Logic');

// Inside formatBtns click listener, we need to call updateFormatLabel
js = js.replace("updateFormatPreview(btn.getAttribute('data-format'));", "updateFormatPreview(btn.getAttribute('data-format'));\n                updateFormatLabel(btn.getAttribute('data-format'));");

// Inside renderBrandGrid, we need to update the client label when selected
js = js.replace("selectedBrandIndex = index;", "selectedBrandIndex = index;\n                const label = document.getElementById('selected-client-label');\n                if (label) label.textContent = brand.name;\n                if(clientsModal) { clientsModal.classList.add('hidden'); clientsModal.classList.remove('flex'); }");

// Inside styles modal logic, when a style is picked, update the style label
js = js.replace("stylesModal.classList.add('hidden');", "stylesModal.classList.add('hidden');\n                const label = document.getElementById('selected-style-label');\n                if (label) label.textContent = style.name;");

fs.writeFileSync('app.js', js);
console.log('app.js updated successfully');
