/**
 * Formats a byte count to a human-readable string (KB / MB / GB).
 * e.g. formatFileSize(1048576) → "1.0 MB"
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Formats a date to the standard display string used across the app.
 * e.g. formatAppliedAt(new Date()) → "May 28, 2026, 11:02 AM"
 */
export function formatAppliedAt(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
