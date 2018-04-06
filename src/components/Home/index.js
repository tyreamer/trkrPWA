import React, { Component } from 'react';
import MainFeed from '../MainFeed'
import withAuthorization from '../Session/withAuthorization';
import { Form, FormGroup, Input, InputGroup,Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom';
import * as constants from '../../constants';

class HomePage extends Component {

  constructor(props) {
      super(props);

    this.state = {
        searchText: ''
    };
  }

  render() {
        return (       
            <Container>
                <Row>
                    <Col xs="12">
                        <Link to={constants.routes.SEARCH} style={{ color: '#fff', width: '100%' }}>
                            <Form>
                                <FormGroup>
                                    <InputGroup style={{color: '#fff'}}>
                                        <Input
                                            onChange={event => this.setState(updateByPropertyName('searchText', event.target.value))}
                                            value={this.state.searchText}
                                            type="text"
                                            placeholder="search"/>
                                    </InputGroup>                                
                                </FormGroup>
                            </Form>
                        </Link>
                    </Col>
                </Row>
                <MainFeed />
            </Container>
        );
  }
}

const updateByPropertyName = (propertyName, value) => () => ({
    [propertyName]: value,
});

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);