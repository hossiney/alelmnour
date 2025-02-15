// routes/member.js
const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// عرض صفحة تسجيل دخول الأعضاء
router.get('/login', memberController.getLogin);

// معالجة بيانات تسجيل دخول الأعضاء
router.post('/login', memberController.postLogin);


router.get('/dashboard', memberController.getDashboard);


router.get('/classroom/:id', memberController.getClassroom);




module.exports = router;
