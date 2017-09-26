/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Course from '../api/course/course.model';
import Certification from '../api/certification/certification.model';
import User from '../api/user/user.model';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    Course.find({}).remove()
      .then(() => {
        let course = Course.create({
          name: 'Spanish 1',
          info: 'Learn to read and write Spanish.'
        }, {
          name: 'JavaScript',
          info: 'Introductory JavaScript programming'
        }, {
          name: 'Guitar',
          info: 'Revolutionary online Guitar course'
        }, {
          name: 'Calculus I',
          info: 'Intro to calculus'
        }, {
          name: 'Cooking',
          info: 'Learn how to cook'
        });
        return course;
      })
      .then(() => console.log('finished populating courses'))
      .catch(err => console.log('error populating courses', err));

    Certification.find({}).remove()
      .then(() => {
        let certification = Certification.create({
          name: 'Spanish Speaker',
          info: 'Successfully completed Spanish I course.'
        }, {
          name: 'JavaScript Programmer',
          info: 'Completed Javascript programming course'
        }, {
          name: 'Guitar Player',
          info: 'Completed Guitar course'
        }, {
          name: 'Mathematician',
          info: 'Completed Calculus I'
        }, {
          name: 'Chef',
          info: 'Completed cooking course'
        });
        return certification;
      })
      .then(() => console.log('finished populating certifications'))
      .catch(err => console.log('error populating certifications', err));

    User.find({}).remove()
      .then(() => {
        User.create({
          provider: 'local',
          name: 'Test User',
          email: 'test@example.com',
          password: 'test'
        }, {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin'
        })
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err));
      });
  }
}
