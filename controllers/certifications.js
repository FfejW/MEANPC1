var mongoose = require('mongoose');
var Certification = mongoose.model('Certification');

const certificationParam = function (req, res, next, id) {
    var query = Certification.findById(id);
    
    query.exec(function (err, certification) {
        if (err) { return next(err); }
        if (!certification) { return next(new Error("can't find certification")); }
        
        req.certification = certification;
        return next();
    });
}

// get all certifications
const getCertifications = function (req, res, next) {
    Certification.find(function (err, certifications) {
        if (err) { return next(err); }
        
        res.json(certifications);
    });
};

// return a certification
const getCertification = function (req, res, next) {
    res.json(req.certification);
};

// save a certification
const addCertification = function (req, res, next) {
    var certification = new Certification(req.body);
    certification.author = req.payload.username;
    
    certification.save(function (err, certification) {
        if (err) { return next(err); }
        
        res.json(certification);
    });
};

// update a certification
const updateCertification = function (req, res, next) {
    req.certification.description = req.body.description;
    
    req.certification.save(function (err, certification) {
        if (err) { return next(err); }
        
        res.json(certification);
    });
};

// delete a certification
const deleteCertification = function (req, res, next) {
    return req.certification.remove()
		.then(function () {
        return res.sendStatus(204);
    });

	//add authentication
};

const addCertificationToUser = function (req, res, next) {
    var certification = new Certification(req.body);
    req.user.addCertification(certification);
}

module.exports = {
    certificationParam : certificationParam,
    getCertifications : getCertifications,
    getCertification : getCertification,
    addCertification : addCertification,
    updateCertification : updateCertification,
    deleteCertification : deleteCertification,
    addCertificationToUser : addCertificationToUser
};