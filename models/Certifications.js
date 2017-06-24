
var mongoose = require('mongoose');

var CertificationSchema = new mongoose.Schema({
  name: String,
    link: String,
    description: String,
    requiredpdcs: String,
    pdcTypes: [String],
  author: String
});

mongoose.model('Certification', CertificationSchema);
