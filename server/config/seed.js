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
  var theProfessional;
  var theProvider;
  var theAdmin;
  if(config.seedDB) {
    User.find({}).remove()
      .then(() => {
        User.create([{
          provider: 'local',
          name: 'Test User',
          email: 'test@example.com',
          password: 'test'
        }, {
          provider: 'local',
          role: 'Provider',
          name: 'Provider',
          email: 'provider@example.com',
          password: 'provider'
        }, {
          provider: 'local',
          role: 'Admin',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin'
        }])
        .then((users) => {
          theProfessional = users[0];
          theProvider = users[1];
          theAdmin = users[2];

          Course.find({}).remove()
            .then(() => {
              let course = Course.create({
                title: 'Spanish 1',
                description: 'Learn to read and write Spanish.',
                author: theAdmin._id
              }, {
                title: 'JavaScript',
                description: 'Introductory JavaScript programming',
                author: theAdmin._id
              }, {
                title: 'Guitar',
                description: 'Revolutionary online Guitar course',
                author: theAdmin._id
              }, {
                title: 'Calculus I',
                description: 'Intro to calculus',
                author: theAdmin._id
              }, {
                title: 'Cooking',
                description: 'Learn how to cook',
                author: theAdmin._id
              });
              return course;
            })
            .then(() => console.log('finished populating courses'))
            .catch(err => console.log('error populating courses', err));

          Certification.find({}).remove()
            .then(() => {
              let certification = Certification.create({
                title: 'Spanish Speaker',
                description: 'Successfully completed Spanish I course.',
                author: theAdmin._id
              }, {
                title: 'JavaScript Programmer',
                description: 'Completed Javascript programming course',
                author: theAdmin._id
              }, {
                title: 'Guitar Player',
                description: 'Completed Guitar course',
                author: theAdmin._id
              }, {
                title: 'Mathematician',
                description: 'Completed Calculus I',
                author: theAdmin._id
              }, {
                title: 'Chef',
                description: 'Completed cooking course',
                author: theAdmin._id
              });
              return certification;
            })
            .then(() => console.log('finished populating certifications'))
            .catch(err => console.log('error populating certifications', err));

          console.log('finished populating users')
        })
        .catch(err => console.log('error populating users', err));
      });


  }
}
