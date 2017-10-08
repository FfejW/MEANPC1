/**
 * Certification model events
 */

'use strict';

import Certification from './certification.model';
import {EventEmitter} from 'events';
var CertificationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CertificationEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(certification) {
  for(var e in events) {
    let event = events[e];
    certification.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    Certification.populate(doc, {path: 'author'}, function(err, certification) {
      if(err) return;
      CertificationEvents.emit(event + ':' + certification._id, certification);
      CertificationEvents.emit(event, certification);
    });
  };
}

export {registerEvents};
export default CertificationEvents;
