// config/db.js
const mongoose = require('mongoose');

// الاتصال بقاعدة البيانات (يمكن تعديل الرابط حسب إعدادات قاعدة البيانات الخاصة بك)
mongoose.connect('mongodb+srv://ghazy:serverPassword.123@cluster0.hmq7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

module.exports = mongoose;
