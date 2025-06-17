const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const openaiRoutesText = require('./routes/openai')
const openaiRoutesSpeech = require('./routes/openai')


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// calls openAI route
app.use('/api', openaiRoutesText)
app.use('/api', openaiRoutesSpeech)


























const PORT = process.env.PORT || 2300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})