const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

const refLogic = `
    // Reference Image Upload Logic
    const refUploadInput = document.getElementById('reference-upload-input');
    if (refUploadInput) {
        refUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const dropZone = refUploadInput.previousElementSibling;
                    dropZone.innerHTML = \`<img src="\${evt.target.result}" class="w-full h-32 object-cover rounded-lg mb-2"> <span class="text-xs text-brand font-medium">Imagem Adicionada</span>\`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
`;

// Insert it right after btnUploadRembg logic
js = js.replace('// Custom Styles Implementation', refLogic + '\n    // Custom Styles Implementation');
fs.writeFileSync('app.js', js);
console.log('Added reference image logic');
