const ContactController = require("../controller/contactController.js")
const express = require("express");
const router = express.Router();
const { body } = require('express-validator');


// Contact Post
router.post('/contacts', [
    body('name').notEmpty().withMessage('First Name is required'),
    body('surname').notEmpty().withMessage('Last Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('message').notEmpty().withMessage('Message is required')
], ContactController.sendEmail);


module.exports = router;