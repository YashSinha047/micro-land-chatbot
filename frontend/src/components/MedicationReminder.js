import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MedicationReminder = () => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reminders, setReminders] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem('email')); // Retrieve email from local storage and set as state

  const historyEndRef = useRef(null); // Ref to scroll to the latest reminder

  // Fetch reminders on page load if email is available
  useEffect(() => {
    if (email) {
      fetchReminders();
    }
  }, [email]);

  // Automatically scroll to the latest reminder when the reminders update
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [reminders]);

  const fetchReminders = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/medicalReminder/fetchreminder', {
        email: email,
      });
      setReminders(response.data.reminders); // Assuming the backend sends an array of reminders
    } catch (error) {
      console.error("Error fetching reminders", error);
    }
  };

  const handleAddReminder = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/medicalReminder/addreminder', {
        email: email,
        medicationName,
        dosage,
        frequency,
        startDate,
        endDate
      });

      // Clear form fields after submission
      setMedicationName('');
      setDosage('');
      setFrequency('');
      setStartDate('');
      setEndDate('');

      // Refresh the reminders list
      fetchReminders();
    } catch (error) {
      console.error("Error adding reminder", error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Side - Fixed Form */}
      <div style={{
        width: '300px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        boxSizing: 'border-box',
      }}>
        <h2>Add Medication Reminder</h2>
        <form onSubmit={handleAddReminder}>
          <input
            type="text"
            placeholder="Medication Name"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Dosage (optional)"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Frequency (e.g., Twice daily)"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Add Reminder</button>
        </form>
      </div>

      {/* Right Side - Scrollable Reminders List */}
      <div style={{
        marginLeft: '300px', // To create space for the left form
        overflowY: 'auto',
        height: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
      }}>
        <h2>Your Medication Reminders</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {reminders.map((reminder, index) => (
            <li key={index} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <h4>Medicine: {reminder.medicationName}</h4>
              <p>Dosage: {reminder.dosage || 'N/A'}</p>
              <p>Frequency: {reminder.frequency}</p>
              <p>Start Date: {reminder.startDate}</p>
              <p>End Date: {reminder.endDate || 'N/A'}</p>
            </li>
          ))}
        </ul>

        {/* This element helps us scroll to the bottom of the reminders list */}
        <div ref={historyEndRef}></div>
      </div>
    </div>
  );
};

export default MedicationReminder;
