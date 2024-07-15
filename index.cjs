const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const React = require('react');
const ReactDOM = require('react-dom');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use(cors());
// Initialize Firebase Admin SDK
const serviceAccount = require('./webapp-44c6b-firebase-adminsdk-8yipf-f80df382a8.json'); // Path to your service account key JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://webapp-44c6b-default-rtdb.europe-west1.firebasedatabase.app/' // Replace with your Firebase project's URL
});

// Route to serve the TaskManagement component
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontEnd')));
//change
app.get('/', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'frontEnd/logIN.html'));
  // res.setHeader("Access-Control-Allow-Credentials", "true");

});


//the sigh-up function 
app.post('/signup', async (req, res) => {
  const { email, fullName, password} = req.body;
  try {
    // Check if the user already exists
    const usersRef = admin.firestore().collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (!querySnapshot.empty) {
      res.status(400).send('User already exists');
      return;
    }
   

    // Create a new user document in Firestore
    const newUser = {
      email,
      fullName,
      password,
    };
    const newUserRef = await usersRef.add(newUser);

    // Redirect to userhomepage.html or any other page you want
    // res.sendFile(path.join(__dirname, '../frontEnd/userhomepage.html'));
    res.redirect('/userHomePage.html');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



//the login function 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usersRef = admin.firestore().collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      return res.status(400).send('Invalid email or password');
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      return res.status(400).send('Invalid email or password');
    }

    // Send the user role and the adminEmail to the client
    return res.redirect('/userHomePage.html'); // Redirect to userhomepage.html
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});
