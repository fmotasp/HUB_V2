require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite que o frontend acesse este servidor
app.use(express.json()); // Permite interpretar o JSON
app.use(express.static(__dirname)); // Serve o index.html, app.js e CSS

// Rota de Geração - Ponte com o Krea
app.post('/api/generate-krea', async (req, res) => {
    try {
        const { prompt, format, style } = req.body;
        
        console.log(`[Backend] Recebido pedido para gerar: ${prompt}`);

        // 1. Submit the generation request to Krea
        const kreaResponse = await fetch('https://api.krea.ai/generate/image/krea/krea-2/medium', {
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

app.listen(port, () => {
    console.log(`🚀 Servidor Ponte do Hub rodando em http://localhost:${port}`);
    console.log(`🔑 KREA_API_KEY configurada: ${process.env.KREA_API_KEY ? 'Sim' : 'Não'}`);
});
module.exports = app;
