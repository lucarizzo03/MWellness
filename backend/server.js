const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const openaiRoutes = require('./routes/openai')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// calls openAI route
app.use('/api', openaiRoutes)


























const PORT = process.env.PORT || 2300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})