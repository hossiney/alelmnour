const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now },
  videoLink: { type: String, required: true },
  // رابط نموذج الاختبار من Office Forms
  officeFormLinks: [{ type: String }],  // الربط بالقاعة الدراسية التي ينتمي إليها الدرس
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true }
});

module.exports = mongoose.model('Lesson', LessonSchema);
