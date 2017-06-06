
var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: String,
  link: String,
  description: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: String
});

mongoose.model('Course', CourseSchema);
