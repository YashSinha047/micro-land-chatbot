// models/MedicalHistory.js
const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  email: { type: String, required: true },
  symptoms: { type: String, required: true },
  description: { type: String },
  medicines: { type: String },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
