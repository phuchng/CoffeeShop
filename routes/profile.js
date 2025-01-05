var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/authentication');
const Account = require('../models/Account');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the 'fs' module for file system operations

// Set up multer for file uploads (for avatar)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/assets/images/avatars/');
  },
  filename: function (req, file, cb) {
      const userEmail = req.user.email; // Get user's email
      const fileName = `avatar_${userEmail}.png`; // Create new filename
      cb(null, fileName);
  }
});


const upload = multer({ storage: storage });

// View Profile
router.get('/', isAuthenticated, async (req, res, next) => {
    try {
        const user = await Account.findById(req.user.id);
        if (!user) {
            req.flash('error_msg', 'User not found.');
            return res.redirect('/');
        }
        res.render('profile', { title: 'Profile', user: user });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching user profile.');
        res.redirect('/');
    }
});

// Update Profile Name
router.post('/change-name', isAuthenticated, async (req, res) => {
    const { first_name, last_name } = req.body;

    // Basic input validation
    if (!first_name || !last_name) {
        return res.status(400).json({ error: 'First name and last name are required.' });
    }

    try {
        const user = await Account.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.first_name = first_name;
        user.last_name = last_name;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// Update Profile Address
router.post('/change-address', isAuthenticated, async (req, res) => {
    const { first_name, last_name, company, address, apartment, phone } = req.body;

    // Basic input validation
    if (!first_name || !last_name || !address || !phone) {
        return res.status(400).json({ error: 'First name, last name, address, and phone are required.' });
    }

    try {
        const user = await Account.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.address = {
            first_name,
            last_name,
            company,
            address,
            apartment,
            phone
        };
        await user.save();

        res.status(200).json({ message: 'Address updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update address.' });
    }
});

// Change Password - GET
router.get('/change-password', isAuthenticated, (req, res) => {
  res.render('CPassword');
});


// Update Password
router.post('/change-password', isAuthenticated, async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Basic input validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: 'New passwords do not match.' });
    }

    try {
        const user = await Account.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password.' });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update password.' });
    }
});

// Upload Avatar
router.post('/upload-avatar', isAuthenticated, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
      if (req.xhr) {
          return res.status(400).json({ error: 'No file uploaded.' });
      } else {
          req.flash('error_msg', 'No file uploaded.');
          return res.redirect('/profile');
      }
  }

  try {
      const user = await Account.findById(req.user.id);
      if (!user) {
          if (req.xhr) {
              return res.status(404).json({ error: 'User not found.' });
          } else {
              req.flash('error_msg', 'User not found.');
              return res.redirect('/profile');
          }
      }

      // Update avatar filename in database
      user.avatar = req.file.filename;
      await user.save();

      if (req.xhr) {
          res.status(200).json({ message: 'Avatar updated successfully.', avatar: req.file.filename });
      } else {
          req.flash('success_msg', 'Avatar updated successfully.');
          res.redirect('/profile');
      }
  } catch (err) {
      console.error(err);
      if (req.xhr) {
          res.status(500).json({ error: 'Failed to update avatar.' });
      } else {
          req.flash('error_msg', 'Failed to update avatar.');
          res.redirect('/profile');
      }
  }
});

// Delete Avatar (Revert to default)
router.post('/delete-avatar', isAuthenticated, async (req, res) => {
    try {
        const user = await Account.findById(req.user.id);
        if (!user) {
            if (req.xhr) {
                return res.status(404).json({ error: 'User not found.' });
            } else {
                req.flash('error_msg', 'User not found.');
                return res.redirect('/profile');
            }
        }

        // Delete the old avatar file if it's not the default avatar
        if (user.avatar !== 'default_avatar.png') {
            const oldAvatarPath = path.join(__dirname, '../public/assets/images/avatars/', user.avatar);
            fs.unlink(oldAvatarPath, (err) => {
                if (err) {
                    console.error("Error deleting old avatar file:", err);
                    // Don't send an error response here, as we still want to update the database
                }
            });
        }

        // Set avatar to default
        user.avatar = 'default_avatar.png';
        await user.save();

        if (req.xhr) {
            res.status(200).json({ message: 'Avatar reverted to default.' });
        } else {
            req.flash('success_msg', 'Avatar reverted to default.');
            res.redirect('/profile');
        }
    } catch (err) {
        console.error(err);
        if (req.xhr) {
            res.status(500).json({ error: 'Failed to delete avatar.' });
        } else {
            req.flash('error_msg', 'Failed to delete avatar.');
            res.redirect('/profile');
        }
    }
});

module.exports = router;
