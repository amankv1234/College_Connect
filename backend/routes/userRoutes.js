const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getAllStudents, getStudentById } = require('../controllers/userController');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/students', authMiddleware, getAllStudents);
router.get('/students/:id', authMiddleware, getStudentById);

module.exports = router;
