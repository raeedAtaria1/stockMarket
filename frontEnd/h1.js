import express from 'express';
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint
app.post('/', (req, res) => {

  res.send('Data received successfully!lkkk');
});
app.get('/', (req, res) => {
  
  res.send('Data received successfully!');
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
