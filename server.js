const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Permite o envio de grandes quantidades de dados JSON (imagens base64)
app.use(bodyParser.json({ limit: '50mb' }));

// Cria a pasta "uploads" automaticamente, se não existir
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Rota para receber a imagem
app.post('/upload-image', (req, res) => {
    const imageData = req.body.image; // Base64 da imagem
    const base64Data = imageData.replace(/^data:image\/png;base64,/, ''); // Remove o prefixo Base64

    // Define um nome único para a imagem (com timestamp)
    const fileName = `image_${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);

    // Salva a imagem na pasta "uploads"
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Erro ao salvar a imagem:', err);
            return res.status(500).json({ error: 'Erro ao salvar a imagem' });
        }
        console.log(`Imagem salva com sucesso em: ${filePath}`);
        res.json({ message: 'Imagem salva com sucesso!', filePath });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Imagens serão salvas em: ${uploadDir}`);
});
