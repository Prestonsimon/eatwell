// server.js
import express from 'express';
import 'dotenv/config';

// 1. Re-import the path module for use with path.join()
import path from 'path'; 
import { fileURLToPath } from 'url';

// Use the port provided by the hosting environment, or default to 3001 for local testing
const PORT = process.env.PORT || 3001;
const app = express();

// --- Fix for __dirname and __filename in ESM ---
// Use the path object (imported above) to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
// ----------------------------------------------

// 1. Serve static files from the 'dist' folder (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Define a simple API route
app.get('/api/status', (req, res) => {
    res.json({ message: 'Server is running and operational!' });
});

// 3. ROOT PATH HANDLER (Only serves the index page on the root request)
// This is the simplest fix for the persistent PathError.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 4. Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});