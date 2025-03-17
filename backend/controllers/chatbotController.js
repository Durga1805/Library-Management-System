// backend\controllers\chatbotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize the Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const callGenerativeAI = async (message) => {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a simple prompt
    const prompt = `
      As a library assistant, please respond to this query: ${message}
      Keep the response brief and focused on library services.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error; // Let the parent function handle the error
  }
};

const chatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: "Invalid message format. Please provide a text message." 
      });
    }

    // Validate API key
    if (!process.env.API_KEY) {
      console.error('API Key is missing');
      return res.status(500).json({ 
        error: "API configuration error. Please contact administrator." 
      });
    }

    // Call Gemini API
    const botReply = await callGenerativeAI(message);

    if (!botReply) {
      return res.status(500).json({ 
        error: "No response received from AI service." 
      });
    }

    // Send the response back to the client
    res.json({ response: botReply });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ 
      response: "I apologize, but I'm having trouble connecting to the AI service. Please try again later or contact the library staff for assistance." 
    });
  }
};

const generateImage = async (req, res) => {
  try {
    const { description } = req.body;
    res.status(501).json({
      error: "Image generation is not supported by Gemini at this time.",
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
};

module.exports = { chatbotResponse, generateImage };
