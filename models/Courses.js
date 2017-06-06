
var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: String,
  link: String,
  description: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: String
});

CourseSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Course', CourseSchema);
