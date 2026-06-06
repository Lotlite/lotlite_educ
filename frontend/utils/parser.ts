/**
 * Helper utility to parse candidate name and email from file name.
 * e.g., "John_Doe_Resume.pdf" -> Name: "John Doe", Email: "john.doe@example.com"
 */
export function parseCandidateDetailsFromFileName(fileName: string): { name: string; email: string } {
  // Strip extension
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  
  // Replace symbols/delimiters with spaces, keep alphanumeric and standard characters
  let cleanName = baseName
    .replace(/[_-]/g, ' ')
    .replace(/\b(resume|cv|pdf|docx|uploaded|profile|draft|job|apply)\b/gi, '') // filter common keywords
    .replace(/\s+/g, ' ')
    .trim();

  // If empty after clean up, fallback to base name
  if (!cleanName) {
    cleanName = baseName;
  }

  // Capitalize words
  const words = cleanName.split(' ');
  const capitalizedName = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Create simple email handle
  const emailHandle = words.map(w => w.toLowerCase()).filter(Boolean).join('.');
  const email = emailHandle ? `${emailHandle}@example.com` : 'candidate@example.com';

  return {
    name: capitalizedName || 'Unknown Candidate',
    email: email
  };
}
