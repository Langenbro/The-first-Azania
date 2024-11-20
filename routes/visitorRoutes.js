const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');


// Visitor Dashboard Route
router.get('/dashboard', (req, res) => {
    if (req.session.userRole !== 'visitor') {
        return res.status(403).send('Access denied.');
    }
    res.render('visitor-dashboard', { user: req.session.user });
});

module.exports = router;
