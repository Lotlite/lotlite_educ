const Blog = require('../models/Blog');
const BitlanceAI = require("bitlance-ai-sdk");

// 1. Generate Blog via external API
exports.generateBlog = async (req, res) => {
  try {
    const ai = new BitlanceAI(process.env.BITLANCE_API_KEY, {
      baseURL: 'https://api.bitlancetechhub.com/api/v1'
    });
    
    const { topic, audience, industry, keywords, language, length, style, image_option } = req.body;
    
    const data = await ai.generateSEO({
      topic,
      industry,
      keywords,
      length
    });
    
    // Attempt to automatically convert external generator image to Bunny URL
    if (data && data.imageUrl) {
      try {
        const { processImageUrl } = require('../services/bunnyService');
        data.imageUrl = await processImageUrl(data.imageUrl);
      } catch (err) {
        console.error('Error processing image to Bunny on generate:', err);
      }
    }

    // Normalize SDK response to match frontend and database schema expectations
    if (data) {
      data.success = true;
      data.article = data.content || data.article || '';
      data.markdown = data.content || data.markdown || '';
      data.seoTitle = data.meta_title || data.title || data.seoTitle || '';
    }

    res.json(data);
  } catch (error) {
    console.error('Error generating blog:', error);
    res.status(500).json({ error: 'Failed to generate blog from external API' });
  }
};

// 2. Save the generated blog to the database
exports.saveBlog = async (req, res) => {
  try {
    const blogData = req.body;

    // Normalize array fields to strings (SDK may return arrays for string schema fields)
    if (Array.isArray(blogData.keywords)) {
      blogData.keywords = blogData.keywords.join(', ');
    }
    if (Array.isArray(blogData.entities)) {
      blogData.entities = blogData.entities.join(', ');
    }
    
    // Process image to Bunny Storage if it's base64 or an external URL
    if (blogData.imageUrl) {
      try {
        const { processImageUrl } = require('../services/bunnyService');
        blogData.imageUrl = await processImageUrl(blogData.imageUrl);
      } catch (err) {
        console.error('Error processing image to Bunny on save:', err);
      }
    }
    
    // Generate a URL-friendly slug if not present
    if (!blogData.slug) {
      const baseString = blogData.seoTitle || blogData.topic || blogData.title || 'blog-post';
      blogData.slug = baseString
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      // Append a random string to avoid duplicate slugs just in case
      blogData.slug += '-' + Math.random().toString(36).substring(2, 6);
    }
    
    // If _id exists, update the existing blog
    if (blogData._id) {
      const updatedBlog = await Blog.findByIdAndUpdate(blogData._id, blogData, { new: true });
      console.log(`✅ Successfully updated blog: ${updatedBlog._id} - ${updatedBlog.seoTitle || updatedBlog.topic}`);
      return res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    }

    // Otherwise, create a new blog
    const newBlog = new Blog(blogData);
    await newBlog.save();
    console.log(`✅ Successfully created new blog: ${newBlog._id} - ${newBlog.seoTitle || newBlog.topic}`);
    res.status(201).json({ message: 'Blog saved successfully', blog: newBlog });
  } catch (error) {
    console.error('Error saving blog:', error);
    res.status(500).json({ error: 'Failed to save blog to database' });
  }
};

// 3. Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// 4. Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};
// 5. Delete blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    console.log(`🗑️ Successfully deleted blog: ${req.params.id}`);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
