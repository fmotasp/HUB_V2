from flask import Flask, request, send_file
from rembg import remove
import io

app = Flask(__name__)

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return {"error": "Nenhuma imagem enviada"}, 400
    
    file = request.files['image']
    input_data = file.read()
    
    # Remove o fundo com Alpha Matting para suavizar bordas (cabelo, etc)
    output_data = remove(
        input_data,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10
    )
    
    # Retorna a imagem processada como PNG
    return send_file(
        io.BytesIO(output_data),
        mimetype='image/png'
    )

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
