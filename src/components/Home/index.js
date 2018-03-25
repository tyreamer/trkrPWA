import React, { Component } from 'react';
import MainFeed from '../MainFeed'
import withAuthorization from '../Session/withAuthorization';
import { Form, FormGroup, Input, InputGroup, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes';

class HomePage extends Component {

  constructor(props) {
      super(props);

    this.state = {
        searchText: ''
    };
  }

  render() {
        return (       
            <div style={{ paddingTop: 10 }}>
                <Row>
                    <Col xs={{ size: 10, offset: 1 }}>
                        <Link to={routes.SEARCH} style={{ color: '#fff', width: '100%' }}>
                            <Form>
                                <FormGroup>
                                    <InputGroup>
                                        <Input
                                            onChange={event => this.setState(updateByPropertyName('searchText', event.target.value))}
                                            value={this.state.searchText}
                                            type="text"
                                            placeholder="search" />
                                    </InputGroup>                                
                                </FormGroup>
                            </Form>
                        </Link>
                    </Col>
                </Row>
                <MainFeed />
            </div>
        );
  }
}

const updateByPropertyName = (propertyName, value) => () => ({
    [propertyName]: value,
});

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);