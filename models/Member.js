// models/Member.js
const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    invoice: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice'}],
    name: { type: String, required:true},
    date : { type : Date, default: Date.now }


    // يمكن إضافة حقول إضافية إذا دعت الحاجة
});

module.exports = mongoose.model('Member', MemberSchema);
