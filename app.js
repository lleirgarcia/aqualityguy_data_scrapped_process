require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiUrl = 'https://api.openai.com/v1/chat/completions';

app.post('/ask', async (req, res) => {
    const { question } = req.body;
    try {
        const response = await axios.post(openaiUrl, {
            model: "gpt-4",
            messages: [{ role: "user", content: question }]
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
