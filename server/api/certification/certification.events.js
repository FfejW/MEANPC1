/**
 * Certification model events
 */

'use strict';

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
function registerEvents(Certification) {
  for(var e in events) {
    let event = events[e];
    Certification.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    CertificationEvents.emit(event + ':' + doc._id, doc);
    CertificationEvents.emit(event, doc);
  };
}

export {registerEvents};
export default CertificationEvents;
