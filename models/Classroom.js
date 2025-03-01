const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  onlineMeetingLink: { type: String,  },
  hallType: { type: String, required: true },
  schedule: [
    {
      day: { 
        type: String, 
        required: true, 
        enum: ['الجمعة', 'الخميس', 'الأربعاء', 'الثلاثاء', 'الاثنين', 'الأحد', 'السبت'] 
      },
      time: { type: String, required: true } // يمكن استخدام تنسيق HH:MM
    }
  ]
  
});

module.exports = mongoose.model('Classroom', ClassroomSchema);
