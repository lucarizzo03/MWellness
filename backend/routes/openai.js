const express = require('express')
const { OpenAI } = require('openai')
const dotenv = require('dotenv')
const router = express.Router()

dotenv.config()

// OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
    const { chat } = req.body
    if (!chat) {
        res.status(400).json({ error: 'Message is required.' })
    }
    try {
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'You are a friendly and supportive wellness coach for University of Michigan students. Keep content brief and talk like a therapist, so ask questions to diver deeper and have a conversation to help' },
                { role: 'user', content: chat }
            ]
        });
        const reply = chatCompletion.choices[0].message.content;
        res.json({ reply });
    }
    catch (err) {
        console.error('OpenAI error:', err);
        res.status(500).json({ err: 'Failed to fetch reply from OpenAI.' });
    }
})

module.exports = router;