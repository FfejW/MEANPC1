'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './post.events';

var PostSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(PostSchema);
export default mongoose.model('Post', PostSchema);
