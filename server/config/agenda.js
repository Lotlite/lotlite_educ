const Agenda = require('agenda');
require('dotenv').config();

const mongoConnectionString = process.env.MONGODB_URI;

const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: 'agendaJobs' },
  processEvery: '1 minute'
});

agenda.on('ready', () => {
  console.log('[Agenda] Connected to MongoDB and ready to process jobs.');
});

agenda.on('error', (err) => {
  console.error('[Agenda] Error connecting to MongoDB:', err);
});

module.exports = agenda;
