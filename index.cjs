const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const nodemailer = require('nodemailer');
const mailjet = require('node-mailjet').apiConnect('b38cc840683e7de80ea48ecfe450958a', '3d99747beb2a062ab7bb7964ad94b44c');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use(cors());
// Initialize Firebase Admin SDK
// Initialize Firebase Admin SDK
const serviceAccount = require('./webapp-44c6b-firebase-adminsdk-8yipf-f80df382a8.json'); // Path to your service account key JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://webapp-44c6b-default-rtdb.europe-west1.firebasedatabase.app/' // Replace with your Firebase project's URL
});

// Initialize Firebase Client SDK
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdnE-sgeMK2yLhcmj3EX6MKQfNgzSKdpk",
  authDomain: "stock-market-de6a6.firebaseapp.com",
  projectId: "stock-market-de6a6",
  storageBucket: "stock-market-de6a6.appspot.com",
  messagingSenderId: "626925898881",
  appId: "1:626925898881:web:992726e6fc77a19c6ed180",
  measurementId: "G-KWS9NJ4NLL"
};
const firebaseApp = initializeApp(firebaseConfig);

// Route to serve the TaskManagement component
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontEnd')));
app.get('/sign-in', (req, res) => {
  res.sendFile(path.join(__dirname, "frontEnd/logIN.html"));
});
app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontEnd/sigh_up.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontEnd/contactUS.html'));
});
//change
app.get('/', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'frontEnd/logIN.html'));
  // res.setHeader("Access-Control-Allow-Credentials", "true");

});

// Signup route
app.post('/signup', async (req, res) => {
  const { email, fullName, password } = req.body;
  
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
    await usersRef.add(newUser);

    // Send a welcome email to the new user
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "stockmarketbraude@gmail.com",
              Name: "stock market",
            },
            To: [
              {
                Email: email,
                Name: fullName,
              },
            ],
            Subject: "Welcome to Stock Market",
            TextPart: "Hello, welcome to Stock Market! We are excited to have you.",
            HTMLPart: "<h3>Welcome to Stock Market!</h3><p>We are excited to have you on board. Explore our platform and start your journey with us.</p>",
          },
        ],
      });

    request
      .then((result) => {
        console.log("Email sent successfully!");
        console.log("Response:", JSON.stringify(result.body, null, 2));
      })
      .catch((err) => {
        console.error("Failed to send email:");
        console.error("Status code:", err.statusCode);
        console.error("Error message:", err.message);
        if (err.response && err.response.res && err.response.res.text) {
          console.error("Detailed error message:", err.response.res.text);
        }
      });

    res.status(201).send('Signup successful');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal server error');
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
    return res.redirect('/marketData.html'); // Redirect to userhomepage.html
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

app.post('/contact-us', async (req, res) => {
  try {
    const { name, email, selection, subject } = req.body;

    // Send email to yourself
    const adminRequest = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "stockmarketbraude@gmail.com",
              Name: "stock market",
            },
            To: [
              {
                Email: "raeed.ataria@e.braude.ac.il",
                Name: "stock market",
              },
            ],
            Subject: "New Contact Us Submission",
            TextPart: `You have a new contact form submission from ${name}. Email: ${email}, Selection: ${selection}, Subject: ${subject}`,
            HTMLPart: `<h3>New Contact Us Submission</h3><p>Name: ${name}</p><p>Email: ${email}</p><p>Selection: ${selection}</p><p>Subject: ${subject}</p>`,
          },
        ],
      });

    const adminResponse = await adminRequest;
    console.log("Admin email sent successfully!");
    console.log("Response:", JSON.stringify(adminResponse.body, null, 2));

    // Send confirmation email to the client
    const clientRequest = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "stockmarketbraude@gmail.com",
              Name: "stock market",
            },
            To: [
              {
                Email: email,
                Name: name,
              },
            ],
            Subject: "We received your message",
            TextPart: `Hello ${name}, we have received your message. We will get back to you shortly.`,
            HTMLPart: `<h3>Thank you for contacting us, ${name}!</h3><p>We have received your message: ${subject}</p><p>We will get back to you shortly.</p>`,
          },
        ],
      });

    const clientResponse = await clientRequest;
    console.log("Client email sent successfully!");
    console.log("Response:", JSON.stringify(clientResponse.body, null, 2));

    res.status(200).send('Message received, confirmation email sent');
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send('Internal server error');
  }
});