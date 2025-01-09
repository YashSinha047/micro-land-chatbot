// models/Reminder.js
const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  medicationName: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
});

module.exports = mongoose.model('Reminder', ReminderSchema);

