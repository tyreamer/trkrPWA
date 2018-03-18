import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import logo from '../../images/logo.png';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { auth } from '../../firebase';
import * as routes from '../../constants/routes';
import { Button, Form, FormGroup, Input } from 'reactstrap';

const SignInPage = ({ history }) =>
  <div>
    <SignInForm history={history} />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
        <div className="row" style={{ marginTop: 100 }}>
            <div className="center-block">
                <div className="row">
                    <div className="col-xs-6">
                        <Link to={routes.LANDING}>
                            <img id="login-img" src={logo} alt="" />
                        </Link>
                    </div>
                    <div className="col-xs-6" id="login-right-panel">
                        <h2>Sign In</h2>
                        <Form onSubmit={this.onSubmit}>
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
                                value={password}
                                onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
                                type="password"
                                placeholder="Password"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" disabled={isInvalid} type="submit" style={{ width: '100%' }}>
                                    Sign In
                                </Button>
                            </FormGroup>
                            <FormGroup>                               
                               {error && <p style={{ color: 'red' }}> <small>{error.message}</small> </p>}                               
                            </FormGroup>
                        </Form>
                        <PasswordForgetLink />
                        <SignUpLink />
                    </div>
                </div>
            </div>
        </div>      
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};
