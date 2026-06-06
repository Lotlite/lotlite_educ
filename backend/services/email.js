import nodemailer from 'nodemailer';

// ─── Mailtrap SMTP transporter ────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});

const FROM = `"${process.env.MAILTRAP_FROM_NAME || 'Lotlite ATS'}" <${process.env.MAILTRAP_FROM_EMAIL || 'noreply@lotlite.com'}>`;

// ─── Shortlisted plain text ───────────────────────────────────────────────────
function shortlistedText({ candidateName, jobTitle }) {
  return `Dear ${candidateName},

Congratulations! We are pleased to inform you that after carefully reviewing your application, you have been SHORTLISTED for the ${jobTitle} position.

Our recruitment team will be in touch shortly with the next steps. We look forward to learning more about you during the interview process.

What's Next?
You will receive a follow-up email or call from our team to schedule your interview. Please keep an eye on your inbox.

Best regards,
${process.env.MAILTRAP_FROM_NAME || 'Lotlite Talent Acquisition'}

---
This is an automated notification from the Lotlite ATS platform. Please do not reply to this email.`;
}

// ─── Not shortlisted plain text ───────────────────────────────────────────────
function notShortlistedText({ candidateName, jobTitle, atsScore, missingSkills = [] }) {
  const skillsSection = missingSkills.length > 0
    ? `Skills to Develop for Future Applications:\n${missingSkills.map(s => `  - ${s}`).join('\n')}\n\n`
    : '';

  return `Dear ${candidateName},

Thank you for taking the time to apply for the ${jobTitle} position. After carefully reviewing your application, we regret to inform you that you have not been shortlisted for this role at this time.

-- Your ATS Screening Result --
ATS Score:  ${atsScore}%
--------------------------------

${skillsSection}This decision does not reflect negatively on your overall skills and experience. We encourage you to continue developing your expertise and to apply for future positions that may be a better match.

We appreciate your interest and wish you the very best in your career journey. Please feel free to apply for other roles in the future.

Best regards,
${process.env.MAILTRAP_FROM_NAME || 'Lotlite Talent Acquisition'}

---
This is an automated notification from the Lotlite ATS platform. Please do not reply to this email.`;
}

// ─── Public send functions ────────────────────────────────────────────────────
export async function sendShortlistedEmail({ to, candidateName, jobTitle }) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Congratulations! You've been shortlisted for ${jobTitle}`,
    text: shortlistedText({ candidateName, jobTitle }),
  });
}

export async function sendNotShortlistedEmail({ to, candidateName, jobTitle, atsScore, missingSkills }) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Your application update for ${jobTitle}`,
    text: notShortlistedText({ candidateName, jobTitle, atsScore, missingSkills }),
  });
}
