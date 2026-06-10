const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const leadRoutes = require('./routes/leadRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const emailRoutes = require('./routes/emailRoutes');
const otpRoutes = require('./routes/otpRoutes');
const chatRoutes = require('./routes/chatRoutes');
const blogRoutes = require('./routes/blogRoutes');
const agenda = require('./config/agenda');
require('./jobs/leadJobs');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api', leadRoutes);
app.use('/api', whatsappRoutes);
app.use('/api', emailRoutes);
app.use('/api', otpRoutes);
app.use('/api', chatRoutes);
app.use('/api/blog', blogRoutes);
const authorRoutes = require('./routes/authorRoutes');
app.use('/api/author', authorRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start Agenda jobs
  try {
    await agenda.start();
    console.log('[Agenda] Scheduler started');
  } catch (err) {
    console.error('[Agenda] Failed to start:', err);
  }
});

// Force restart for .env load 2
