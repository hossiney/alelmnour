// controllers/memberController.js
const Member = require('../models/Member');
const Lesson = require('../models/Lesson');
const jwt = require('jsonwebtoken');

// عرض صفحة تسجيل دخول الأعضاء
exports.getLogin = (req, res) => {
    res.render('member/login', { title: 'تسجيل دخول الأعضاء - العلم نور', error: null });
};

// عملية تسجيل دخول الأعضاء
exports.postLogin = async (req, res) => {
    const { mobile } = req.body;
    try {
        const member = await Member.findOne({ mobile}).populate('invoice');

        const invoices = member.invoice;

        const check = invoices.find(invoice => invoice.invoiceNumber == req.body.invoice);

        console.log(check);


        if (!check) {
            return res.render('member/login', { title: 'تسجيل دخول الأعضاء - العلم نور', error: 'بيانات الدخول غير صحيحة' });
        }

        const token = jwt.sign(
            { id: member._id, email: member.email , role:'member'},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // إرسال التوكن كـ "كوكي" أو في الـ "response"
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        // إعادة التوجيه إلى موقع خارجي عند تسجيل الدخول بنجاح
        res.redirect('/member/dashboard');
    } catch (err) {
        console.error(err);
        res.render('member/login', { title: 'تسجيل دخول الأعضاء - العلم نور', error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
};



exports.getDashboard = async (req, res) => {
    try {

        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return  res.redirect('/member/login');
        }
      
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            const member = await Member.findById(decoded.id).populate({
                path: 'invoice',
                populate: {
                    path: 'classroom',
                    model: 'Classroom' // Replace 'Classroom' with the actual model name if different
                }
            });


            res.render('member/dashboard', { logged:true, title: 'لوحة التحكم - العلم نور',member});

        }catch(error){

console.log(error)

        }

        // const members = await Member.find({}).populate({
        //     path: 'invoice',
        //     populate: {
        //         path: 'classroom',
        //         model: 'Classroom' // Replace 'Classroom' with the actual model name if different
        //     }
        // });

        // const classrooms = await Classroom.find({});
        // const departments = Array.from(
        //     new Set(classrooms.map(classroom => classroom.department))
        //   );

    } catch (err) {
        console.error(err);
        res.send('حدث خطأ');
    }
};

exports.getClassroom = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) return res.redirect('/member/login');

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const member = await Member.findById(decoded.id).populate({
            path: 'invoice',
            populate: {
                path: 'classroom',
                model: 'Classroom'
            }
        });

        const invoice = member.invoice.find(invoice => invoice._id == invoiceId);

        if (!invoice || !invoice.active) {
            return res.redirect('/member/dashboard');
        }

        // جلب جميع الدروس المرتبطة بالفصل الدراسي
        const lessons = await Lesson.find({ classroom: invoice.classroom._id });

        // تنسيق البيانات بالشكل المطلوب للـ frontend
        const formattedData = {
            [invoice._id]: {
                title: invoice.classroom.name,
                onlineMeetingLink:invoice.classroom.onlineMeetingLink,
                schedule:invoice.classroom.schedule,
                lessons: lessons.map((lesson, index) => ({
                    id: index + 1, // يمكن استخدام lesson._id.toString() إذا أردت معرف فريد
                    title: lesson.name,
                    videoUrl: lesson.videoLink,
                    quizUrl: lesson.officeFormLinks
                }))
            }
        };

        res.render('member/classroom', { logged:true, title: 'لوحة التحكم - العلم نور',lessons:formattedData});
    } catch (error) {
        console.error(error);
        return res.redirect('/member/dashboard');
    }
};

