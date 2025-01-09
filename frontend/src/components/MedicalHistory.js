import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const MedicalHistory = () => {
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [medicines, setMedicines] = useState('');
  const [date, setDate] = useState('');
  const [history, setHistory] = useState([]);
  
  const email = localStorage.getItem('email'); // Assuming email is stored in local storage

  // Ref to automatically scroll to the latest medical history
  const historyEndRef = useRef(null);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  // Automatically scroll to the latest history when the history updates
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const fetchMedicalHistory = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/medicalHistory/fetch', {
        email,
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching medical history", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/medicalHistory/add', {
        email,
        symptoms,
        description,
        medicines,
        date,
      });
      fetchMedicalHistory(); // Refresh history after submission
      setSymptoms('');
      setDescription('');
      setMedicines('');
      setDate('');
    } catch (error) {
      console.error("Error adding medical history", error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Side - Fixed Form */}
      <div style={{ flex: 1, width: '50%', padding: '20px', position: 'fixed', top: 0, left: 0, backgroundColor: '#f8f9fa', height: '100vh', boxSizing: 'border-box' }}>
        <h2>Add Medical History</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Symptoms*</label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label>Medicines Taken</label>
            <input
              type="text"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label>Date*</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Save</button>
        </form>
      </div>

      {/* Right Side - Scrollable History */}
      <div style={{
        flex: 1,
        width: '50%',
        marginLeft: '50%',
        padding: '20px',
        overflowY: 'scroll',
        marginTop: '80px', // Ensure the form does not overlap with the history
        height: '100vh',
      }}>
        <h2>Your Medical History</h2>
        {history.length === 0 ? (
          <p>No medical history found.</p>
        ) : (
          history.map((record, index) => (
            <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <p><strong>Symptoms:</strong> {record.symptoms}</p>
              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Medicines:</strong> {record.medicines}</p>
              <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
        {/* This element helps us scroll to the bottom of the history */}
        <div ref={historyEndRef}></div>
      </div>
    </div>
  );
};

export default MedicalHistory;
