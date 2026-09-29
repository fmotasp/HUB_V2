const fs = require('fs');

let py = fs.readFileSync('rembg_server.py', 'utf8');

py = py.replace('output_data = remove(input_data)', 
\`output_data = remove(
        input_data,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10
    )\`);

fs.writeFileSync('rembg_server.py', py);
console.log('Fixed rembg alpha matting');
