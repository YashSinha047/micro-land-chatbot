// routes/chat.js
const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');

// Load environment variables
require('dotenv').config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.chatbot = async (req, res) => {
  const { userQuery } = req.body;  


  const prompt = `
    You are an medical advisor. I will give you some medical symptomps or text related to medical conditions and you will give me the
    answer accordingly. Also since you are not a doctor so after the advise please tell the user to also consult with a doctor.Give the response
    in a consiged manner.

    Query: ${userQuery}`;

  try {
        // Call the OpenAI GPT-4 model
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.7
        });

        // Extract the actual response message
        const chatResponse = response.choices[0].message.content;

        // Log the response for debugging
        console.log("OpenAI Response:", chatResponse);

        // Send the response back to the client
        res.status(200).json({ response: chatResponse });

    } catch (error) {
        console.error("Error during ChatGPT evaluation:", error);
        res.status(500).json({ error: "Failed to evaluate the submission" });
    }

  // try {
  //   // Make the API request to the OpenAI ChatGPT API
  //   const response = await openai.chat.completions.create( // OpenAI's ChatGPT endpoint
  //     {
  //       model: "gpt-4",  // You can change this to any other GPT model (e.g., gpt-4)
  //       messages: [
  //         { role: "user", content: userQuery }  // Send user input as part of the message
  //       ],
  //       max_tokens: 150,           // Adjust based on the desired response length
  //       temperature: 0.7,          // Adjust based on the desired randomness of the response
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API key
  //         'Content-Type': 'application/json',
  //       },
  //     }
  //   );

  //   // Extract the response content from OpenAI
  //   const botResponse = response.data.choices[0].message.content || "I'm sorry, I couldn't understand the question.";

  //   // Send the response back to the client
  //   res.json({ response: botResponse });
  // } catch (error) {
  //   console.error("Error fetching response from OpenAI API:", error.message);
  //   res.status(500).json({ error: "Failed to get response from AI." });
  // }
};
