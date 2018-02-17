import React, { Component } from 'react';

import { firestore } from "../base";
import { Button } from 'reactstrap';

import Sidebar from 'react-sidebar';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import Side from './Side';

import './HomePage.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const mql = window.matchMedia(`(min-width: 800px)`);

BigCalendar.momentLocalizer(moment);

class HomePage extends Component {

  constructor(props) {
    super(props);


    /**
     * State of the Homepage
     *
     * uid: |String| current user firebase identifier.
     *
     * classes: |Object of arrays|students array of objects holding their class name and teacher identifier
     *
     * mql: |Boolean| used for screen size recognition
     *
     * docked: |Boolean| set sidebar to show or hide;
     *
     * open: |Boolean| set sidebar to show or hide;
     *
     * sideButtonVisibility: |Boolean| show or hide side bar gone button
     **/
    this.state = {
      uid: props.uid,

      classes: [{
        class: null,
        teacher: null,
      }],

      dates: [{
        title: null,
        start: null,
        end: null,
      }],

      mql: mql,
      docked: props.docked,
      open: props.open,
      sideButtonVisibility: !props.docked,
    };
  }

  /**
   *
   * Toggle side bar from hidden side bar button
   *
   */
  dockSideBar = () => {
    if (this.state.sidebarDocked)
      this.setState({
        sidebarOpen: false,
        sideButtonVisibility: true,
      });
    else
      this.setState({
        sidebarOpen: true,
        sideButtonVisibility: false,
      });
  };


  /**
   *
   * Set state when side bar is open
   *
   * @param open: |Boolean|
   */
  onSetSidebarOpen = (open) => {
    this.setState({
      sidebarOpen: open,
      sideButtonVisibility: true,
    });
  };

  /**
   *
   * Method called before components are loaded
   * on the page.
   *
   * 1. Gets classes from firebase
   *
   * 2. Sets screen size action listener
   *
   * 3. Sets sidebar visibility
   *
   */
  componentWillMount() {
    this.getClasses();
    mql.addListener(this.mediaQueryChanged);
    this.setState({
      mql: mql,
      sidebarDocked: mql.matches,
      sideButtonVisibility: !this.state.mql.matches,
    });
  };

  /**
   *
   * Call firebase to get users array of classes
   * that hold their teachers uid.
   *
   * When then use the uid of the teacher to compare with her
   * classroom data.
   *
   */
  getClasses = () => {
    let docRef = firestore.collection("users").doc(this.state.uid);
    let self = this;

    docRef.get().then(function(doc) {
      if (doc.exists) {
        self.setState({
          classes: doc.data().classes,
        });
        self.getDeadlines();
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    })
  };

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

      let docRef = firestore.collection("users").doc(self.state.classes[j].teacher);
      let dateRef = docRef.collection(self.state.classes[j].class).doc("deadlines");


      dateRef.get().then(function (doc) {
        if (doc.exists) {
          let data = doc.data();
          for (let i in data.array) {
            object.unshift( {
              title: data.array[i].title,
              start: new Date(data.array[i].year, data.array[i].month, data.array[i].day),
              end: new Date(data.array[i].year, data.array[i].month, data.array[i].day),
            })
            self.setState({
              dates: object,
            })
          }

        } else {
          console.log("No such document!");
        }
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
   * Method called when component is leaving
   *
   * Removes screen size action listener
   *
   */
  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  };

  /**
   *
   * Screen size changes called by the action listener
   *
   */
  mediaQueryChanged = () => {
    this.setState({
      sidebarDocked: this.state.mql.matches,
      sideButtonVisibility: !this.state.mql.matches,
    });
  };

  /**
   *
   * Sets color of dates on calendar
   *
   * @returns {{style: {backgroundColor: string}}}
   */
  eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: '#21ce99',
      }
    };
  };

  /**
   *
   * Method called to add components to the webpage
   *
   * 1. Creates the side bar
   *
   * 2. Set sidebar styles
   *
   * 3. Set calendar styles
   *
   * 4. Render
   *
   *    a. All wrapped in a side bar
   *        A. If the screen is large enough show
   *           Side bar, if not show button to expand
   *        B. Add Calendar to page
   *
   * @returns {XML}
   */
  render() {

    let sidebarContent = <Side classes={this.state.classes} />;

    const sidebarStyles = {
      sidebar: {
        backgroundColor: 'f3f3f3',
        width: '8em',
        textAlign: 'center',
      },
      overlay: {
        backgroundColor: '#f3f3f3'
      },
    };

    const calendarStyles = {
      padding: "5em 0em 0em 5em",
      height: "55rem",
      width: "85rem"
    };

    return (

      <Sidebar styles={sidebarStyles}
               sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               docked={this.state.sidebarDocked}
               onSetOpen={this.onSetSidebarOpen}>

        {this.state.sideButtonVisibility
          ?
          <Button outline onClick={this.dockSideBar}>
            <i className="fas fa-bars"/>
          </Button>
          :
          null
        }

        <BigCalendar
          events={this.state.dates}
          style={calendarStyles}
          defaultDate={new Date()}
          eventPropGetter={(this.eventStyleGetter)}
        />

      </Sidebar>
    );
  }
}

export default HomePage;
