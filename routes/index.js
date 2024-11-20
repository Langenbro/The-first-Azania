const express = require('express');
const visitorRoutes = require('./visitorRoutes');  // Add visitor routes

const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/');  // Redirect to the home page after logout
    });
});




module.exports = router;
