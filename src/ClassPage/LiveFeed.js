import React, { Component } from 'react';

import LessonStats from './LiveComponents/LessonStats';
import LineBreak from './LiveComponents/LineBreak';
import LiveGraphs from './LiveComponents/LiveGraphs';
import StudentsChart from './LiveComponents/StudentsChart';


import './LiveFeed.css';

class LiveFeed extends Component {

  constructor() {
    super();

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <hr/>
        <br/>

        <LessonStats />

        <LineBreak />

        <LiveGraphs />

        <LineBreak />

        <StudentsChart />

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    );
  }
}

export default LiveFeed;
