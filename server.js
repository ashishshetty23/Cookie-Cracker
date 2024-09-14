const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const secret = 'super-secret-key';

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Simulated user database
const users = {
    user: { password: 'userpass', role: 'user' },
    admin: { password: 'adminpass', role: 'admin' }
};

// Generate JWT Token
function generateToken(username) {
    const payload = { username, role: users[username].role };
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username].password === password) {
        const token = generateToken(username);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Protected endpoint
app.get('/flag', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, secret);
        if (decoded.role === 'admin') {
            res.json({ flag: 'FLAG{example_flag}' });
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
