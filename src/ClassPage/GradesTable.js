import React, { Component } from 'react';
import {Table, Container, Row, Col, Label, Button, Input } from 'reactstrap';
import { firestore } from "../base";
import Modal from 'react-modal';
import './Table.css'

class GradesTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uid: this.props.uid,
      code: this.props.code,
      score: 0,
      max_score: 0,
      gradeData: [],
      regrade_open: false,

      modal_assignment: {
        name: null,
        score: null,
        maxscore: null,
      },

      doneLoading: false
    };

    let self = this;
    let docRef = firestore.collection("users").doc(this.props.uid).collection("assignments").doc(this.props.code);
    docRef.get().then(function (doc) {

      self.setState({
        gradeData: doc.data().grades
      });

    }).then( function () {

      for(let i = 0; i < self.state.gradeData.length; i++){
        self.addScore(self.state.gradeData[i].score, self.state.gradeData[i].maxscore);
      }

      self.setState({ doneLoading: true });

    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
  }

  openRegradeModal = (index) => {
    let self = this;
    self.setState({
      modal_assignment: this.state.gradeData[index],
      regrade_open: true,
    });
  }

  closeRegradeModal = () => {
    let self = this;
    self.setState({ regrade_open: false });
  }

  onRegradeSubmit = () => {

  }

  addScore = (score, maxscore) => {
    let self = this;
    let sc = +self.state.score;
    let m_sc = +self.state.max_score;

    sc += +score;
    m_sc += +maxscore;

    self.setState({
      score: sc,
      max_score: m_sc,
    });
  };

  render() {

    if(!this.state.doneLoading){
      return (
        <div>
          <Label>
            LOADING
          </Label>
        </div>
        )
    }

    else {
      return (
        <div>
          <Container fluid>
            <Row>
              <Col className={"makeSpace"}>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className={"homeworkTitle"}>Grades</p>
              </Col>
            </Row>
            <Row>
              <Col className={"makeSpace"}>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Table>
                  <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Score</th>
                    <th>Max Score</th>
                    <th>Regrades</th>
                  </tr>
                  </thead>
                  <tbody>
                  {Object.keys(this.state.gradeData).map((key, index) => {
                    let boundButtonClick = this.openRegradeModal.bind(this, index);
                    return <tr key={key}>
                      <td>{this.state.gradeData[index].name}</td>
                      <td>{this.state.gradeData[index].score}</td>
                      <td>{this.state.gradeData[index].maxscore}</td>
                      <td>
                        <Button onClick={boundButtonClick}
                                style={{backgroundColor: 'white', color: '#21CE99'}}>
                          Request Regrade
                        </Button>
                      </td>
                    </tr>
                  })
                  }
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Row>
              <Col>
                <Modal
                  className={"modalStyle"}
                  onRequestClose={this.closeRegradeModal}
                  isOpen={this.state.regrade_open}
                  ariaHideApp={false}>
                  <h2 className={"homeworkTitle"}>
                    Request Regrade
                  </h2>
                  <h2>Assignment: {this.state.modal_assignment.name}</h2>
                  <h2>Score: {this.state.modal_assignment.score}/{this.state.modal_assignment.maxscore}</h2>

                  <div className={"makeSpace"}/>

                  <h2>Reason for Regrade:</h2>
                  <Input className={"modalInput"} type={"text"}/>

                  <div className={"makeSpace"}/>

                  <Button className="submitButton" size="lg" type="submit" onClick={this.onRegradeSubmit}>Submit Request</Button>
                </Modal>
              </Col>
            </Row>

            <Row>
              <Col className={"moreSpace"}>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Table>
                  <thead>
                  <tr>
                    <th>Total: {this.state.score}/{this.state.max_score}</th>
                  </tr>
                  </thead>
                </Table>
              </Col>
            </Row>


            <Row>
              <Col className={"moreSpace"}>
              </Col>
            </Row>
          </Container>

        </div>
      )
    }
  }
};

export default GradesTable