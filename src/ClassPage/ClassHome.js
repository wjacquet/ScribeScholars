import React, { Component } from 'react';

import { Nav, NavLink } from 'reactstrap';
import { NavLink as RouterLink } from 'react-router-dom'

import AssignTable from "./AssignTable";
import HomeworkTable from './HomeworkTable';
import Cards from '../HomePage/Cards';
import './ClassHome.css';

class ClassHome extends Component {

  constructor(props) {
    super(props);

    this.state = {
      announcements: [{
        title: null,
        subtitle: null,
        message: null,
        class: null,
      }],

      assignments: [{
        code: null,
        name: null,
        maxscore: null,
      }],

      classImage: null,

      announcementsActive: true,
      lessonsActive: false,
      homeworkActive: false,
      discussionActive: false,
    };
  }

  componentWillMount() {
    this.props.selectClass(this.props.path);
    this.props.updateClassPicture(this.props.path);
  }

  switchAnnouncement = () => {
    this.setState({
      announcementsActive: true,
      lessonsActive: false,
      homeworkActive: false,
      discussionActive: false,
    })
  };

  switchLessons = () => {
    this.setState({
      announcementsActive: false,
      lessonsActive: true,
      homeworkActive: false,
      discussionActive: false,
    })
  };

  switchHomework = () => {
    this.setState({
      announcementsActive: false,
      lessonsActive: false,
      homeworkActive: true,
      discussionActive: false,
    });

  };

  switchDiscussions = () => {
    this.setState({
      announcementsActive: false,
      lessonsActive: false,
      homeworkActive: false,
      discussionActive: true,
    })
  };

  render() {
    const jumboStyle = {
      background: `url(${this.props.classImage}) no-repeat center center`,
    };

      return (
        <div>
          <div style={jumboStyle} className="jumbotron">
            <h1>{this.props.className}</h1>
            <p className="lead"> {this.props.selectedClass}</p>
          </div>

          <Nav horizontal="center" tabs>
            <RouterLink className="navLinks" to={`${this.props.code}/announcements`}>
              <NavLink onClick={this.switchAnnouncement}
                       active={this.state.announcementsActive}>Announcements</NavLink>
            </RouterLink>
            <RouterLink className="navLinks" to={`${this.props.code}/lessons`}>
              <NavLink onClick={this.switchLessons} active={this.state.lessonsActive}>In-Class
                       Lessons</NavLink>
            </RouterLink>
            <RouterLink className="navLinks" to={`${this.props.code}/homework`}>
              <NavLink onClick={this.switchHomework} active={this.state.homeworkActive}>Homework</NavLink>
            </RouterLink>
            <RouterLink className="navLinks" to={`${this.props.code}/discussion`}>
              <NavLink onClick={this.switchDiscussions} active={this.state.discussionActive}>Discussion
                Board</NavLink>
            </RouterLink>
          </Nav>

          {this.state.announcementsActive
            ?
            <div>
              <div className="announcementsDiv">
                <Cards announcements={this.props.classAnnouncements}/>
              </div>
            </div>
            :
            <div>
            </div>
          }

          {this.state.homeworkActive
            ?
            <div>
              <HomeworkTable homeworks={this.props.homeworks} />
            </div>
            :
            <div>
            </div>
          }
          {this.state.lessonsActive
            ?
            <AssignTable assignments={this.props.assignments} />
            :
            <div>
            </div>
          }
        </div>
      )
  }
}

export default ClassHome;
