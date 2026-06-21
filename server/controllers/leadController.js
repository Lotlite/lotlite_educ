const leadService = require('../services/leadService');

const handleCreateLead = async (req, res) => {
  try {
    const result = await leadService.createLead(req.body);
    return res.status(200).json({
      success: true,
      message: 'Lead saved and forwarded successfully',
      data: result.lead,
      callyzerResponse: result.callyzerResponse
    });
  } catch (err) {
    console.error('[Lead Controller] Error processing lead:', err);
    if (err.status) {
      // Errors returned from Callyzer API call
      return res.status(err.status).json({
        success: false,
        error: 'Callyzer forwarding failed',
        detail: err.data
      });
    }
    // Database validation errors or connection errors
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

const handleGetLeads = async (req, res) => {
  try {
    const leads = await leadService.getAllLeads();
    return res.status(200).json({ success: true, data: leads });
  } catch (err) {
    console.error('[Lead Controller] Error fetching leads:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const handleDeleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await leadService.deleteLead(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    console.error('[Lead Controller] Error deleting lead:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const handleProxyCallyzerLead = async (req, res) => {
  try {
    const result = await leadService.proxyCallyzerLead(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[Lead Controller] Proxy Error:', err);
    if (err.status) {
      return res.status(err.status).json({ error: err.data });
    }
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

module.exports = {
  handleCreateLead,
  handleProxyCallyzerLead,
  handleGetLeads,
  handleDeleteLead
};
