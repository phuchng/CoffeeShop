var express = require('express');
var account = require('../models/Account');
var passport = require('passport');
var router = express.Router();

var isAuthenticated = require('../middleware/authentication')

router.get('/', isAuthenticated, async(req, res) => {
    res.render('profile', { layout: 'layoutProfile' });
});

router.post('/change-name', isAuthenticated, async(req, res) => {
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const userID = req.user.id;

    account.findByIdAndUpdate(userID, { first_name: first_name, last_name: last_name }, { new: true })
    .then((updatedUser) => {
        res.status(200).json({ message: 'Name updated successfully', user: updatedUser });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to update name' });
    });
})

router.post('/change-address', isAuthenticated, async(req, res) => {
    const { first_name, last_name, company, address, apartment, phone } = req.body;

    if (!first_name || !last_name) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const addressUpdate = {
        first_name,
        last_name,
        address,
        phone,
        isDefault: isDefault || false,
    };

    if (company) addressUpdate.company = company;
    if (apartment) addressUpdate.apartment = apartment;

    const userID = req.user.id;

    account.findByIdAndUpdate(userID, { address: addressUpdate }, { new: true })
    .then((updatedUser) => {
        res.status(200).json({ message: 'Address updated successfully', user: updatedUser });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to update address' });
    });
})