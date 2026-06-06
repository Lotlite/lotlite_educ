const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface SendEmailParams {
  candidateId: string;
  type: 'shortlisted' | 'not_shortlisted';
  to: string;
  candidateName: string;
  jobTitle: string;
  atsScore: number;
  recommendation?: string;
  missingSkills?: string[];
}

export async function sendCandidateEmail(params: SendEmailParams): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/email/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Email API error: ${res.status}`);
  }
}

interface BulkCandidate extends SendEmailParams {}

export async function sendBulkCandidateEmails(candidates: BulkCandidate[]): Promise<{ to: string; status: string; error?: string }[]> {
  const res = await fetch(`${BACKEND_URL}/api/email/send-bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidates }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Bulk email API error: ${res.status}`);
  }

  const data = await res.json();
  return data.results;
}
