'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './comment.events';

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

registerEvents(CommentSchema);
export default mongoose.model('Comment', CommentSchema);
