import React, {Component} from 'react';
import {Container, Row, Col, Table, Button} from 'reactstrap';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, ReferenceLine, ResponsiveContainer } from 'recharts';

import './MyStudents.css';
import Graphs from '../Dashboard/Dashboard';
import StudList from '../Dashboard/StudList'
import HomeCards from '../Dashboard/HomeCards'
import InClassCards from '../Dashboard/InClassCards'
import QuizCards from '../Dashboard/QuizCards'
import {firestore} from "../base";


class MyStudents extends Component {

    constructor (props) {
        super(props);

        this.state = {


            students : [{
                name: null,
                email: null
            }],

            homeworks : [{
               name: null,
               max: null
            }],

            inclass : [{
                name: null,
                max: null
            }],

            quizzes : [{
                name: null,
                max: null
            }],

          uid: this.props.uid,
          code: this.props.code,

          doneLoading: false,

          myAssignments: [],  // all the user's assignments from this class
          myScore: null,  // user's score on current assignment

          classAssignments: [],   // assignments in the class
          studentsList: [],   // all students in the class
          allAssignments: [],   // all assignments from every student

          classScores: [],  // class scores for an individual assignment
          assignmentComp: [],   // user's score, average, and median
          classOverallGrades: [],   // class overall grades
          assignmentScores: [],   // individual scores for each assignment
          assignmentGrades: [],   // individual grades for each assignment


          classAverage: null,

          graphVisible: false,
        }

    }

  // get assignments and students for a particular class
  getClassInfo = () => {
    let self = this;
    let classRef = firestore.collection("classes").doc(this.state.code);

    classRef.get().then((doc) => {
      if (doc.exists) {
        if (doc.data().students != null) {
          self.setState({
            studentsList: doc.data().students,
          });
        }

        self.getClassAssignmentsOfType("homework");
        self.getClassAssignmentsOfType("quizzes");
        self.getClassAssignmentsOfType("tests");
        self.getClassAssignmentsOfType("inClass");

        self.getAllAssignments();
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  getClassAssignmentsOfType = (type) => {
    let self = this;

    firestore.collection("classes").doc(this.state.code).collection(type).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        self.setState({
          classAssignments: self.state.classAssignments.concat({data: doc.data()}),
        });
      });
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  getAssignmentsOfType = (uid, type, all) => {
    let self = this;

    firestore.collection("users").doc(uid).collection(type).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (!all) {
          if (doc.data().code === self.state.code) {
            self.setState({
              myAssignments: self.state.myAssignments.concat({data: doc.data(), uid: uid}),
            });
          }
        } else {
          if (doc.data().code === self.state.code && doc.data().score != null) {
            self.setState({
              allAssignments: self.state.allAssignments.concat({data: doc.data(), uid: uid}),
            });
          }
        }
      });
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  getAllAssignments = () => {
    let self = this;

    for (let i in this.state.studentsList) {
      if (this.state.studentsList.hasOwnProperty(i)) {
        self.getAssignmentsOfType(self.state.studentsList[i], "homework", true);
        self.getAssignmentsOfType(self.state.studentsList[i], "quizzes", true);
        self.getAssignmentsOfType(self.state.studentsList[i], "tests", true);
        self.getAssignmentsOfType(self.state.studentsList[i], "inClass", true);

        let studentRef = firestore.collection("users").doc(this.state.studentsList[i]);
        studentRef.get().then(() => {
          if (parseInt(i, 10) === self.state.studentsList.length - 1) {
            self.getClassAverage();
            //self.buildAssignmentScoresGraph();
            //self.buildAssignmentGradesGraph();
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      }
    }
  };

  // get overall grade in class
  getGrade = (uid) => {
    let total = 0;
    let max = 0;

    for (let i in this.state.allAssignments) {
      if (this.state.allAssignments.hasOwnProperty(i)) {
        if (this.state.allAssignments[i].uid === uid && this.state.allAssignments[i].data.score != null) {
          total += this.state.allAssignments[i].data.score;
          max += this.state.allAssignments[i].data.maxscore;
        }
      }
    }

    let grade = (total / max) * 100;

    if (grade % 1 !== 0)
      grade = Math.round(grade * 100) / 100;

    return grade;
  };

  // get average overall grade in a class
  getClassAverage = () => {
    let tmpClassOverallGrades = [];
    let totalGrade = 0;
    let numStudents = 0;

    for (let i in this.state.studentsList) {
      if (this.state.studentsList.hasOwnProperty(i)) {
        let grade = this.getGrade(this.state.studentsList[i]);
        tmpClassOverallGrades.push(grade);

        totalGrade += grade;
        numStudents++;
      }
    }

    let classAverage = totalGrade / numStudents;

    if (classAverage % 1 !== 0)
      classAverage = Math.round(classAverage * 100) / 100;

    this.setState({
      classOverallGrades: tmpClassOverallGrades,
      classAverage: classAverage,
    });

    return classAverage;
  };

  getRank = (uid) => {
    let classGrades = this.state.classOverallGrades;

    if (classGrades === undefined || classGrades.length === 0)
      return "--";

    classGrades.sort().reverse();

    let studentGrade = this.getGrade(uid);
    return classGrades.indexOf(studentGrade) + 1;
  };

  getPercentage = (score, max) => {
    let grade = (score / max) * 100;

    if (grade % 1 !== 0)
      grade = Math.round(grade * 100) / 100;

    if (!isNaN(grade))
      return grade;
    else
      return "--";
  };

  // build data for graph of classroom scores on a particular assignment
  buildClassScoresGraph = (assignment) => {
    let tmpClassScores = [];

    for (let i in this.state.allAssignments) {
      if (this.state.allAssignments.hasOwnProperty(i)) {
        if (this.state.allAssignments[i].data.name === assignment.data.name)
          tmpClassScores = tmpClassScores.concat({score: this.state.allAssignments[i].data.score});
      }
    }

    this.setState({
      classScores: tmpClassScores,
    });
  };

  // build data for assignmentComp
  buildBenchmarkGraph = (classAssignment) => {
    let assignment = this.getMyAssignment(classAssignment);

    let name = assignment.data.name;
    let score = assignment.data.score;
    let avg = this.getAverageScore(classAssignment, false);
    let med = this.getMedianScore(classAssignment, false);
    let max = assignment.data.maxscore;

    this.setState({
      assignmentComp: [].concat({name: name, score: score, average: avg, median: med, max: max}),
    });
  };

  // build data for assignmentScores
  buildAssignmentScoresGraph = () => {
    let tmpAssignmentScores = [];

    for (let i in this.state.classAssignments) {
      if (this.state.classAssignments.hasOwnProperty(i)) {
        let assignment = this.getMyAssignment(this.state.classAssignments[i]);

        if (assignment.data.score != null) {
          let name = assignment.data.name;
          let score = assignment.data.score;
          let avg = this.getAverageScore(this.state.classAssignments[i], false);
          let med = this.getMedianScore(this.state.classAssignments[i], false);

          tmpAssignmentScores = tmpAssignmentScores.concat({name: name, score: score, average: avg, median: med});
        }
      }
    }

    this.setState({
      assignmentScores: tmpAssignmentScores,
    });
  };

  // build data for assignmentGrades
  buildAssignmentGradesGraph = () => {
    let tmpAssignmentGrades = [];

    for (let i in this.state.classAssignments) {
      if (this.state.classAssignments.hasOwnProperty(i)) {
        let assignment = this.getMyAssignment(this.state.classAssignments[i]);

        if (assignment.data.score != null) {
          let name = assignment.data.name;
          let grade = (assignment.data.score / assignment.data.maxscore) * 100;
          let avg = this.getAverageScore(this.state.classAssignments[i], true);
          let med = this.getMedianScore(this.state.classAssignments[i], true);

          if (grade % 1 !== 0)
            grade = Math.round(grade * 100) / 100;

          tmpAssignmentGrades = tmpAssignmentGrades.concat({name: name, grade: grade, average: avg, median: med});
        }
      }
    }

    this.setState({
      assignmentGrades: tmpAssignmentGrades,
    });
  };

    componentWillMount() {
      this.getClassInfo();
        this.getHomeworks();
        this.getStudents();
        this.getInClass();
        this.getQuizzes();
    };

    getHomeworks = () => {

        let object = [{}];

        let self = this;


        let colRef = firestore.collection("classes").doc(this.props.code)
            .collection("Homework");

        colRef.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots

                object.unshift({
                    name: doc.data().name,
                    max: doc.data().questions.length
                });
                self.setState({
                    homeworks: object,
                });
            });

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

        object.pop();

        self.setState({
            homeworks: object
        });

    };

    getInClass = () => {

        let object = [{}];

        let self = this;


        let colRef = firestore.collection("classes").doc(this.props.code)
            .collection("InClass");

        colRef.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots

                object.unshift({
                    name: doc.data().name,
                    max: doc.data().questions.length
                });
                self.setState({
                    inclass: object,
                });
            });

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

        object.pop();

        self.setState({
            inclass: object
        });

    };

    getQuizzes = () => {

        let object = [{}];

        let self = this;


        let colRef = firestore.collection("classes").doc(this.props.code)
            .collection("Quizzes");

        colRef.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots

                object.unshift({
                    name: doc.data().name,
                    max: doc.data().questions.length
                });
                self.setState({
                    quizzes: object,
                });
            });

        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

        object.pop();

        self.setState({
            quizzes: object
        });

    };

    getStudents = () => {

        let object = [{}];

        let self = this;


        let docRef = firestore.collection("classes").doc(this.props.code);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                let data = doc.data();
                for (let i in data.students) {

                    if (data.students.hasOwnProperty(i)) {
                        let id = data.students[i];
                        let studRef = firestore.collection("users").doc(id);

                        studRef.get().then(function (doc) {
                            let data = doc.data();
                            object.unshift({
                                name: data.firstName + " " + data.lastName,
                                email: data.email,
                                grade: self.getGrade(id),
                            });
                            self.setState({
                                students: object,
                            }, () => {
                                self.state.students.sort(self.compareValues("grade")).reverse();
                            });

                        });
                    }
                }
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

        object.pop();

        self.setState({
            students: object
        });
    };

  // custom sorting function for the graphs
  compareValues(key) {
    return function(a, b) {
      // check that input is valid
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key))
        return 0;

      let val1 = a[key];
      let val2 = b[key];

      let comparison = 0;

      if (val1 > val2)
        comparison = 1;
      else if (val1 < val2)
        comparison = -1;

      return comparison;
    };
  }

  showGraph = () => {
    this.setState({
      graphVisible: true,
    });

    this.buildClassScoresGraph(this.state.classAssignments[0]);
    //this.buildBenchmarkGraph(this.state.classAssignments[0]);
  };

  hideGraph = () => {
    this.setState({
      graphVisible: false,
    });
  };



    render() {
        return (
            <div>
                <Container fluid>

                </Container>
                <Container fluid className={"mainPage"}>
                    <Row>
                        <Col className={"mainPage"}>
                            <p>My Students</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={"mainPage"}>
                            <Row>
                                <Col className={"mainPage"}>
                                    <h1>Dashboard</h1>
                                </Col>
                            </Row>
                            <Row className="chartAlign">
                                <Graphs code={this.props.code}/>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <Col>
                            <h1>Students</h1>
                            <Row>
                              <Col>
                                {this.state.graphVisible
                                  ?
                                  <Row>
                                    <Col xs={{size: 1, offset: 0}}>
                                      <Button onClick={this.hideGraph}>
                                        <i className="fas fa-arrow-left graphIcon"/>
                                      </Button>
                                    </Col>
                                    <Col>
                                      <ResponsiveContainer width="100%" height={150}>
                                        <AreaChart data={this.state.classScores}
                                                   margin={{top: 30, right: 30, left: 30, bottom: 30}}>
                                          <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                            </linearGradient>
                                          </defs>
                                          <XAxis/>
                                          <YAxis/>
                                          <CartesianGrid strokeDasharray="3 3"/>
                                          <Tooltip/>
                                          <ReferenceLine stroke="green" label={{value: "You", position: "top"}}/>
                                          <Area type="monotone" dataKey="score" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"/>
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    </Col>
                                    <Col>
                                    </Col>
                                  </Row>
                                  :
                                  <Table striped>
                                    <thead>
                                    <tr>
                                      <th>Rank</th>
                                      <th>Grade</th>
                                      <th>Name</th>
                                      <th>Email</th>
                                      <th/>
                                    </tr>
                                    </thead>

                                    <StudList students={this.state.students} showGraph={this.showGraph}/>

                                  </Table>
                                }
                              </Col>
                            </Row>
                        </Col>
                        </Col>
                        <Col>
                        <Col>
                            <h1>Homework</h1>
                            <HomeCards homeworks={this.state.homeworks}/>
                        </Col>
                        <Col>
                            <h1>In-Class Lessons</h1>
                            <InClassCards inclass={this.state.inclass}/>
                        </Col>
                        <Col>
                            <h1>Quizzes</h1>
                            <QuizCards quizzes={this.state.quizzes}/>
                        </Col>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default MyStudents