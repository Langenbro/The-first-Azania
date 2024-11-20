require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const morgan = require('morgan');
const routes = require('./routes/index');
const http = require('http');
const socketIo = require('socket.io');
const sharedSession = require('express-socket.io-session');
const cookieParser = require('cookie-parser');


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create server using the app
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io with the server

// Middleware for parsing cookies and sessions
app.use(cookieParser());

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'yoursecretkey',  // Ensure this is defined
    resave: false,  // Don't resave session if unmodified
    saveUninitialized: false,  // Only save sessions when they are modified
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // Secure cookie in production
        httpOnly: true,  // Prevent access via JavaScript
        maxAge: 60 * 60 * 1000  // 1 hour expiration
    }
});

// Apply session middleware to both Express and Socket.io
app.use(sessionMiddleware);
io.use(sharedSession(sessionMiddleware, { autoSave: true }));

// Handle incoming messages and save them to the database
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', async (messageData) => {
        try {
            const userSession = socket.handshake.session;
            const userId = userSession.userId;
            const senderName = `${userSession.firstName} ${userSession.lastName}`;

            if (!userId) {
                console.error('User not found in session');
                return;
            }

            // Save message to the database
            await staffController.saveMessage(userId, messageData.receiverId, messageData.message);

            // Emit the message to the receiver and sender
            io.to(messageData.receiverId).emit('receiveMessage', {
                senderId: userId,
                message: messageData.message,
                senderName: senderName,
                receiverId: messageData.receiverId
            });

            socket.emit('receiveMessage', {
                senderId: userId,
                message: messageData.message,
                senderName: senderName,
                receiverId: messageData.receiverId
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Set EJS as the templating/view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Logging requests using Morgan
app.use(morgan('combined'));

// Apply routes (Visitor routes, etc.)


app.use(routes);



// 404 Page not found middleware
app.use((req, res) => {
    res.status(404).render('404'); // Ensure you have a 404.ejs file
});



// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
