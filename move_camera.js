const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The 3D Camera block regex
const cameraRegex = /<div class="mt-6">\s*<div class="flex items-center justify-between mb-3">\s*<label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Ângulo da Câmera 3D<\/label>[\s\S]*?<!-- Horizontal Slider -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const cameraMatch = html.match(cameraRegex);
if (!cameraMatch) {
    console.log("Could not find camera block!");
    process.exit(1);
}

const cameraHtml = cameraMatch[0];

// Remove the camera block from its current place
html = html.replace(cameraRegex, '');

// Create the new floating panel container
// I will adjust mt-6 to mb-0 and give it a clean wrapper
const newFloatingCamera = `
    <!-- 3D Camera Floating Panel (Top Right) -->
    <div id="floating-camera-panel" class="absolute top-20 right-6 z-20 bg-[#151515]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-2xl w-[300px] animate-in slide-in-from-right-8 duration-300">
        ${cameraHtml.replace('<div class="mt-6">', '<div class="mt-0">').replace('Ângulo da Câmera 3D', '<i class="fa-solid fa-camera opacity-50 mr-2"></i>Ângulo 3D')}
    </div>
`;

// Insert it into <main>, just after the Canvas Toolbar
html = html.replace('<!-- Canvas Toolbar -->', '<!-- Canvas Toolbar -->\n' + newFloatingCamera);

fs.writeFileSync('index.html', html);
console.log("Moved camera to floating panel");
