import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import { auth, db } from '../../firebase';
import * as constants from '../../constants';
import logo from '../../images/logo.png';
import { Button, Form, FormGroup, Input, Row, Col, Container } from 'reactstrap';

const SignUpPage = ({ history }) =>
  <div>
    <SignUpForm history={history} />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;
      
    event.preventDefault();
    var self = this;
    //check if username is taken
    db.isUsernameAvailable(username)
        .then(function (res) {
            auth.doCreateUserWithEmailAndPassword(email, passwordOne)
                .then(authUser => {
                    authUser.updateProfile({ displayName: username })                        
                    db.doCreateUser(username, email)
                        .then(() => {
                            self.setState(() => ({ ...INITIAL_STATE }));
                            this.props.history.push(constants.routes.HOME);
                            window.location.reload()
                        })
                        .catch(error => {
                            console.log(error)
                            self.setState(updateByPropertyName('error', error));
                        });
                })
                .catch(error => {
                    //TODO figure out why this is hit everytime
                    self.setState(updateByPropertyName('error', error));                   
                });
        })
        .catch(e => {
            alert('This username is already taken')
            self.setState(updateByPropertyName('error', 'this username is already taken.'));
        })
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      username === '' ||
      email === '';

    return (

        <Container style={{ marginTop: 100 }}>
            <div className="center-block">
                <Row>
                    <Col xs="auto">
                        <img id="login-img" src={logo} alt="" />
                    </Col>
                    <Col xs="6" id="login-right-panel">
                        <Row>
                            <h2>Sign Up</h2>
                        </Row>
                        <Row>
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <Input
                                        value={username}
                                        onChange={event => this.setState(updateByPropertyName('username', event.target.value))}
                                        type="text"
                                        placeholder="Username"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        value={email}
                                        onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                                        type="email"
                                        placeholder="Email Address"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        value={passwordOne}
                                        onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        value={passwordTwo}
                                        onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
                                        type="password"
                                        placeholder="Confirm Password"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button disabled={isInvalid} type="submit" style={{ width: '100%' }}>Sign Up</Button>
                                </FormGroup>
                                <FormGroup>
                                    {error && <p style={{ color: 'red' }}> <small>{error.message}</small> </p>}
                                </FormGroup>
                            </Form>
                        </Row>
                        <hr />
                        <Row>
                            <Button color="link" onClick={() => { window.history.go(-1) }}>Go Back</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Container>                                
    );
  }
}

const SignUpLink = () =>
    <p>Don't have an account? <Link to={constants.routes.SIGN_UP}>Sign up</Link></p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};