const express = require('express');
const mongoose = require('mongoose');
const cron = require('cron');

const app = express();

const connectDB = async()=>{
    await mongoose.connect(`mongodb+srv://yashikadangi10:7wriJJmb2ivYUYHd@yashika.phxrsgk.mongodb.net/mydb`)

    console.log(`DB is connected with ${mongoose.connection.host}`);
}

connectDB()

const NumberSchema = new mongoose.Schema({
  value: Number,
});

const NumberModel = mongoose.model('Number', NumberSchema);

let initialNum = 841727;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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

app.get('/numbers', async (req, res) => {
  try {
    const numbers = await NumberModel.find({}, 'value');
    res.status(200).json({ numbers });
  } catch (err) {
    console.error('Error fetching numbers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function pushNumber(num) {
  try {
    const newNumber = new NumberModel({ value: num });
    await newNumber.save();
    console.log(`Number ${num} saved to the database.`);
  } catch (err) {
    console.error('Error saving number to the database', err);
  }
}

const job = new cron.CronJob('0 */5 * * * *', async () => {
  initialNum++;
  await pushNumber(initialNum);
}, null, true); 

job.start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
