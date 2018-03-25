import React from 'react';
import { Container } from 'reactstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import ProfilePage from '../Profile';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn'; 
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import CreatePage from '../Create';
import CreateTipPage from '../Create/Tip';
import CreateTripPage from '../Create/Trip';
import CreateResourcePage from '../Create/Resource';
import AccountPage from '../Account';
import SearchPage from '../Search';
import withAuthentication from '../Session/withAuthentication';
import * as routes from '../../constants/routes';

import './index.css';

const App = () =>
  <Router>
    <div className="app">
        <Container style={{ padding: 0 }}>
          <Route exact path={routes.LANDING} component={() => <LandingPage />} />
          <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
          <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
          <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
          <Route exact path={routes.HOME} component={() => <HomePage />} />
          <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
          <Route path={routes.PROFILE} component={() => <ProfilePage />} />
          <Route path={routes.CREATE} component={() => <CreatePage />} />
          <Route path={routes.CREATE_TIP} component={() => <CreateTipPage />} />
          <Route path={routes.CREATE_TRIP} component={() => <CreateTripPage />} />
          <Route path={routes.CREATE_RESOURCE} component={() => <CreateResourcePage />} />
          <Route path={routes.SEARCH} component={() => <SearchPage />} />
          <Navigation />
        </Container>
    </div>
  </Router>

export default withAuthentication(App);