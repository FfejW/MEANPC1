'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './course.events';

var CourseSchema = new mongoose.Schema({
  title: String,
  link: String,
  startdate: Date,
  enddate: Date,
  speaker: String,
  programtype: String,
  description: String,
  pdcs: String,
  credits: {
    type: Number,
    default: 1
  },
  certification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certification'
  },
  pdcType: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

registerEvents(CourseSchema);
export default mongoose.model('Course', CourseSchema);
