export function validateAnalyzeRequest(req, res, next) {
  const { resume_url } = req.body;
  if (!resume_url) {
    return res.status(400).json({ error: 'Missing resume_url' });
  }
  next();
}
