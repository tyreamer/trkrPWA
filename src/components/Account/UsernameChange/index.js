import React, { Component } from 'react';
import { Button, Form, InputGroup, InputGroupAddon, Input, Col } from 'reactstrap';
import { auth, db } from '../../../firebase';
import { ToastContainer, toast } from 'react-toastify';

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
    username: '',
    currentUsername: '',
    error: null,
};

class UsernameChangeForm extends Component {
    
  constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this)
        this.state = { ...INITIAL_STATE };
  }

  componentWillMount() {
      this.setState({ currentUsername: auth.currentUser() })
  }

  onSubmit = (event) => {
    const { currentUsername, username } = this.state;
    var self = this;
      
    if (currentUsername === username) return

    db.isUsernameAvailable(username)
        .then(function (res) {
            auth.doUsernameUpdate(username)
                .then(() => {
                    db.updateUsername(currentUsername, username).then(() => {
                        self.setState({ currentUsername: username });
                        self.showToast()
                    }).catch(error => {
                        this.setState(updateByPropertyName('error', error));
                    });
                })
                .catch(error => {
                    this.setState(updateByPropertyName('error', error));
                });
        })
        .catch(e => {
            alert('This username is already taken')
            self.setState(updateByPropertyName('error', 'this username is already taken.'));
        })   

    event.preventDefault();
  }

  showToast() {
      toast.success('Successfully updated', { position: toast.POSITION.BOTTOM_CENTER });
  }
    
  render() {
      const {
          currentUsername,
          username,
          error,
    } = this.state;
   
      const isInvalid = (username === '');
      
      return (
          <Col xs="12" md={{size: 4, offset: 4}}>
            <Form onSubmit={this.onSubmit}>
                <h4>Update Username</h4>
                <InputGroup>
                      <Input
                        value={this.state.username}
                        onChange={event => this.setState(updateByPropertyName('username', event.target.value))}
                        type="text"
                        placeholder={currentUsername}
                    />
                    <InputGroupAddon addonType="append">                          
                        <Button color="primary" style={{ width: '100%' }} disabled={isInvalid} type="submit">
                             >
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
                <InputGroup>
                    {error && <p>{error.message}</p>}
                  </InputGroup>
              </Form>              
            <ToastContainer autoClose={2000}/>
        </Col>
    );
  }
}

export default UsernameChangeForm;