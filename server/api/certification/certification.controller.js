/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/certifications              ->  index
 * POST    /api/certifications              ->  create
 * GET     /api/certifications/:id          ->  show
 * PUT     /api/certifications/:id          ->  upsert
 * PATCH   /api/certifications/:id          ->  patch
 * DELETE  /api/certifications/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Certification from './certification.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function populatePath(res, pathName) {
  return function(entity) {
    return new Promise(function(resolve, reject) {
      if(entity) {
        Certification.populate(entity, {path: pathName}, function(err, certification) {
          if(err) reject(null);

          resolve(certification);
        });
      } else {
        resolve(entity);
      }
    });
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Certifications
export function index(req, res) {
  return Certification.find()
    .populate('author')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Certification from the DB
export function show(req, res) {
  return Certification.findById(req.params.id)
    .populate('author')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Certification in the DB
export function create(req, res) {
  return Certification.create(req.body)
    .then(populatePath(res, 'author'))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Certification in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Certification.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Certification in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Certification.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Certification from the DB
export function destroy(req, res) {
  return Certification.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
