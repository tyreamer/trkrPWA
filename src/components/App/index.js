import React from 'react';
import { Container, Row, NavbarBrand } from 'reactstrap';
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
import * as constants from '../../constants';
import logo from '../../images/logo.png';

import './index.css';

const App = () =>
  <Router>
        <div className="app">            
            <Container style={{ padding: 0, backgroundColor: '#fff', width: '100%' }}>
                <Row>
                    <NavbarBrand href="/" id="navbar-brand" style={{margin: '0 auto'}}><img id="navbar-logo" style={{ height: 100, width: 'auto', padding: 15 }} src={logo} alt="" /></NavbarBrand>
                </Row>
                <Route exact path={constants.routes.LANDING} component={() => <LandingPage />} />
                <Route exact path={constants.routes.SIGN_UP} component={() => <SignUpPage />} />
                <Route exact path={constants.routes.SIGN_IN} component={() => <SignInPage />} />
                <Route exact path={constants.routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
                <Route exact path={constants.routes.HOME} component={() => <HomePage />} />
                <Route exact path={constants.routes.ACCOUNT} component={() => <AccountPage />} />
                <Route path={constants.routes.PROFILE} component={() => <ProfilePage />} />
                <Route path={constants.routes.CREATE} component={() => <CreatePage />} />
                <Route path={constants.routes.CREATE_TIP} component={() => <CreateTipPage />} />
                <Route path={constants.routes.CREATE_TRIP} component={() => <CreateTripPage />} />
                <Route path={constants.routes.CREATE_RESOURCE} component={() => <CreateResourcePage />} />
                <Route path={constants.routes.SEARCH} component={() => <SearchPage />} />
                <Navigation />
            </Container>
        </div>
  </Router>

export default withAuthentication(App);