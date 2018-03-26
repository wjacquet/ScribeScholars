import React, { Component } from 'react';

import { Nav, NavLink, Container, Row, Col, Button, Card} from 'reactstrap';
import { NavLink as RouterLink } from 'react-router-dom'
import {firestore} from "../../base";
import MCQ from "./MCQ";

import "./GenAssignment.css"


class GenAssignment extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uid: this.props.uid,

      correctAns: null,
      option1: null,
      option2: null,
      option3: null,
      option4: null,
      prompt: null,
      type: null,

      lessonNumber: this.props.lessonNumber,

      name: null,
      class: null,
      questions: null,

      maxscore: null,
      numOfQuestions: null,
      currentScore: null,
      currentQuestion: null,
      answerHistory: null,
      completed: null,
      history: [],
      status: [],

      ans: null,

      finalPage: false,
    }
  }

  componentWillMount() {
    this.getAssignments(this.props.class)
    //this.checkCompletion()
  }

  getAssignments = (classCode) => {

    let self = this;

    let docRef = firestore.collection("classes").doc(classCode).collection("inClass").doc(this.state.lessonNumber);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        self.setState({
          name: doc.data().name,
          class: classCode,
          questions: doc.data().questions,
        }, () => {
          self.getUserAssignment();
        })
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  getUserAssignment = () => {

    let self = this;

    let docRef = firestore.collection("users").doc(this.state.uid).collection("inClass").doc(this.state.lessonNumber)

    docRef.get().then((doc) => {
      if (doc.exists) {
        self.setState({
          maxscore: doc.data().maxscore,
          currentScore: doc.data().currentScore,
          currentQuestion: doc.data().currentQuestion,
          completed: doc.data().completed,
          answerHistory: doc.data().answerHistory,
          numOfQuestions: doc.data().numOfQuestions,
          history: doc.data().history,
          status: doc.data().questions,
        }, () => {
          self.setQuestion();
          self.checkCompletion();
        })
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  /*
   *Decides which question will be picked based on currentQuestion variable
   */
  setQuestion = () => {

    let self = this;

    let quest = this.state.questions[this.state.currentQuestion - 1];

    self.setState({
      correctAns: quest.correctAns,
      option1: quest.option1,
      option2: quest.option2,
      option3: quest.option3,
      option4: quest.option4,
      prompt: quest.prompt,
      type: quest.type,
    });

  };

  /*
 * Increment the page and send the history to fire base
 */
  incPage = () => {
    let self = this;

    let user = firestore.collection("users").doc(this.state.uid).collection("inClass").doc(this.state.lessonNumber)

    user.get().then((doc) => {
      if (doc.exists) {
        if(doc.data().currentQuestion+1 <= self.state.numOfQuestions) {

          user.update({
            history: self.state.history,
            currentQuestion: self.state.currentQuestion + 1,
            questions: self.state.status,
            completed: self.state.completed
          }).then(function() {

            self.getUserAssignment(self.props.class)
          });
        }
        else if(doc.data().currentQuestion+1 == self.state.numOfQuestions+1) {
          user.update({
            history: self.state.history,
            questions: self.state.status,
            completed: self.state.completed
          }).then(function() {
            self.setState({
              finalPage: true,
            });
            self.getUserAssignment(self.props.class)
          });
        }

      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  decPage = () => {
    let self = this;

    if (this.state.finalPage) {
      self.setState({
        finalPage: false,
      })
    }
    else {
      let user = firestore.collection("users").doc(this.state.uid).collection("inClass").doc(this.state.lessonNumber);

      user.get().then((doc) => {
        if (doc.exists) {
          if (doc.data().currentQuestion - 1 > 0) {
            user.update({
              history: self.state.history,
              currentQuestion: self.state.currentQuestion - 1,
              questions: self.state.status,
              completed: self.state.completed
            }).then(function () {
              self.getUserAssignment(self.props.class)
            });
          }
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    }
  };

  /*
   * Sets the answer to current selected answer, updates the history array with the new answer, and checks if the answer given is right
   */
  setAns = (answer) => {

    //let self = this;
    let tmpHis = this.state.history;
    let tmpStat = this.state.status;

    for(let i in tmpHis) {
      if(i == this.state.currentQuestion-1)
      {
        tmpHis[i] = answer
      }
    }

    for(let i in tmpStat) {
      if(i == this.state.currentQuestion-1)
      {
        if(answer === this.state.correctAns){
          tmpStat[i] = "1";
        }
        else{
          tmpStat[i] = "0";
        }
      }
    }

    let check = 0;
    for(let i in this.state.status) {
      if(this.state.status[i] !== "2"){
        check += 1;
      }
    }

    let num = 0;

    if(check === this.state.numOfQuestions) {
      num = 2;
    }
    else if(check === 0) {
      num = 0;
    }
    else {
      num = 1;
    }

    this.setState({
      ans: answer,
      history: tmpHis,
      status: tmpStat,
      completed: num,
    })

    //this.checkCompletion()

  };

  checkCompletion = () => {
    let check = 0;
    for(let i in this.state.status) {
      if(this.state.status[i] !== "2"){
        check += 1;
      }
    }

    let num = 0;

    if(check === this.state.numOfQuestions) {
      num = 2;
    }
    else if(check === 0) {
      num = 0;
    }
    else {
      num = 1;
    }

    this.setState({
      completed: num,
    });
  }

  /*
   * Reset the currentQuestion to 1 when you return to the homepage
   */
  resetQuest = () => {
    let self = this;

    let user = firestore.collection("users").doc(this.state.uid).collection("inClass").doc(this.state.lessonNumber)

    user.get().then((doc) => {
      if (doc.exists) {
        user.update({
          currentQuestion: 1,
        }).then(function () {
          self.setState({
            currentQuestions: self.state.currentQuestions
          });
        });
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }

  render() {
    return (
      <div className={"center"}>
        <Container fluid>
          <Card style={{boxShadow: '8px 8px 3px rgba(0, 0, 0, 0.2)'}}>
            <Row>
              <MCQ currentQuestion={this.state.currentQuestion} name={this.state.name} prompt={this.state.prompt}
                   setAns = {this.setAns} finalPage = {this.state.finalPage} oldAns = {this.state.history[this.state.currentQuestion-1]}
                   option1={this.state.option1} option2={this.state.option2} option3={this.state.option3} option4={this.state.option4}/>
            </Row>

            {this.state.finalPage
              ?
              <Row>
                <Col xs={6}>
                  <div className={"space"}/>
                  <Button onClick={this.decPage}>Last Question</Button>
                  <br/>
                </Col>
                {this.state.completed === 2
                  ?
                  <Col xs={6}>
                    <div className={"space"}/>
                    <Nav pills>
                      <RouterLink className="navLinks" to={`/HomePage/${this.state.class}/announcements`}>
                        <NavLink onClick={this.resetQuest}>Return to the classroom page</NavLink>
                      </RouterLink>
                    </Nav>
                  </Col>
                  :
                   <Col>
                     <h3>Not all questions are completed!</h3>
                     <h3>Please answer all questions before continuing.</h3>
                   </Col>
                }
              </Row>
              :
              <Row>
                <Col xs={{size: 5, offset: 1}}>
                  <Button onClick={this.decPage}>Last Question</Button>
                  <Button onClick={this.incPage}>Next Question</Button>
                </Col>
              </Row>
            }
            <br/>
          </Card>

        </Container>
      </div>
    )
  }
}

export default GenAssignment