'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './certification.events';

var CertificationSchema = new mongoose.Schema({
  title: String,
  link: String,
  description: String,
  requiredpdcs: String,
  pdcTypes: [String],
  author: String
});

registerEvents(CertificationSchema);
export default mongoose.model('Certification', CertificationSchema);
