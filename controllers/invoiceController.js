const Invoice = require('../models/Invoice');
const Member = require('../models/Member');

const Classroom = require('../models/Classroom');

// عرض قائمة الفواتير
// controllers/invoiceController.js
exports.getInvoiceList = async (req, res) => {
    try {
      const invoices = await Invoice.find({}).populate('classroom').populate('member');
      res.render('invoice/list', { title: 'إدارة الفواتير - العلم نور', invoices });
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
    res.render('invoice/add', { title: 'إضافة فاتورة - العلم نور', classrooms, error: null });
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
    res.render('admin/dashboard', { title: 'إضافة فاتورة - العلم نور', classrooms: [], error: 'حدث خطأ أثناء إضافة الفاتورة' });
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

      res.redirect('/invoice');
  } catch (err) {
      console.error(err);
      res.send('حدث خطأ أثناء حذف الفاتورة');
  }
};