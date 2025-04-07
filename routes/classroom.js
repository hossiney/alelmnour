const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// عرض قائمة القاعات الدراسية
router.get('/', classroomController.getList);

// إضافة قاعة دراسية جديدة
router.get('/add', classroomController.getAdd);
router.post('/add', classroomController.postAdd);

router.post('/add', classroomController.postAdd);

router.post('/editMeetingLink', classroomController.postEditLink);

// عرض تفاصيل القاعة الدراسية مع قائمة الدروس
router.get('/:id', classroomController.getDetails);

// إضافة درس جديد للقاعة الدراسية
router.get('/:id/add-lesson', classroomController.getAddLesson);
router.post('/:id/add-lesson', classroomController.postAddLesson);

// حذف قاعة دراسية
router.get('/delete/:id', classroomController.deleteClassroom);

// حذف درس من القاعة الدراسية
router.get('/:classroomId/delete-lesson/:lessonId', classroomController.deleteLesson);

router.post('/:classroomId/lesson/:lessonName/add-test', classroomController.addTestToLesson);
router.post('/:classroomId/lesson/:lessonName/delete-test', classroomController.deleteTestFromLesson);

module.exports = router;
