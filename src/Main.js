import React, { Component } from 'react';

import { firestore } from "./base.js";

import HomePage from './HomePage/HomePage';

class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {

      page: this.props.page,

      uid: this.props.uid,

      role: null,

      classes: [{
        class: null,
        teacher: null,
        code: null,
      }],

      dates: [{
        title: null,
        start: null,
        end: null,
      }],

      announcements: [{
        title: null,
        subtitle: null,
        message: null,
        class: null,
      }],
    }
  }

  /**
   *
   * Now that we have the teacher uid and the students
   * array of classes,
   *
   * 1. We got to the teachers uid and find her classes
   *
   * 2. When then find the classes that correlate with the
   *    student and the teacher
   *
   * 3. Then we get the deadlines from the central classroom data
   *    and set state to update the calendar
   *
   */
  getDeadlines = () => {

    let object = [{}];

    let self = this;

    for(let j in self.state.classes) {

      let docRef = firestore.collection("classes").doc(self.state.classes[j].code);

      docRef.get().then(function (doc) {
        if (doc.exists) {
          let data = doc.data();
          for (let i in data.deadlines) {
            if (data.deadlines.hasOwnProperty(i)) {
              object.unshift({
                title: data.deadlines[i].title,
                start: new Date(data.deadlines[i].startYear, data.deadlines[i].startMonth, data.deadlines[i].startDay, data.deadlines[i].startHour, data.deadlines[i].startMinute, 0),
                end: new Date(data.deadlines[i].endYear, data.deadlines[i].endMonth, data.deadlines[i].endDay, data.deadlines[i].endHour, data.deadlines[i].endMinute, 0),
              });
              self.setState({
                dates: object,
              })
            }
          }
        } else {
          console.log("No such document!");
        }
        //self.props.updateDates(self.state.dates);
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    object.pop();

    self.setState({
      dates: object
    });

  };

  /**
   *
   * Now that we have the class code and the students
   * array of classes,
   *
   * 1. We go to the class code and find her classes
   *
   * 2. We then find the classes that correlate with the
   *    student and the teacher
   *
   * 3. Then we get the announcements from the central classroom data
   *    and set state to update the calendar
   *
   */
  getAnnouncements = () => {

    let object = [{}];

    let self = this;

    for(let j in self.state.classes) {

      let docRef = firestore.collection("classes").doc(self.state.classes[j].code);

      docRef.get().then(function (doc) {
        if (doc.exists) {
          let data = doc.data();
          for (let i in data.Announcements) {
            if (data.Announcements.hasOwnProperty(i)) {
              object.unshift({
                class: self.state.classes[j].class,
                title: data.Announcements[i].title,
                subtitle: data.Announcements[i].subtitle,
                message: data.Announcements[i].message,
              });
              self.setState({
                announcements: object,
              })
            }
          }
        } else {
          console.log("No such document!");
        }
        //elf.props.updateAnnouncements(self.state.announcements);
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    object.pop();

    self.setState({
      announcements: object
    });

  };

  updateClasses = (classes) => {
    this.setState({
      classes: classes,
    });
    this.getAnnouncements();
    this.getDeadlines();
  };

  updateDates = (dates) => {
    this.setState({
      dates: dates,
    })
  };

  updateAnnouncements = (announcements) => {
    this.setState({
      announcements: announcements,
    })
  };

  render() {
    return (
      <HomePage
        page={this.props.page}
        uid={this.state.uid}
        classes={this.state.classes}
        dates={this.state.dates}
        announcements={this.state.announcements}
        updateClasses={ this.updateClasses }
        updateDates={ this.updateDates }
        updateAnnouncements={ this.updateAnnouncements }
        />
    )
  }
}

export default Main;
