'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './course.events';

var CourseSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(CourseSchema);
export default mongoose.model('Course', CourseSchema);
