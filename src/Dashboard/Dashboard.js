import React, {Component} from 'react';
import { PieChart, Cell, Pie, Tooltip } from 'recharts';
import {Row, Col } from 'reactstrap';

import './Dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Col xs={2}/>
        <Col xs={10} className="col-centered">
          <Row className="dbBG dbGraphs dbBorder">
            <Col>
              <Row className="dbGraphs">
                <Col>
                  <h1>Pass/Fail %</h1>
                </Col>
              </Row>
              <Row className="chartAlign">
                <PieChart className="piePad" width={365} height={250}>
                  <Pie data={this.props.passFail} dataKey="value" nameKey="name" cx="50%" cy="50%"
                       outerRadius={70} fill="#8884d8" label>{
                    this.props.passFail.map((entry, index) => <Cell key={entry} fill={this.props.passFail[index].color}/>)
                  } </Pie><Tooltip/>
                </PieChart>
              </Row>
            </Col>

            <Col className="dbGraphs">
              <Row className="dbGraphs">
                <Col>
                  <h1>Average Grade</h1>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                </Col>
              </Row>
              <Row className="dbGraphs">
                <Col>
                  <h3>
                    {this.props.avgGrade}{" "}%
                  </h3>
                </Col>
              </Row>
            </Col>

            <Col>
              <br/>
              <br/>
              <Row className="dbGraphs">
                <Col>
                  <h1>Grade Distribution</h1>
                </Col>
              </Row>
              <Row className="chartAlign">
                <PieChart className="piePad" width={365} height={250}>
                  <Pie data={this.props.gradeDist} dataKey="value" nameKey="name" cx="50%"
                       cy="50%"
                       outerRadius={70} fill="#8884d8" label>{
                    this.props.gradeDist.map((entry, index) => <Cell key={entry} fill={this.props.gradeDist[index].color}/>)
                  }</Pie>
                  <Tooltip/>
                </PieChart>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={2}/>
      </div>
    )
  }
}

export default Dashboard