const express = require('express')
const { OpenAI } = require('openai')
const dotenv = require('dotenv')
const multer = require('multer') // handles file uploads
const fs = require('fs') // imports nodes built in file system module
const router = express.Router()

const uploads = multer({dest: 'uploads/'})

dotenv.config()

// OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// text to text
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

// speech to text
router.post('speech-to-text', uploads.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'No audio file found'})
    }

    try {
        const audioText = fs.readFileSync(req.file.path)
        const transcription = await openai.audio.transcriptions.create({
            file: audioText,
            model: 'whisper-1',
            response_format: 'json'
        });

        const userMessage = transcription.text
        console.log('Transcribed text:', userMessage);

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'You are a friendly and supportive wellness coach for University of Michigan students. Keep content brief and talk like a therapist, so ask questions to diver deeper and have a conversation to help' },
                { role: 'user', content: userMessage }
            ]
        });

        const reply = chatCompletion.choices[0].message.content;
        
        res.json(reply)
        fs.unlinkSync(req.file.path);
    }
    catch(err) {
        console.error('Error in speech-to-speech:', error);
        res.status(500).json({ error: 'Failed to process speech-to-speech request.' });
    }
})








module.exports = router;