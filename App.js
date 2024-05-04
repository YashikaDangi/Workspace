// const express = require('express');
// const mongoose = require('mongoose');
// const cron = require('cron');

// const app = express();

// // Connect to MongoDB
// const connectDB = async()=>{
//     await mongoose.connect(`mongodb+srv://yashikadangi10:7wriJJmb2ivYUYHd@yashika.phxrsgk.mongodb.net/mydb`)

//     console.log(`DB is connected with ${mongoose.connection.host}`);
// }

// connectDB()

// // Define a schema for your data
// const NumberSchema = new mongoose.Schema({
//   value: Number,
// });

// // Create a model based on the schema
// const NumberModel = mongoose.model('Number', NumberSchema);

// // Initial number
// let initialNum = 841727;

// // Middleware for logging requests
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// // API endpoint to update the number
// app.get('/update-number/:value', async (req, res) => {
//   try {
//     const value = parseInt(req.params.value);
//     initialNum += value;
//     await pushNumber(initialNum);
//     res.status(200).json({ message: 'Number updated successfully', number: initialNum });
//   } catch (err) {
//     console.error('Error updating number:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // API endpoint to get all numbers
// app.get('/numbers', async (req, res) => {
//   try {
//     const numbers = await NumberModel.find({}, 'value');
//     res.status(200).json({ numbers });
//   } catch (err) {
//     console.error('Error fetching numbers:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Function to push a number to the database
// async function pushNumber(num) {
//   try {
//     const newNumber = new NumberModel({ value: num });
//     await newNumber.save();
//     console.log(`Number ${num} saved to the database.`);
//   } catch (err) {
//     console.error('Error saving number to the database', err);
//   }
// }

// // Schedule task to update the number every 2 minutes
// const job = new cron.CronJob('0 */5 * * * *', async () => {
//   initialNum++;
//   await pushNumber(initialNum);
// }, null, true);

// // Start the cron job
// job.start();

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cron = require('cron');
const axios = require('axios');

const app = express();

// Connect to MongoDB
const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://yashikadangi10:7wriJJmb2ivYUYHd@yashika.phxrsgk.mongodb.net/mydb`);
    console.log(`DB is connected with ${mongoose.connection.host}`);
}

connectDB();

// Define a schema for your data
const NumberSchema = new mongoose.Schema({
    value: Number,
});

// Create a model based on the schema
const NumberModel = mongoose.model('Number', NumberSchema);

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// API endpoint to update the number
app.get('/update-number/:value', async (req, res) => {
    try {
        const value = parseInt(req.params.value);
        initialNum += value;
        await pushNumber(initialNum);
        res.status(200).json({ message: 'Number updated successfully', number: initialNum });
    } catch (err) {
        console.error('Error updating number:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get all numbers
app.get('/numbers', async (req, res) => {
    try {
        const numbers = await NumberModel.find({}, 'value');
        res.status(200).json({ numbers });
    } catch (err) {
        console.error('Error fetching numbers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to push a number to the database
async function pushNumber(num) {
    try {
        const newNumber = new NumberModel({ value: num });
        await newNumber.save();
        console.log(`Number ${num} saved to the database.`);
    } catch (err) {
        console.error('Error saving number to the database', err);
    }
}

// Fetch initial number from the API
async function fetchInitialNumber() {
    try {
        const response = await axios.get('https://mempool.space/api/blocks/tip/height');
        return response.data;
    } catch (error) {
        console.error('Error fetching initial number:', error);
        throw error;
    }
}

// Schedule task to update the number every 2 minutes
const job = new cron.CronJob('0 */5 * * * *', async () => {
    try {
        const initialNumber = await fetchInitialNumber();
        initialNum = initialNumber;
        await pushNumber(initialNum);
    } catch (error) {
        console.error('Error updating initial number:', error);
    }
}, null, true);

// Start the cron job
job.start();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
