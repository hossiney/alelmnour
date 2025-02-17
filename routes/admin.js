// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const multer  = require('multer');
const path = require('path');

// Configure storage for uploaded videos

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify your upload directory
      cb(null, 'uploads/videos/');
    },
    filename: function (req, file, cb) {
      // Extract the original file extension
      const ext = path.extname(file.originalname);
      // Generate a new filename (you can customize this logic)
      const newName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
      cb(null, newName);
    }
  });
// Configure Multer middleware
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Allow only video files (MIME type must start with "video/")
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  },
  limits: { fileSize: 300 * 1024 * 1024 } // Limit file size to 100MB
});

// Configure storage with a custom filename


// Create the Multer upload instance using the custom storage


// Create the POST endpoint at /upload/video
router.post('/upload/video', (req, res) => {
    console.log('Uploading video')
  // "file" is the field name expected from the client (for example from Filebond/FilePond)
  upload.single('filepond')(req, res, function(err) {

    if (err instanceof multer.MulterError) {

      // Handle Multer errors (e.g., file too large)
      return res.status(500).json({ error: err.message });
    } else if (err) {

      // Handle other errors
      return res.status(500).json({ error: err.message });
    }

    // If no file was uploaded, return an error
    if (!req.file) {

      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Construct a URL for the uploaded file. You might need to adjust this URL
    // based on how you serve your static files.
    const fileUrl = `/uploads/videos/${req.file.filename}`;

    // Send a successful JSON response containing the file URL
    return res.status(200).json({ fileUrl });
  });
});

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
