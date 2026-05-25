import { getDocumentProxy, extractText } from 'unpdf';
import mammoth from 'mammoth';

export async function extractTextFromPdfUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  
  // Check if it's explicitly a docx or if PDF parsing fails
  const isDocx = url.toLowerCase().includes('.docx') || 
                 response.headers.get('content-type')?.includes('wordprocessingml');

  if (isDocx) {
    const nodeBuffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer: nodeBuffer });
    return result.value;
  }

  try {
    const buffer = new Uint8Array(arrayBuffer);
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  } catch (error) {
    // If PDF parse fails (e.g. it was a docx without extension), try mammoth as fallback
    if (error.name === 'InvalidPDFException' || error.message?.includes('Invalid PDF')) {
      console.log('   [1.5/3] Invalid PDF detected, attempting DOCX extraction fallback...');
      const nodeBuffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer: nodeBuffer });
      if (result.value) return result.value;
    }
    throw error;
  }
}
