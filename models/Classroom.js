const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  onlineMeetingLink: { type: String,  },
  hallType: { type: String, required: true },
});

module.exports = mongoose.model('Classroom', ClassroomSchema);
