/*
 * Copyright 2019 André Schepers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import NavigationBar from './components/NavigationBar'
import Home from "./components/Home";
import './css/App.css';
import {Route, Switch, withRouter} from "react-router";
import {connect} from "react-redux";
import {setAuthenticated} from "./actions/keycloakActions";
import Profile from './components/Profile'
import modal from "./utils/modal";
import {doShowProfile} from "./actions/profileActions";

class App extends React.Component {

    componentDidMount() {
        this.props.keycloak.init(
            {
                onLoad: 'check-sso',
                checkLoginIframeInterval: 1
            }
        ).success(()=>this.props.setAuthenticated(this.props.keycloak.authenticated));
    }

    render() {
        const {showProfile} = this.props;
        return (
            <div className="App">
            <NavigationBar />
            <Switch>
            <Route exact path='/' component={Home}/>
        </Switch>
        {showProfile && modal(Profile, () => this.props.doShowProfile(false))}
    </div>
    );
    }
};

const mapStateToProps = (state) => {
    return {
        keycloak: state.keycloak.keycloak
        ,showProfile: state.profile.showProfile
    };
}

export default withRouter(connect(mapStateToProps, {setAuthenticated, doShowProfile})(App));