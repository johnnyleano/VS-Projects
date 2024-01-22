import express from 'express';
import weaviate from 'weaviate-ts-client';
import { readFileSync, unlinkSync } from 'fs';
import multer from 'multer';
import path from 'path';

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/search', upload.single('image'), async (req, res) => {
    // Add your image search logic here
});

app.post('/upload', upload.array('image'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No image file uploaded');
        }
        // Add your image upload logic here
        res.send('Image uploaded successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred during upload');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



