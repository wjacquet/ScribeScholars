import React from 'react'
import {FormGroup, Input, Row, Col, Button, Table} from 'reactstrap';
import { NavLink as RouterLink } from 'react-router-dom';

const StudListGrade = (props) => {


    return (

        <Col>
            <h1>Students</h1>
            <Row>
                <Col>
                    <Table striped>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Current Score</th>
                            <th>Multi-Choice Score</th>
                            <th>Grade ( out of {props.maxScore} )</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.keys(props.students).map((key, index) => {
                            return (
                                <tr key={key}>
                                    <td>{props.students[index].name}</td>
                                    <td>{props.students[index].currentScore}</td>
                                    <td>{props.students[index].mcq}</td>
                                    <td>
                                        <FormGroup>
                                            <Row>
                                                <Col xs={4}/>
                                                <Col xs={4}>
                                                    <Input onChange={(score) => props.updateGrades(props.students[index].key,props.assCol, props.assKey, score.target.value)} name="text" id="exampleText"/>

                                                </Col>
                                                <Col xs={4}>
                                                    <p className={"assTitle"}>/{props.maxScore}</p>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    </td>
                                </tr>
                            )
                        })
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col xs={0} md={8}/>
                <Col xs={12} md={2}>
                    <RouterLink
                        to={"/ScribeScholars/HomePage/" + props.code + "/myStudents"}>
                        <Button>
                            Commit
                        </Button>
                    </RouterLink>
                </Col>
                <Col xs={0} md={2}/>
            </Row>
        </Col>



    )
};

export default StudListGrade