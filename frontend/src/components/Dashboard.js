import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ setIsAuthenticated }) => {
  const [userQuery, setUserQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Speech Recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const listenTimeoutDuration = 2000;
  let listenTimeout;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const speechResult = event.results[event.results.length - 1][0].transcript;
      setUserQuery(speechResult);

      if (speechResult === '') {
        clearTimeout(listenTimeout);
        listenTimeout = setTimeout(() => {
          if (isListening) {
            recognition.stop();
            setIsListening(false);
          }
        }, listenTimeoutDuration);
      } else {
        clearTimeout(listenTimeout);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      clearTimeout(listenTimeout);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      setIsListening(false);
      clearTimeout(listenTimeout);
    };
  } else {
    console.warn("Speech Recognition API is not supported in this browser.");
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleInputChange = (event) => {
    setUserQuery(event.target.value);
  };

  const handleTextSubmit = async (event) => {
    event.preventDefault();
    if (userQuery.trim() === '') return;

    handleQuery(userQuery);
    setUserQuery('');
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      clearTimeout(listenTimeout);
    } else {
      recognition.start();
      setIsListening(true);

      clearTimeout(listenTimeout);
      listenTimeout = setTimeout(() => {
        recognition.stop();
        setIsListening(false);
      }, listenTimeoutDuration);
    }
  };

  const handleQuery = async (query) => {
    if (!query) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: query },
    ]);

    try {
      const response = await axios.post('http://localhost:5000/api/chat/query', {
        userQuery: query,
      });

      const botMessage = response.data.response || "Sorry, I couldn't understand.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botMessage },
      ]);
    } catch (error) {
      console.error("Error fetching response from backend", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Error occurred while processing your request." },
      ]);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <div
        style={{
          width: '200px',
          backgroundColor: '#2c3e50',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '20px',
          paddingLeft: '20px',
          paddingRight: '20px',
          position: 'fixed',
          height: '100%',
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
        <button
          onClick={() => navigate('/medical-history')}
          style={{
            background: 'none',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          Medical History
        </button>
        <button
          onClick={() => navigate('/medication-reminder')}
          style={{
            background: 'none',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          Medication reminder
        </button>
      </div>

      <div
        style={{
          flexGrow: 1,
          marginLeft: '220px',
          padding: '20px',
          backgroundColor: '#ecf0f1',
          minHeight: '100vh',
          paddingBottom: '80px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Healthcare Chatbot</h2>

        <div
          ref={chatContainerRef}
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            height: '400px',  // Fixed height for the chat area
            paddingRight: '10px',
            marginBottom: '20px',
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '15px',
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '80%',
                wordWrap: 'break-word',
                backgroundColor: message.sender === 'user' ? '#3498db' : '#2ecc71',
                color: 'white',
                alignSelf: message.sender === 'user' ? 'flex-start' : 'flex-end',
              }}
            >
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleTextSubmit}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '220px',
            right: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <input
            type="text"
            value={userQuery}
            onChange={handleInputChange}
            placeholder="Ask about your symptoms..."
            style={{
              padding: '10px',
              width: '70%',
              fontSize: '16px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              marginRight: '10px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
          <button
            type="button"
            onClick={handleVoiceInput}
            style={{
              backgroundColor: isListening ? 'red' : 'white',
              color: isListening ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '50%',
              padding: '15px',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            {isListening ? 'Stop Listening' : '🎤'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
