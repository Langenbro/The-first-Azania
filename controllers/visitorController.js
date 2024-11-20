const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Renders the request pass page for the visitor
exports.renderRequestPassPage = (req, res) => {
    res.render('request-pass-page', { user: req.session.user });
};

