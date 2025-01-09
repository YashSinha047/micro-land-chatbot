// routes/medicalHistory.js
const Reminder = require('../models/Reminder');

// Save medical history data
exports.savereminder = async (req, res) => {
    const { email, medicationName, dosage, frequency, startDate, endDate } = req.body;
    try {
      const newReminder = new Reminder({ email, medicationName, dosage, frequency, startDate, endDate });
      await newReminder.save();
      res.status(200).json({ message: "Reminder added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add reminder" });
    }
  };

// Fetch medical history data for a user
exports.fetchreminder = async (req, res) => {
    const { email } = req.body;
    try {
      const reminders = await Reminder.find({ email });
      res.status(200).json({ reminders });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  };


