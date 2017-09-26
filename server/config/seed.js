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
          title: 'Spanish 1',
          description: 'Learn to read and write Spanish.'
        }, {
          title: 'JavaScript',
          description: 'Introductory JavaScript programming'
        }, {
          title: 'Guitar',
          description: 'Revolutionary online Guitar course'
        }, {
          title: 'Calculus I',
          description: 'Intro to calculus'
        }, {
          title: 'Cooking',
          description: 'Learn how to cook'
        });
        return course;
      })
      .then(() => console.log('finished populating courses'))
      .catch(err => console.log('error populating courses', err));

    Certification.find({}).remove()
      .then(() => {
        let certification = Certification.create({
          title: 'Spanish Speaker',
          description: 'Successfully completed Spanish I course.'
        }, {
          title: 'JavaScript Programmer',
          description: 'Completed Javascript programming course'
        }, {
          title: 'Guitar Player',
          description: 'Completed Guitar course'
        }, {
          title: 'Mathematician',
          description: 'Completed Calculus I'
        }, {
          title: 'Chef',
          description: 'Completed cooking course'
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
