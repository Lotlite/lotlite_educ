const WebsiteData = require('../models/WebsiteData');

const getWebsiteData = async (req, res) => {
  try {
    const { key } = req.params;
    const doc = await WebsiteData.findOne({ key });
    if (!doc) {
      return res.status(200).json({ data: {} });
    }
    res.status(200).json(doc);
  } catch (error) {
    console.error('Error fetching website data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateWebsiteData = async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;

    const doc = await WebsiteData.findOneAndUpdate(
      { key },
      { $set: { data } },
      { new: true, upsert: true }
    );

    res.status(200).json(doc);
  } catch (error) {
    console.error('Error updating website data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getWebsiteData,
  updateWebsiteData
};
