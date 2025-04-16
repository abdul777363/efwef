const express = require('express');
const Redis = require('ioredis');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Initialize Redis client
const redis = new Redis(); // Connects to localhost:6379 by default

// Route for the home page
app.get('/', (req, res) => {
    res.render('index');
});
// Route for the home page
app.get('/load', (req, res) => {
    res.render('load');
});
// Route for the sign-in page
app.get('/signin', (req, res) => {
    res.render('signin');
});

// Handle POST request for login
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Here you would typically validate the credentials
    // For demonstration, we'll just log them
    console.log(`Username: ${username}, Password: ${password}`);

    // Store user session in Redis (for example)
    await redis.set(username, password); // Store password for demonstration (not recommended in production)

    // Send a response back to the client
    res.send('Login successful!'); // You can redirect or render a different page
});

// Example route to get user session from Redis
app.get('/session/:username', async (req, res) => {
    const username = req.params.username;
    const password = await redis.get(username); // Retrieve password (or session data)

    if (password) {
        res.send(`Session for ${username}: ${password}`);
    } else {
        res.send(`No session found for ${username}`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});