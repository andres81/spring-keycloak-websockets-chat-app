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

import React from 'react'
import {connect} from "react-redux";
import "./style.css";
import {withRouter} from "react-router";
import {doShowProfile} from "../../actions/profileActions";

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.toggleSignIn = this.toggleSignIn.bind(this);
        this.onProfileClick = this.onProfileClick.bind(this);
    }

    toggleSignIn() {
        if (this.props.authenticated) {
            this.props.keycloak.logout();
        } else {
            this.props.keycloak.login();
        }
    }

    onProfileClick(e) {
        e.preventDefault();
        this.props.doShowProfile(true);
    }

    render()  {

        const{authenticated} = this.props;

        let signInIconClasses = 'Sign in';
        let displayNone = 'display-none'
        if (authenticated) {
            signInIconClasses = 'Sign out';
            displayNone = ''
        }

        return (
            <header>
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className={displayNone+" navbar-nav"}>
                                <li className="nav-item">
                                    <span className="nav-link" onClick={this.onProfileClick}>Profile</span>
                                </li>
                            </ul>
                            <ul className="navbar-nav ml-auto">
                                <li onClick={this.toggleSignIn} className="nav-item">
                                    <span style={{cursor:'pointer'}}>{signInIconClasses}</span>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        keycloak: state.keycloak.keycloak,
        authenticated: state.keycloak.authenticated
    };
}

export default withRouter(connect(mapStateToProps, {doShowProfile})(NavigationBar));