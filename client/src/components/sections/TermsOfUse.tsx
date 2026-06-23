import { motion } from 'motion/react';
import PageSEO from '../PageSEO';

export default function TermsOfUse() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 relative z-10 text-black dark:text-white">
      <PageSEO
        title="Terms of Use"
        description="Read the Terms of Use for Lotlite Edu. Learn about the rules governing use of our website and academic services."
        canonical="/terms-of-use"
        noIndex={true}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose dark:prose-invert prose-wine max-w-none"
      >
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight">Terms of Use</h1>
        <p className="text-sm text-neutral-500 mb-8">Last Updated: June 2026</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using the Lotlite SIEC website, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials on Lotlite SIEC's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h2>3. Disclaimer</h2>
        <p>
          The materials on Lotlite SIEC's website are provided on an 'as is' basis. Lotlite SIEC makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall Lotlite SIEC or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Lotlite SIEC's website.
        </p>

        <h2>5. Revisions and Errata</h2>
        <p>
          The materials appearing on Lotlite SIEC's website could include technical, typographical, or photographic errors. Lotlite SIEC does not warrant that any of the materials on its website are accurate, complete, or current.
        </p>
      </motion.div>
    </div>
  );
}
