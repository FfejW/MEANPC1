/**
 * Course model events
 */

'use strict';

import Course from './course.model';
import {EventEmitter} from 'events';
var CourseEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CourseEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(course) {
  for(var e in events) {
    let event = events[e];
    course.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    Course.populate(doc, {path: 'author'}, function(err, course) {
      if(err) return;
      CourseEvents.emit(event + ':' + course._id, course);
      CourseEvents.emit(event, course);
    });
  };
}

export {registerEvents};
export default CourseEvents;
