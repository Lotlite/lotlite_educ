const crypto = require('crypto');

const uploadBufferToBunny = async (buffer, mimetype, originalFilename) => {
  const {
    BUNNY_STORAGE_ZONE_NAME,
    BUNNY_API_KEY,
    BUNNY_PULL_ZONE_URL,
    BUNNY_REGION
  } = process.env;

  if (!BUNNY_STORAGE_ZONE_NAME || !BUNNY_API_KEY || !BUNNY_PULL_ZONE_URL) {
    throw new Error('Bunny Edge Storage configuration is missing.');
  }

  let hostname = 'storage.bunnycdn.com';
  if (BUNNY_REGION) {
    hostname = `${BUNNY_REGION}.storage.bunnycdn.com`;
  }

  const fetch = await import('node-fetch').then(m => m.default);

  const fileExtension = originalFilename.includes('.') ? originalFilename.substring(originalFilename.lastIndexOf('.')) : '.jpg';
  const uniqueFilename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${fileExtension}`;
  const url = `https://${hostname}/${BUNNY_STORAGE_ZONE_NAME}/${uniqueFilename}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': mimetype || 'application/octet-stream',
    },
    body: buffer
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upload to Bunny Storage: ${text}`);
  }

  return `${BUNNY_PULL_ZONE_URL}/${uniqueFilename}`;
};

const processImageUrl = async (imageUrl) => {
  if (!imageUrl) return imageUrl;

  // If it's already on bunny, skip
  const pullZone = process.env.BUNNY_PULL_ZONE_URL || 'b-cdn.net';
  if (imageUrl.includes(pullZone) || imageUrl.includes('b-cdn.net')) {
    return imageUrl;
  }

  const fetch = await import('node-fetch').then(m => m.default);

  // If it's base64
  if (imageUrl.startsWith('data:image/')) {
    const matches = imageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return imageUrl;

    const mimetype = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    let ext = '.jpg';
    if (mimetype === 'image/png') ext = '.png';
    else if (mimetype === 'image/webp') ext = '.webp';

    return await uploadBufferToBunny(buffer, mimetype, `image${ext}`);
  }

  // If it's an external HTTP URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) return imageUrl;

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimetype = response.headers.get('content-type') || 'image/jpeg';

      let ext = '.jpg';
      if (mimetype.includes('png')) ext = '.png';
      else if (mimetype.includes('webp')) ext = '.webp';

      return await uploadBufferToBunny(buffer, mimetype, `external${ext}`);
    } catch (err) {
      console.error('Failed to process external image URL:', err);
      return imageUrl; // Fallback to original if it fails
    }
  }

  return imageUrl;
};

module.exports = {
  uploadBufferToBunny,
  processImageUrl
};
