const Author = require('../models/Author');

// Get the single active author profile
exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findOne({ isActive: true }).sort({ updatedAt: -1 });
    if (!author) return res.status(404).json({ error: 'No author profile found' });
    res.json(author);
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({ error: 'Failed to fetch author' });
  }
};

// Create or update the author profile (upsert - only one active author)
exports.saveAuthor = async (req, res) => {
  try {
    const authorData = req.body;

    // If _id provided, update it
    if (authorData._id) {
      const updated = await Author.findByIdAndUpdate(authorData._id, authorData, { new: true });
      console.log(`✅ Author profile updated: ${updated.name}`);
      return res.json({ message: 'Author profile updated', author: updated });
    }

    // Otherwise, deactivate all existing and create a new one
    await Author.updateMany({}, { isActive: false });
    const newAuthor = new Author({ ...authorData, isActive: true });
    await newAuthor.save();
    console.log(`✅ Author profile created: ${newAuthor.name}`);
    res.status(201).json({ message: 'Author profile created', author: newAuthor });
  } catch (error) {
    console.error('Error saving author:', error);
    res.status(500).json({ error: 'Failed to save author profile' });
  }
};

// Get all author profiles
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ updatedAt: -1 });
    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
  try {
    await Author.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Author deleted: ${req.params.id}`);
    res.json({ message: 'Author deleted' });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ error: 'Failed to delete author' });
  }
};
