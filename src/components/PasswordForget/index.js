import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import * as constants from '../../constants';
import { Button, Form, FormGroup, Input, Container, Row } from 'reactstrap';

const PasswordForgetPage = () =>
  <div>
    <PasswordForgetForm />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
        <Container style={{marginTop: 100}}>
            <Row>
                <div style={{padding: 40, margin: '0 auto'}}>
                    <h2>Reset Password</h2>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Input
                            value={this.state.email}
                            onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                            type="email"
                            placeholder="Email Address"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Button disabled={isInvalid} type="submit" style={{ width: '100%' }}>
                                Reset My Password
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            {   error && <p> {error.message} </p>   }
                        </FormGroup> 
                    </Form>
                    <Button color="link" onClick={() => { window.history.go(-1) }}>Go Back</Button>
                </div>
            </Row>
        </Container>      
    );
  }
}

const PasswordForgetLink = () =>
  <p>
        <Link to={constants.routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};
