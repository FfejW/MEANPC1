
var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: String,
    link: String,
    startdate: Date,
    enddate: Date,
    speaker: String,
    programtype: String,
    description: String,
    pdcs: String,
    certification: { type: mongoose.Schema.Types.ObjectId, ref: 'Certification' },
    pdcType: String,
  author: String
});

mongoose.model('Course', CourseSchema);
