// app.js
const express = require('express');
const path = require('path');
const app = express();
const db = require('./config/db'); // الاتصال بقاعدة البيانات
const Admin = require('./models/Admin');
const cookieParser = require('cookie-parser');
// إعدادات الميدلوير لتحليل بيانات النماذج
app.use(express.urlencoded({ extended: false }));
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
