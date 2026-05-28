export function validateAnalyzeRequest(req, res, next) {
  const { resume_url, job_title, job_description } = req.body;

  if (!resume_url) {
    return res.status(400).json({ error: 'Missing required field: resume_url' });
  }

  try {
    new URL(resume_url);
  } catch {
    return res.status(400).json({ error: 'Invalid resume_url — must be a valid URL' });
  }

  if (!job_title || typeof job_title !== 'string' || !job_title.trim()) {
    return res.status(400).json({ error: 'Missing required field: job_title' });
  }

  if (!job_description || typeof job_description !== 'string' || !job_description.trim()) {
    return res.status(400).json({ error: 'Missing required field: job_description' });
  }

  next();
}
