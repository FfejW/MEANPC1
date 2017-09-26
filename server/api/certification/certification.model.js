'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './certification.events';

var CertificationSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(CertificationSchema);
export default mongoose.model('Certification', CertificationSchema);
