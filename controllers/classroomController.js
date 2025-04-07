const Classroom = require('../models/Classroom');
const Lesson = require('../models/Lesson');

// عرض قائمة القاعات الدراسية
exports.getList = async (req, res) => {
  try {
    const classrooms = await Classroom.find({});
    res.render('classroom/list', { title: 'إدارة القاعات الدراسية - العلم نور', classrooms });
  } catch (error) {
    console.error(error);
    res.send('حدث خطأ أثناء جلب القاعات الدراسية');
  }
};

// عرض صفحة إضافة قاعة دراسية جديدة
exports.getAdd = (req, res) => {
  res.render('classroom/add', { title: 'إضافة قاعة دراسية - العلم نور', error: null });
};

// معالجة إضافة قاعة دراسية جديدة
exports.postAdd = async (req, res) => {
  const { name, department, onlineMeetingLink , hallType } = req.body;
  try {
    const newClassroom = new Classroom({ name, department, hallType, onlineMeetingLink });
    await newClassroom.save();
    res.redirect('/classroom');
  } catch (error) {
    console.error(error);
    res.render('classroom/add', { title: 'إضافة قاعة دراسية - العلم نور', error: 'حدث خطأ أثناء إضافة القاعة الدراسية' });
  }
};
exports.postEditLink = async (req, res) => {
  const {classroomId, onlineMeetingLink } = req.body;
  try {

    console.log(onlineMeetingLink,classroomId);
    const classroom = await Classroom.findOneAndUpdate({_id:classroomId},{onlineMeetingLink});

    res.redirect('/classroom');
  } catch (error) {
    console.error(error);
    res.render('classroom', { title: 'إضافة قاعة دراسية - العلم نور', error: 'حدث خطأ أثناء تعديل القاعة الدراسية' });
  }
};
// عرض تفاصيل القاعة الدراسية مع قائمة الدروس
exports.getDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const classroom = await Classroom.findById(id);
    if (!classroom) {
      return res.send('القاعة الدراسية غير موجودة');
    }
    // جلب الدروس الخاصة بالقاعة من جدول Lesson
    const lessons = await Lesson.find({ classroom: id });
    res.render('classroom/details', { title: 'تفاصيل القاعة الدراسية - العلم نور', classroom, lessons });
  } catch (error) {
    console.error(error);
    res.send('حدث خطأ أثناء جلب تفاصيل القاعة الدراسية');
  }
};

// عرض صفحة إضافة درس جديد للقاعة الدراسية
exports.getAddLesson = async (req, res) => {
  const { id } = req.params; // معرف القاعة
  try {
    const classroom = await Classroom.findById(id);
    if (!classroom) {
      return res.send('القاعة الدراسية غير موجودة');
    }
    res.render('classroom/addLesson', { title: 'إضافة درس - العلم نور', classroom, error: null });
  } catch (error) {
    console.error(error);
    res.send('حدث خطأ أثناء جلب بيانات القاعة الدراسية');
  }
};

// معالجة إضافة درس جديد للقاعة الدراسية (يتم إنشاء سجل في جدول Lesson)
exports.postAddLesson = async (req, res) => {
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
    res.redirect('/classroom/' + id);
  } catch (error) {
    console.error(error);
    res.render('classroom/addLesson', { title: 'إضافة درس - العلم نور', classroom: { _id: id }, error: 'حدث خطأ أثناء إضافة الدرس' });
  }
};

// حذف قاعة دراسية (اختياري)
exports.deleteClassroom = async (req, res) => {
  const { id } = req.params;
  try {
    await Classroom.findByIdAndDelete(id);
    res.redirect('/classroom');
  } catch (error) {
    console.error(error);
    res.send('حدث خطأ أثناء حذف القاعة الدراسية');
  }
};

// حذف درس من القاعة الدراسية
exports.deleteLesson = async (req, res) => {
  const { classroomId, lessonId } = req.params;
  try {
    await Lesson.findByIdAndDelete(lessonId);
    res.redirect('/classroom/' + classroomId);
  } catch (error) {
    console.error(error);
    res.send('حدث خطأ أثناء حذف الدرس');
  }
};

// إضافة اختبار للدرس
exports.addTestToLesson = async (req, res) => {
  const { classroomId, lessonName } = req.params;
  const { testLink } = req.body;

  try {
    // البحث عن الدرس
    const lesson = await Lesson.findOne({ 
      name: lessonName,
      classroom: classroomId 
    });

    if (!lesson) {
      return res.status(404).json({ success: false, error: 'الدرس غير موجود' });
    }

    // إضافة رابط الاختبار الجديد إلى مصفوفة officeFormLinks
    if (!lesson.officeFormLinks) {
      lesson.officeFormLinks = [];
    }
    lesson.officeFormLinks.push(testLink);

    await lesson.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إضافة الاختبار' });
  }
};

// حذف اختبار من الدرس
exports.deleteTestFromLesson = async (req, res) => {
  const { classroomId, lessonName } = req.params;
  const { testLink } = req.body;

  try {
    // البحث عن الدرس
    const lesson = await Lesson.findOne({ 
      name: lessonName,
      classroom: classroomId 
    });

    if (!lesson) {
      return res.status(404).json({ success: false, error: 'الدرس غير موجود' });
    }

    // التأكد من وجود روابط للاختبارات
    if (!lesson.officeFormLinks || !lesson.officeFormLinks.length) {
      return res.status(400).json({ success: false, error: 'لا توجد اختبارات للحذف' });
    }

    // البحث عن الرابط وحذفه
    const linkIndex = lesson.officeFormLinks.indexOf(testLink);
    if (linkIndex === -1) {
      return res.status(400).json({ success: false, error: 'الاختبار غير موجود' });
    }

    // حذف الاختبار من المصفوفة
    lesson.officeFormLinks.splice(linkIndex, 1);

    await lesson.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء حذف الاختبار' });
  }
};
