import React, { Component } from 'react';

import { firestore } from './base.js';

import { Form, FormGroup, Label, Input, Button, Alert, Container, Col } from 'reactstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';

import './Graphs.css';

class Graphs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: props.uid,

      data: [
        {name: 'HW 1', uv: 4000, pv: 2400, amt: 2400},
        {name: 'HW 2', uv: 3000, pv: 1398, amt: 2210},
        {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
        {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
        {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
        {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
        {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
      ],

      yourGrades: [
        {name: 'HW 1', grade: 80, avg: 84, med: 80},
        {name: 'HW 2', grade: 74, avg: 84, med: 82},
        {name: 'HW 3', grade: 93, avg: 65, med: 66},
        {name: 'Quiz 1', grade: 98, avg: 75, med: 83},
        {name: 'Exam 1', grade: 23, avg: 90, med: 85},
        {name: 'HW 4', grade: 53, avg: 43, med: 50},
        {name: 'Quiz 2', grade: 76, avg: 46, med: 55},
      ],

      assignmentDist: [
        /*{name: 'HW 1', grades: [80, 74, 93, 98, 23, 53, 76]},*/
        {grade: 80},
        {grade: 74},
        {grade: 93},
        {grade: 98},
        {grade: 23},
        {grade: 53, avg: 43, med: 50},
        {grade: 76, avg: 46, med: 55},
        {grade: 80, avg: 84, med: 80},
        {grade: 74, avg: 84, med: 82},
        {grade: 93, avg: 65, med: 66},
        {grade: 98, avg: 75, med: 83},
        {grade: 23, avg: 90, med: 85},
        {grade: 53, avg: 43, med: 50},
        {grade: 76, avg: 46, med: 55},
        {grade: 80, avg: 84, med: 80},
        {grade: 74, avg: 84, med: 82},
        {grade: 93, avg: 65, med: 66},
        {grade: 98, avg: 75, med: 83},
        {grade: 23, avg: 90, med: 85},
        {grade: 53, avg: 43, med: 50},
        {grade: 76, avg: 46, med: 55},
      ],
    };
  };

  compareValues(key) {
    return function(a, b) {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      /*let grade1 = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
      let grade2 = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];*/
      let grade1 = a[key];
      let grade2 = b[key];

      let comparison = 0;
      if (grade1 > grade2) {
        comparison = 1;
      } else if (grade1 < grade2) {
        comparison = -1;
      }
      return comparison;
    };
  }

  render = () => {
    this.state.assignmentDist.sort(this.compareValues("grade"));

    return (
      /*<LineChart width={600} height={300} data={this.state.data}
                 margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>*/


/*      <BarChart width={600} height={300} data={this.state.yourGrades}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        <Bar dataKey="grade" fill="#21CE99" />
        <Bar dataKey="avg" fill="#bf8bff" />
        <Bar dataKey="med" fill="#b39eb5" />
      </BarChart>*/
      <AreaChart width={730} height={250} data={this.state.assignmentDist}
                 margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis/>
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="grade" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>

    );
  }
}

export default Graphs;