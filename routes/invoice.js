const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// عرض قائمة الفواتير
router.get('/', invoiceController.getInvoiceList);

// صفحة إضافة فاتورة جديدة
router.get('/add', invoiceController.getAddInvoice);
router.post('/add', invoiceController.postAddInvoice);

router.get('/delete/:id', invoiceController.deleteInvoice);

module.exports = router;
