// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const bcrypt = require('bcryptjs');


// عرض صفحة تسجيل دخول المدير
router.get('/login', authMiddleware.isNotLoggedIn,adminController.getLogin);
// معالجة بيانات تسجيل دخول المدير
router.post('/login', adminController.postLogin);

router.get('/logout',authMiddleware.authenticateAdmin, adminController.getSignout);

// عرض لوحة التحكم (يمكن حماية هذه الصفحة باستخدام جلسات أو middleware للتحقق من الدخول)
router.get('/',authMiddleware.authenticateAdmin, adminController.getDashboard);

router.get('/dashboard',authMiddleware.authenticateAdmin, adminController.getDashboard);


// إضافة عضو جديد
router.post('/add-member', adminController.addMember);

// حذف عضو (يتم تمرير معرف العضو في الرابط)
router.get('/delete-member/:id', adminController.deleteMember);



// classrooms routers

router.get('/classroom',authMiddleware.authenticateAdmin, adminController.getClassroomsList);

router.get('/classroom/add', authMiddleware.authenticateAdmin, adminController.getAddClassroom);
router.post('/classroom/add', authMiddleware.authenticateAdmin, adminController.postAddClassroom);

router.post('/classroom/editMeetingLink', authMiddleware.authenticateAdmin, adminController.postEditLinkClassroom);

// عرض تفاصيل القاعة الدراسية مع قائمة الدروس
router.get('/classroom/:id', authMiddleware.authenticateAdmin, adminController.getDetailsClassroom);

// إضافة درس جديد للقاعة الدراسية
router.get('/classroom/:id/add-lesson', authMiddleware.authenticateAdmin, adminController.getAddLessonClassroom);
router.post('/classroom/:id/add-lesson', authMiddleware.authenticateAdmin, adminController.postAddLessonClassroom);

// حذف قاعة دراسية
router.get('/classroom/delete/:id', authMiddleware.authenticateAdmin, adminController.deleteClassroom);

// حذف درس من القاعة الدراسية
router.get('/classroom/:classroomId/delete-lesson/:lessonId', authMiddleware.authenticateAdmin, adminController.deleteLessonClassroom);



/// invoices router 


router.get('/invoice/', authMiddleware.authenticateAdmin, adminController.getInvoiceList);
router.get('/invoice/add', authMiddleware.authenticateAdmin, adminController.getAddInvoice);
router.post('/invoice/add', authMiddleware.authenticateAdmin, adminController.postAddInvoice);
router.get('/invoice/delete/:id', authMiddleware.authenticateAdmin, adminController.deleteInvoice);


module.exports = router;
