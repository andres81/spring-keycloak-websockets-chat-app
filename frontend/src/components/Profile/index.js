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
import {connect} from 'react-redux'

import './style.css'

class Profile extends React.Component {

    render() {
        const {keycloak} = this.props;
        return (
            <div>
                <h3>Profile</h3>
                <div className="profile">
                    <label className="profile-input-label">Email</label>
                    <br/>
                    <input className="profile-input" value={keycloak.tokenParsed['email']} disabled data-field="email"/>

                    <label className="profile-input-label">First name</label>
                    <br/>
                    <input className="profile-input" value={keycloak.tokenParsed['given_name']} disabled data-field="fullName"/>

                    <label className="profile-input-label">Last name</label>
                    <br/>
                    <input className="profile-input" value={keycloak.tokenParsed['family_name']} disabled data-field="fullName"/>

                    <label className="profile-input-label">Username</label>
                    <br/>
                    <input className="profile-input" value={keycloak.tokenParsed['preferred_username']} disabled data-field="fullName"/>

                    <br/><br/>

                    <button href="#" className="account-management-link" onClick={(e) => {e.preventDefault(); this.props.keycloak.accountManagement()}}>Account management</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        keycloak: state.keycloak.keycloak
    };
}

export default connect(mapStateToProps, {})(Profile);