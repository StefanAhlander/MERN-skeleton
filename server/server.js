require('dotenv').config();
import app from './express';
import mongoose from 'mongoose';

const PORT = process.env.port;
const mongoUri = process.env.DB_CONNECTION_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database`);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.info(`Server running on http://localhost:${PORT}`);
});
