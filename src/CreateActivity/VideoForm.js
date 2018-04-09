import React, { Component } from 'react';

import {Form, FormGroup, Col, Input, Label, Button} from 'reactstrap';

class VideoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onFormSubmit = (ev) => {
        ev.preventDefault();
        let quest = {
            type: "VIDEO",
            url: ev.target.promptQ.value,
        };

        this.props.recordQuestion(quest, this.props.index);
    };

    render() {
        return(
            <Form onSubmit={this.onFormSubmit} style={{paddingLeft: '1rem'}}>
                <br/>
                <FormGroup row>
                    <Label size="lg" for="exampleNumber" sm={3}>Video URL:</Label>

                    <Col sm={6}>
                        <Input bsSize="lg" type="username" name="promptQ" id="exampleNumber"/>
                    </Col>
                </FormGroup>
                <br/>
                <FormGroup check style={{paddingLeft: '0'}}>
                    <Col sm={{size: 6, offset: 3}} style={{paddingLeft: '0'}}>
                        <Button color={"secondary"} size={"lg"} block>Save Question</Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

export default VideoForm