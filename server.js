require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite que o frontend acesse este servidor
app.use(express.json({ limit: '50mb' })); // Permite interpretar o JSON com imagens grandes
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname)); // Serve o index.html, app.js e CSS

// Rota de Geração - Ponte com o Krea
app.post('/api/generate-krea', async (req, res) => {
    try {
        const { prompt, format, style, model } = req.body;
        
        console.log(`[Backend] Recebido pedido para gerar: ${prompt} usando modelo ${model}`);

        // Define URL based on selected model or default
        const kreaModelPath = model || 'krea-2/medium';
        const kreaUrl = `https://api.krea.ai/generate/image/krea/${kreaModelPath}`;

        // 1. Submit the generation request to Krea
        const kreaResponse = await fetch(kreaUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.KREA_API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                aspect_ratio: "16:9",
                resolution: "1K"
            })
        });

        if (!kreaResponse.ok) {
            const errorText = await kreaResponse.text();
            console.error('[Backend] Erro na requisição Krea:', errorText);
            return res.status(kreaResponse.status).json({ error: 'Falha na comunicação com o Krea AI' });
        }

        const job = await kreaResponse.json();
        const jobId = job.job_id;
        
        console.log(`[Backend] Job enviado! ID: ${jobId}. Aguardando conclusão...`);

        // 2. Poll for completion
        let imageUrl = null;
        while (true) {
            const statusResponse = await fetch(`https://api.krea.ai/jobs/${jobId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.KREA_API_KEY}`
                }
            });
            const statusData = await statusResponse.json();
            
            if (statusData.status === "completed") {
                imageUrl = statusData.result.urls[0];
                console.log(`[Backend] Imagem pronta: ${imageUrl}`);
                break;
            } else if (statusData.status === "failed") {
                console.error('[Backend] Falha no Job do Krea.');
                return res.status(500).json({ error: 'Geração da imagem falhou no Krea.' });
            }
            
            // Wait 5 seconds before polling again
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        res.json({ image_url: imageUrl });

    } catch (error) {
        console.error('[Backend] Erro interno:', error);
        res.status(500).json({ error: 'Erro interno no servidor ponte' });
    }
});

// Rota de Remoção de Fundo - Ponte com o Microserviço Python
app.post('/api/remove-bg', async (req, res) => {
    try {
        const { imageUrl, imageBase64 } = req.body;
        if (!imageUrl && !imageBase64) return res.status(400).json({ error: 'Nenhuma imagem fornecida' });

        let imageBuffer;

        if (imageUrl) {
            console.log(`[Backend] Removendo fundo da URL: ${imageUrl}`);
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) throw new Error('Não foi possível baixar a imagem');
            imageBuffer = await imageResponse.arrayBuffer();
        } else {
            console.log(`[Backend] Removendo fundo de imagem em Base64 (Upload local)`);
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
            imageBuffer = Buffer.from(base64Data, 'base64');
        }

        // 2. Criar formulário para enviar ao Python
        const formData = new FormData();
        formData.append('image', new Blob([imageBuffer], { type: 'image/jpeg' }), 'input.jpg');

        // 3. Enviar para o microserviço Python (rodando localmente na porta 5000)
        // ATENÇÃO: Ao hospedar na nuvem, este URL deve ser o do seu servidor Python!
        const pythonResponse = await fetch('http://127.0.0.1:5000/remove-bg', {
            method: 'POST',
            body: formData
        });

        if (!pythonResponse.ok) throw new Error('Falha no microserviço Python');
        const transparentBuffer = await pythonResponse.arrayBuffer();

        // 4. Enviar imagem transparente de volta ao frontend (em base64 para facilitar exibição)
        const base64Image = Buffer.from(transparentBuffer).toString('base64');
        res.json({ image_base64: `data:image/png;base64,${base64Image}` });

    } catch (error) {
        console.error('[Backend] Erro ao remover fundo:', error);
        res.status(500).json({ error: 'Erro ao processar remoção de fundo' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor Ponte do Hub rodando em http://localhost:${port}`);
    console.log(`🔑 KREA_API_KEY configurada: ${process.env.KREA_API_KEY ? 'Sim' : 'Não'}`);
});
module.exports = app;
