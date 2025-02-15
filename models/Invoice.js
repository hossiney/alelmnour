const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true  },
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  expirationDate: { type: Date, required: true },
  active:{type:Boolean, default: true, },
  date : { type : Date, default: Date.now }

});

module.exports = mongoose.model('Invoice', InvoiceSchema);
