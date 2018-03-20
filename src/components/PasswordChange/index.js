import React, { Component } from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';

import { auth } from '../../firebase';

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
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
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
        <Form onSubmit={this.onSubmit} style={{ marginTop: 100 }}>
            <FormGroup>
                <Input
                    value={passwordOne}
                    onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
                    type="password"
                    placeholder="New Password"
                />
            </FormGroup>
            <FormGroup>
                <Input
                  value={passwordTwo}
                  onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
                  type="password"
                  placeholder="Confirm New Password"
                />
            </FormGroup>
            <FormGroup>
                <Button disabled={isInvalid} type="submit">
                  Reset My Password
                </Button>
            </FormGroup>
            <FormGroup>
                {error && <p>{error.message}</p>}
            </FormGroup>
        </Form>
    );
  }
}

export default PasswordChangeForm;