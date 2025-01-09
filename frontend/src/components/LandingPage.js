// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './index.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#caf0f8] to-[#90e0ef] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#03045e] mb-2">
            Healthcare Assistant
          </h1>
          <p className="text-[#0077b6] text-lg mb-8">
            Your personal health companion powered by AI
          </p>
        </div>
       
        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#00b4d8] hover:bg-[#0077b6] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            Login to Your Account
          </button>
         
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-white hover:bg-gray-50 text-[#03045e] font-semibold py-3 px-6 rounded-lg border-2 border-[#03045e] transition-colors duration-200 transform hover:scale-105"
          >
            Create New Account
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-[#0077b6]">
          <p>Get personalized health advice and support</p>
          <p>Available 24/7 for your healthcare needs</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
