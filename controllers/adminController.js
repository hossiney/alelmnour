// controllers/adminController.js
const Admin = require('../models/Admin');
const Member = require('../models/Member');
const Classroom = require('../models/Classroom');
const Invoice = require('../models/Invoice');
const Lesson = require('../models/Lesson');
const cron = require('node-cron');

const jwt = require('jsonwebtoken');


cron.schedule('0 0 * * *', async () => { // Runs daily at midnight
  try {
    const now = new Date();
    const result = await Invoice.updateMany(
      { expirationDate: { $lt: now }, active: true },
      { $set: { active: false } }
    );
    console.log(`Updated ${result.modifiedCount} expired invoices.`);
  } catch (error) {
    console.error('Error updating invoices:', error);
  }
});



// عرض صفحة تسجيل دخول المدير
exports.getLogin = (req, res) => {
    res.render('admin/login', { title: 'تسجيل دخول المدير - العلم نور', error: null });
};

// عملية تسجيل دخول المدير

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return   res.render('admin/login', { title: 'تسجيل دخول المدير - العلم نور', error: ' بيانات الدخول غير صحيحة' });    

        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return   res.render('admin/login', { title: 'تسجيل دخول المدير - العلم نور', error: ' بيانات الدخول غير صحيحة' });    
        }

        // إنشاء التوكن
        const token = jwt.sign(
            { id: admin._id, email: admin.email , role:'admin'},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // إرسال التوكن كـ "كوكي" أو في الـ "response"
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/admin/dashboard');
    
    } catch (err) {
        console.error('Login Error:', err);
        res.render('admin/login', { title: 'تسجيل دخول المدير - العلم نور', error: 'حدث خطأ أثناء تسجيل الدخول' });    }
};


exports.getSignout = (req, res) => {
    // Clear the token cookie to log the user out
    res.clearCookie('token');
    // Redirect to the login page after signing out
    res.redirect('/admin/login');
};

// عرض لوحة التحكم مع قائمة الأعضاء
exports.getDashboard = async (req, res) => {
    try {
        
        const members = await Member.find({}).populate({
            path: 'invoice',
            populate: {
                path: 'classroom',
                model: 'Classroom' // Replace 'Classroom' with the actual model name if different
            }
        });

        const classrooms = await Classroom.find({});
        const departments = Array.from(
            new Set(classrooms.map(classroom => classroom.department))
          );

        res.render('admin/dashboard', { logged:true, title: 'لوحة التحكم - العلم نور', members , classrooms , departments});
    } catch (err) {
        console.error(err);
        res.send('حدث خطأ');
    }
};

// إضافة عضو جديد
exports.addMember = async (req, res) => {
    const { mobile, invoice , name , classroomId, expirationDate } = req.body;
    try {

        const checkUser = await Member.findOne({ mobile: mobile});

        if (checkUser) return res.send('الرقم الذي ادخلته موجود مسبقا');
        
        const newMember = new Member({ mobile , name});

        const newInvoice = new Invoice({ 
            
            invoiceNumber: invoice,
            member: newMember._id,
            classroom:classroomId ,
            expirationDate: expirationDate
        })

        await newInvoice.save();
        
        newMember.invoice.push(newInvoice._id);

        await newMember.save();

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.send('حدث خطأ أثناء إضافة العضو');
    }
};

// حذف عضو
exports.deleteMember = async (req, res) => {
    const { id } = req.params;
    try {
        await Member.findByIdAndDelete(id);
        await Invoice.deleteMany({member:id});

        
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.send('حدث خطأ أثناء حذف العضو');
    }
};

exports.deleteMember = async (req, res) => {
    const { id } = req.params;
    try {
        await Member.findByIdAndDelete(id);
        await Invoice.deleteMany({member:id});

        
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.send('حدث خطأ أثناء حذف العضو');
    }
};

exports.getClassroomsList = async (req, res) => {
    try {
      const classrooms = await Classroom.find({});
      res.render('classroom/list', { logged:true, title: 'إدارة القاعات الدراسية - العلم نور', classrooms });
    } catch (error) {
      console.error(error);
      res.send('حدث خطأ أثناء جلب القاعات الدراسية');
    }
  };


// عرض صفحة إضافة قاعة دراسية جديدة
exports.getAddClassroom = (req, res) => {
    res.render('classroom/add', { logged:true,title: 'إضافة قاعة دراسية - العلم نور', error: null });
  };
  
  // معالجة إضافة قاعة دراسية جديدة
  exports.postAddClassroom = async (req, res) => {
    const { name, department, onlineMeetingLink , hallType } = req.body;
    try {
      const newClassroom = new Classroom({ name, department, hallType, onlineMeetingLink });
      await newClassroom.save();
      res.redirect('/admin/classroom');
    } catch (error) {
      console.error(error);
      res.render('classroom/add', { logged:true, title: 'إضافة قاعة دراسية - العلم نور', error: 'حدث خطأ أثناء إضافة القاعة الدراسية' });
    }
  };
  exports.postEditLinkClassroom = async (req, res) => {
    const {classroomId, onlineMeetingLink } = req.body;
    try {
  
      console.log(onlineMeetingLink,classroomId);
      const classroom = await Classroom.findOneAndUpdate({_id:classroomId},{onlineMeetingLink});
  
      res.redirect('/admin/classroom');
    } catch (error) {
      console.error(error);
      res.render('classroom', { logged:true, title: 'إضافة قاعة دراسية - العلم نور', error: 'حدث خطأ أثناء تعديل القاعة الدراسية' });
    }
  };
  // عرض تفاصيل القاعة الدراسية مع قائمة الدروس
  exports.getDetailsClassroom = async (req, res) => {
    const { id } = req.params;
    try {
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.send('القاعة الدراسية غير موجودة');
      }
      // جلب الدروس الخاصة بالقاعة من جدول Lesson
      const lessons = await Lesson.find({ classroom: id });
      res.render('classroom/details', { logged:true,title: 'تفاصيل القاعة الدراسية - العلم نور', classroom, lessons });
    } catch (error) {
      console.error(error);
      res.send('حدث خطأ أثناء جلب تفاصيل القاعة الدراسية');
    }
  };
  
  // عرض صفحة إضافة درس جديد للقاعة الدراسية
  exports.getAddLessonClassroom = async (req, res) => {
    const { id } = req.params; // معرف القاعة
    try {
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.send('القاعة الدراسية غير موجودة');
      }
      res.render('classroom/addLesson', { logged:true,title: 'إضافة درس - العلم نور', classroom, error: null });
    } catch (error) {
      console.error(error);
      res.send('حدث خطأ أثناء جلب بيانات القاعة الدراسية');
    }
  };
  
  // معالجة إضافة درس جديد للقاعة الدراسية (يتم إنشاء سجل في جدول Lesson)
  exports.postAddLessonClassroom = async (req, res) => {
    const { id } = req.params; // معرف القاعة
    const { lessonName, videoLink, publishedAt, officeFormLink } = req.body;
    try {
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.send('القاعة الدراسية غير موجودة');
      }
      const newLesson = new Lesson({
        name: lessonName,
        videoLink,
        publishedAt: publishedAt ? new Date(publishedAt) : Date.now(),
        officeFormLink,
        classroom: id
      });
      await newLesson.save();
      res.redirect('/admin/classroom/' + id);
    } catch (error) {
      console.error(error);
      res.render('classroom/addLesson', { logged:true,title: 'إضافة درس - العلم نور', classroom: { _id: id }, error: 'حدث خطأ أثناء إضافة الدرس' });
    }
  };
  
  // حذف قاعة دراسية (اختياري)
  exports.deleteClassroom = async (req, res) => {
    const { id } = req.params;
    try {
      await Classroom.findByIdAndDelete(id);
      res.redirect('/admin/classroom');
    } catch (error) {
      console.error(error);
      res.send('حدث خطأ أثناء حذف القاعة الدراسية');
    }
  };
  
  // حذف درس من القاعة الدراسية
  exports.deleteLessonClassroom = async (req, res) => {
    const { classroomId, lessonId } = req.params;
    try {
      await Lesson.findByIdAndDelete(lessonId);
      res.redirect('/admin/classroom/' + classroomId);
    } catch (error) {
      console.error(error);
      res.send('حدث خطأ أثناء حذف الدرس');
    }
  };
  

  // عرض قائمة الفواتير
// controllers/invoiceController.js
exports.getInvoiceList = async (req, res) => {
    try {
      const invoices = await Invoice.find({}).populate('classroom').populate('member');
      res.render('invoice/list', { logged:true, title: 'إدارة الفواتير - العلم نور', invoices });
    } catch (error) {
      console.error(error);
      res.send('حدث خطأ أثناء جلب الفواتير');
    }
  };
  

// عرض صفحة إضافة فاتورة جديدة
exports.getAddInvoice = async (req, res) => {
  try {
    // جلب القاعات الدراسية للاختيار منها
    const classrooms = await Classroom.find({});
    res.render('invoice/add', { logged:true, title: 'إضافة فاتورة - العلم نور', classrooms, error: null });
  } catch (error) {
    console.error(error);
    res.send('حدث خطأ أثناء جلب بيانات القاعات الدراسية');
  }
};

// معالجة إضافة فاتورة جديدة
exports.postAddInvoice = async (req, res) => {
  const { invoiceNumber, memberId, classroomId, expirationDate } = req.body;
  try {
    const newInvoice = new Invoice({

      invoiceNumber:invoiceNumber,
      member:memberId ,
      classroom: classroomId,
      expirationDate: expirationDate,



    });
    await newInvoice.save();
    const member = await Member.findByIdAndUpdate(memberId,{$push:{invoice:newInvoice._id}});
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.render('admin/dashboard', { logged:true, title: 'إضافة فاتورة - العلم نور', classrooms: [], error: 'حدث خطأ أثناء إضافة الفاتورة' });
  }
};


exports.deleteInvoice = async (req, res) => {
  const { id } = req.params; // The ID of the invoice to be deleted

  try {
      // Find the invoice to be deleted
      const invoice = await Invoice.findById(id);

      if (!invoice) {
        return res.send('حدث خطأ أثناء حذف الفاتورة');
      }

      // Find the member associated with the invoice (assuming you have the member ID)
      const memberId = invoice.member; // Replace this with the correct field if necessary

      // Remove the invoice reference from the specific member
      await Member.findByIdAndUpdate(memberId, { $pull: { invoice: id } });

      // Delete the invoice
      await Invoice.findByIdAndDelete(id);

      res.redirect('/admin/invoice');
  } catch (err) {
      console.error(err);
      res.send('حدث خطأ أثناء حذف الفاتورة');
  }
};