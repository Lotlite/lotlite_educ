const BitlanceAI = require('bitlance-ai-sdk');

exports.generateBlog = async (req, res) => {
  try {
    const { topic, industry, keywords } = req.body;

    // Validate that at least topic or industry is provided
    if (!topic && !industry) {
      return res.status(400).json({ error: 'Either topic or industry must be provided.' });
    }

    // Initialize SDK with production URL
    console.log(`Starting blog generation for topic: ${topic}, industry: ${industry}`);
    console.log(`Payload:`, { topic, industry, keywords });
    const bitlance = new BitlanceAI(process.env.BITLANCE_API_KEY, {
      baseURL: 'https://api.bitlancetechhub.com/api/v1'
    });

    // Generate SEO content
    console.log("Calling bitlance.generateSEO...");
    const result = await bitlance.generateSEO({
      topic,
      industry,
      keywords,
      length: "Medium (500-1000 words)",
      language: "English"
    });
    console.log("Blog generation API call successful");

    // Return markdown and seoTitle
    return res.json({
      markdown: result.markdown || result.content,
      seoTitle: result.seoTitle || result.meta_title || result.title
    });

  } catch (error) {
    if (error.name === 'BitlanceAIError') {
      console.error("API Error:", error.message);
      return res.status(400).json({ error: error.message });
    } else {
      console.error("Unknown Error:", error);
      return res.status(500).json({ error: 'An unexpected error occurred during generation.' });
    }
  }
};
