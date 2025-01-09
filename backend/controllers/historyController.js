// routes/medicalHistory.js
const express = require('express');
const MedicalHistory = require('../models/MedicalHistory');

// Save medical history data
exports.savemedicalhistory = async (req, res) => {
  try {
    const { email, symptoms, description, medicines, date } = req.body;
    const newRecord = new MedicalHistory({ email, symptoms, description, medicines, date });
    await newRecord.save();
    res.status(201).json({ message: 'Medical history added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving medical history' });
  }
};

// Fetch medical history data for a user
exports.fetchmedicalhistory = async (req, res) => {
  try {
    const { email } = req.body;
    const records = await MedicalHistory.find({ email });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching medical history' });
  }
};


