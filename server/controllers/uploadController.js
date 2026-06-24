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

    const fs = require('fs');
    const fileStream = fs.createReadStream(req.file.path);

    // Upload to Bunny Edge Storage using PUT
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Content-Type': req.file.mimetype || 'application/octet-stream',
      },
      body: fileStream
    });

    // Cleanup temp file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
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

const deleteFromBunny = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: 'No file URL provided' });
    }

    const {
      BUNNY_STORAGE_ZONE_NAME,
      BUNNY_API_KEY,
      BUNNY_PULL_ZONE_URL,
      BUNNY_REGION
    } = process.env;

    if (!BUNNY_STORAGE_ZONE_NAME || !BUNNY_API_KEY || !BUNNY_PULL_ZONE_URL) {
      return res.status(500).json({ message: 'Bunny Edge Storage configuration is missing.' });
    }

    // Extract filename from the pull zone URL
    const filename = fileUrl.replace(BUNNY_PULL_ZONE_URL + '/', '').split('?')[0];

    if (!filename) {
      return res.status(400).json({ message: 'Could not extract filename from URL' });
    }

    let hostname = 'storage.bunnycdn.com';
    if (BUNNY_REGION) {
      hostname = `${BUNNY_REGION}.storage.bunnycdn.com`;
    }

    const deleteUrl = `https://${hostname}/${BUNNY_STORAGE_ZONE_NAME}/${filename}`;
    console.log('Deleting from Bunny URL:', deleteUrl);

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'AccessKey': BUNNY_API_KEY,
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Bunny Delete Failed:', response.status, text);
      return res.status(response.status).json({ message: 'Failed to delete from Bunny Storage', details: text });
    }

    console.log('Bunny Delete Success:', filename);
    res.status(200).json({ success: true, message: 'File deleted from Bunny Storage' });

  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Internal server error during delete', error: error.message });
  }
};

module.exports = {
  uploadToBunny,
  deleteFromBunny
};
