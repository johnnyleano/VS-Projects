import express from 'express';
import weaviate from 'weaviate-ts-client';
import { readFileSync, unlinkSync } from 'fs';
import multer from 'multer';
import path from 'path';

const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Weaviate client setup
const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle image search
app.post('/search', upload.array('images'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No images selected for search');
    }

    try {
        let searchResults = [];
        for (const file of req.files) {
            const img = readFileSync(file.path);
            const b64 = Buffer.from(img).toString('base64');
            unlinkSync(file.path); // Clean up uploaded file

            const resImage = await client.graphql.get()
                .withClassName('Meme')
                .withFields(['image'])
                .withNearImage({ image: b64 })
                .withLimit(1)
                .do();

            searchResults.push(...resImage.data.Get.Meme);
        }
        res.json(searchResults);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred during the search');
    }
});

// Route to handle new image uploads
app.post('/upload', upload.array('newImages'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded');
    }

    try {
        for (const file of req.files) {
            const img = readFileSync(file.path);
            const b64 = Buffer.from(img).toString('base64');
            unlinkSync(file.path); // Clean up uploaded file

            await client.data.creator()
                .withClassName('Meme')
                .withProperties({ image: b64 })
                .do();
        }
        res.send('Images uploaded successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred during upload');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


