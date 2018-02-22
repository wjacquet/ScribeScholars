import React, { Component } from 'react';

import { firestore } from '../base.js';

import { Form, Input, Button, Label } from 'reactstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import './CreateClass.css'
  
class CreateClass extends Component {

  constructor(props){
    super(props);

    this.MIN_NAME_LENGTH = 6;

    this.handleInput = this.handleInput.bind(this);
    this.handleTabBoxInput = this.handleTabBoxInput.bind(this);

    this.state = {
      uid: props.uid,
      className: '',
      tabs: ['annoucements', 'course-content', 'discussion-board', 'my-grades'],
      nameVailid: false,
      formValid: false,
      errorVisible: false,
    };

  }

  onFormSubmit = (ev) => {
    ev.preventDefault();
    if(this.state.formValid){
      //console.log("Success!");

      this.setState({
        className: this.state.className,
      });
      this.generateCode();

    } else {
      //console.log("Error: Form Submit Failure");

      this.setState({
        errorVisible: true
      });
    }
  };

  generateCode = () => {
    let self = this;

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random()*10);
    }

    let docRef = firestore.collection("classes").doc(code);
    docRef.get().then(function(doc) {

      // /If the code already exists, generate a new one
      if (doc.exists) {
        self.generateCode();

      } else {
        docRef.set({
          name: self.className,
          teacher: self.uid,
          classCode: code
        }).then(function() {
          console.log("successfully written!");
        }).catch(function(error) {
          console.log(error);
        });
      }
    }).catch(function(error) {
      console.log("Error getting document: ", error);
    });
  };

  handleTabBoxInput = (e) => {
    this.setState({
      tabs: e
    });
  }

  handleInput = (e) => {
    const className = e.target.name;
    const value = e.target.value;
    this.setState({[className]: value},
      () => {this.validateField(className, value)});
  };

  validateField(fieldName){

    switch(fieldName){

      case 'className':

        if(this.state.className.length >= this.MIN_NAME_LENGTH){
          this.setState({nameValid: true}, function() {
            this.validateForm();
          });
        }
        else {
          this.setState({nameValid: false}, function() {
            this.validateForm();
          });
        }
        return;

      case 'email':
        return;

      default:
        console.log("Error: incorrect fieldName");
        return;
    }
  }

  validateForm = () => {
    this.setState({formValid: this.state.nameValid});
  };

  render() {

    return (
      <div className="quarter">
          <Form onSubmit={this.onFormSubmit}>

            <div className = "form-group">
              <h3 className = "h3 font-weight-bold">Create A New Classroom</h3>
            </div>

            <div className = "titleField" />

            <div className="form-group">
              <Label className="inputLabel">Class Name: </Label>
              <Input name="className" className="inputField" type="text" placeholder="Enter the class name"
                onChange={this.handleInput}
              />
            </div>

            <div className="form-group">
              <Label className="inputLabel">Email: (Students will see this as your public email) </Label>
              <Input name="email" className="inputField" type="text" placeholder="Enter your email"
                     onChange={this.handleInput}/>
            </div>

            <div className="form-group">
              <Label>Choose which tabs you would like included in your classroom:</Label>
              <div/>

              <CheckboxGroup name="tabs"
                             value={this.state.tabs}
                             checkboxDepth={2}
                             onChange={this.handleTabBoxInput}>
                <Label> <Checkbox value="annoucements" name="annoucements" onChange={this.handleTabBoxInput} checked="checked"/> Annoucements </Label>
                <div/>
                <Label> <Checkbox value="course-content" name="course-content" onChange={this.handleTabBoxInput} checked="checked"/> Course Content </Label>
                <div/>
                <Label> <Checkbox value="discussion-board" name="discussion-board" onChange={this.handleTabBoxInput} checked="checked"/> Discussion Board </Label>
                <div/>
                <Label> <Checkbox value="my-grades" name="my-grades" onChange={this.handleTabBoxInput} checked="checked"/> My Grades </Label>
              </CheckboxGroup>
            </div>


            <div className = "titleField" />

            <Button type="submit" className="createClassButton" size ="lg" block>Create Class!</Button>

          </Form>
      </div>
    );
  }
}

export default CreateClass;