const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const crypto = require('crypto');

const uploadToBunny = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const {
      BUNNY_STORAGE_ZONE_NAME,
      BUNNY_API_KEY,
      BUNNY_PULL_ZONE_URL,
      BUNNY_REGION
    } = process.env;

    console.log('--- Bunny Upload Request Initiated ---');
    console.log('File:', req.file.originalname, 'Size:', req.file.size);
    console.log('BUNNY_STORAGE_ZONE_NAME:', BUNNY_STORAGE_ZONE_NAME);
    console.log('BUNNY_PULL_ZONE_URL:', BUNNY_PULL_ZONE_URL);
    console.log('BUNNY_REGION:', BUNNY_REGION);

    if (!BUNNY_STORAGE_ZONE_NAME || !BUNNY_API_KEY || !BUNNY_PULL_ZONE_URL) {
      console.error('Missing Bunny Edge Storage Configuration');
      return res.status(500).json({ message: 'Bunny Edge Storage configuration is missing.' });
    }

    // Determine Base URL based on region
    let hostname = 'storage.bunnycdn.com';
    if (BUNNY_REGION) {
      hostname = `${BUNNY_REGION}.storage.bunnycdn.com`;
    }

    // Generate a unique filename to avoid collisions
    const fileExtension = path.extname(req.file.originalname);
    const uniqueFilename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${fileExtension}`;
    
    // Construct the storage URL
    const url = `https://${hostname}/${BUNNY_STORAGE_ZONE_NAME}/${uniqueFilename}`;
    console.log('Uploading to Bunny URL:', url);

    // Upload to Bunny Edge Storage using PUT
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Content-Type': req.file.mimetype || 'application/octet-stream',
      },
      body: req.file.buffer
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('--- Bunny Storage Upload Failed ---');
      console.error('Status:', response.status);
      console.error('Response Text:', text);
      return res.status(response.status).json({ message: 'Failed to upload to Bunny Storage', details: text });
    }

    // Return the pull zone URL
    const publicUrl = `${BUNNY_PULL_ZONE_URL}/${uniqueFilename}`;
    console.log('--- Bunny Storage Upload Success ---');
    console.log('Public URL:', publicUrl);
    
    res.status(200).json({ 
      success: true,
      url: publicUrl,
      filename: uniqueFilename 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Internal server error during upload', error: error.message });
  }
};

module.exports = {
  uploadToBunny
};
