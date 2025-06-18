const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const openaiRoutes = require('./routes/openai')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/// MONGO DATABASE /// 
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@umich\.edu$/, 'Email must be a umich.edu address'],
    },
    password: {
        type: String,
        required: true
    }
})

const messageSchema = new mongoose.Schema ({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'New Chat',
        required: true,
    },
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }   
})

const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', chatSchema);

/// PASSWORD HASHING + COMPARING PASSWORDS ///
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    const salt = await bcrypt.genSalt(15)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// calls openAI route
app.use('/api', openaiRoutes)



























const PORT = process.env.PORT || 2300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})