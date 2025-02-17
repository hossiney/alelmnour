// app.js
const express = require('express');
const path = require('path');
const app = express();
const db = require('./config/db'); // الاتصال بقاعدة البيانات
const Admin = require('./models/Admin');
const cookieParser = require('cookie-parser');
const fs = require('fs');
// إعدادات الميدلوير لتحليل بيانات النماذج
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// تعيين مجلد public للملفات الثابتة (CSS، JS، الصور، …)
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); // تفعيل قراءة الكوكيز
// تعيين EJS كمحرك للقوالب
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// استيراد واستخدام مسارات التطبيق
const adminRoutes = require('./routes/admin');
const memberRoutes = require('./routes/member');
const classroomRoutes = require('./routes/classroom');
const invoiceRoutes = require('./routes/invoice');
app.use('/admin', adminRoutes);
app.use('/member', memberRoutes);
app.use('/classroom', classroomRoutes);
app.use('/invoice', invoiceRoutes);



app.get('/', (req, res) => {
    res.render('index', { title: 'العلم نور' });
});


app.get('/uploads/videos/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = path.join(__dirname, 'uploads', 'videos', fileName);
  
    // Check if file exists and get its stats
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return res.sendStatus(404);
      }
  
      const fileSize = stats.size;
      const range = req.headers.range;
  
      if (range) {
        // Parse the Range header, e.g. "bytes=0-"
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
        if (start >= fileSize) {
          res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
          return;
        }
        
        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });
  
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4' // adjust the MIME type as needed
        });
        fileStream.pipe(res);
      } else {
        // No range header provided, send the entire file
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4' // adjust the MIME type as needed
        });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  });
const defaultAdminEmail = 'rootkiller67@gmail.com';
const defaultAdminPassword = 'Password.123#';

Admin.findOne({ email: defaultAdminEmail })
    .then(admin => {
        if (!admin) {
            const newAdmin = new Admin({ email: defaultAdminEmail, password: defaultAdminPassword });
            return newAdmin.save();
        }
    })
    .then(() => console.log('تم التحقق من المدير الافتراضي.'))
    .catch(err => console.error('خطأ أثناء التحقق من المدير الافتراضي:', err));
// بدء تشغيل الخادم
app.use(function(req, res, next) {


    return res.render('404')

})

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
