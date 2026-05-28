/**
 * Parses a candidate name and fallback email from a resume filename.
 * e.g. "John_Doe_Resume.pdf" → { name: "John Doe", email: "john.doe@example.com" }
 */
export function parseCandidateDetailsFromFileName(fileName) {
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  let cleanName = baseName
    .replace(/[_-]/g, ' ')
    .replace(/\b(resume|cv|pdf|docx|uploaded|profile|draft|job|apply)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanName) cleanName = baseName;

  const words = cleanName.split(' ').filter(Boolean);

  const name = words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || 'Unknown Candidate';

  const emailHandle = words.map(w => w.toLowerCase()).join('.');
  const email = emailHandle ? `${emailHandle}@example.com` : 'candidate@example.com';

  return { name, email };
}
