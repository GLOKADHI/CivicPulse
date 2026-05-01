import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the dist directory, but don't serve index.html automatically
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

// Send all other requests to the React app, but only if they don't look like asset requests
app.get('*', (req, res) => {
  // If the request is for an asset that wasn't found, don't serve index.html
  if (req.path.startsWith('/assets/') || req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
    return res.status(404).send('Asset not found');
  }
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

import fs from 'fs';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('Dist directory exists. Contents:', fs.readdirSync(distPath));
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      console.log('Assets directory contents:', fs.readdirSync(assetsPath));
    }
  } else {
    console.log('Dist directory NOT FOUND at', distPath);
  }
});
