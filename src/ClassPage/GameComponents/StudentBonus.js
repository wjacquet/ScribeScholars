import React, { Component } from 'react';

import {Container, Row, Col, Input, Label, Form, FormGroup, Button, InputGroupAddon, InputGroup} from 'reactstrap';

import ReactLoading from 'react-loading';

class StudentBonus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: this.props.game,
      inputValue: "",
    }
  };

  recordResponse = () => {
    this.props.submit(this.state.inputValue);
    //console.log(this.state.inputValue); // Riley stuff
    //this.props.theClick();  // Riley stuff
  };

  updateInputValue = (ev) => {
    this.setState({
      inputValue: ev.target.value,
    })
  };

  render() {
    if (!this.props.bonus) {
    return (
      <div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <Row>
          <Col xs={12}>
            <h1 style={{
              textAlign: 'center',
              fontSize: '5rem'
            }}> {this.state.game.questions[this.state.game.questIndex].prompt}</h1>
            <p style={{textAlign: 'center', fontSize: '2rem'}}>This is your chance for bonus points!</p>
          </Col>
        </Row>
        <br/>
        <br/>
        <hr/>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
          <Row>
            <Col xs={{size: '8', offset: '2'}}>
              <InputGroup>
                <Input style={{height: '5rem', fontSize: '1.75rem'}} value={this.state.inputValue}
                       onChange={this.updateInputValue}/>
                <InputGroupAddon addonType="append">
                  <Button onClick={this.recordResponse} style={{fontSize: '1.25rem'}} color="info">Submit Your
                    Answer!</Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
      </div>
    );
    }
    else {
      return (
        <div>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <Row>
            <Col xs={12}>
              <h1 style={{
                textAlign: 'center',
                fontSize: '5rem'
              }}> Your Answer Was Recorded</h1>
              <p style={{textAlign: 'center', fontSize: '2rem'}}>The Teacher will progress the game!</p>
            </Col>
          </Row>
          <br/>
          <br/>
          <hr/>

          <br/>
          <br/>
          <br/>
          <br/>
          <br/>

          <Row>
            <Col xs={{size: 4, offset: 1}} sm={{size: 4, offset: 3}} lg={{size: 4, offset: 4}}>
              <br/>
              <br/>
              <div style={{margin: 'auto', width: '50%'}}>
                <ReactLoading type={'bars'} width={250} height={100} color={'#21CE99'}/>
              </div>
            </Col>
          </Row>

      </div>
    );
}

  }
}
export default StudentBonus