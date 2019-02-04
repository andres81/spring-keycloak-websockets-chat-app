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
import {withRouter} from "react-router";

import webstomp from 'webstomp-client';
import SockJS from 'sockjs-client';

import './style.css'

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stompClient: null
            ,messages:[]
            ,connected : false
            ,reconnecting : false
        }
    }

    componentWillUnmount () {
        clearInterval(this.timer)
    }

    heartBeat () {
        let connected = this.state.stompClient.connected;
        this.setState({connected: connected});
        if (!connected && !this.state.reconnecting) {
            this.setState({reconnecting:true});
            this.createStompConnection();
            setTimeout(()=>{this.setState({reconnecting: false})}, 1000);
        }
    }

    startTimer () {
        clearInterval(this.timer)
        this.timer = setInterval(this.heartBeat.bind(this), 1000)
    }

    componentDidUpdate() {
        if (this.state.stompClient == null) {
            this.createStompConnection();
        }
        if (this.state.stompClient != null &&
                this.state.stompClient.connected &&
                this.state.timer == null) {
            this.startTimer();
        }
    }

    createStompConnection() {
        let socket = new SockJS('http://127.0.0.1:8888/ws');
        let stompClient = webstomp.over(socket, {debug:false, heartbeat: {incoming: 0, outgoing: 1000}, protocols: ['v12.stomp']});
        this.setState({stompClient: stompClient});
        let headers = this.getAuthHeaders();
        if (headers == null) {
            return;
        }
        stompClient.connect(headers, this.onConnected, this.onError);
    }

    onConnected = function() {
        this.state.stompClient.subscribe("/topic/public", (message) => {
            let newMessages = this.state.messages;
            newMessages.push({
                timestamp: new Date()
                ,text: message.body
            })
            this.setState(newMessages);
        });
        this.setState({connected: true});
    }.bind(this);

    onError = function(e) {
        console.error('error: ', e);
    }

    messagesToString = function() {
        let messages = this.state.messages;
        let messagesString = "";
        messages.forEach(message =>  {
            messagesString += "\n\nTime received: " + message.timestamp + "\n" + message.text;
        });
        return messagesString;
    }.bind(this);

    sendMessage = function() {
        this.state.stompClient.send("/app/chat.sendMessage", this.state.sendmessage, this.getAuthHeaders());
    }.bind(this);

    getAuthHeaders = function() {
        return this.props.keycloak.token ? {"Authorization": "Bearer " + this.props.keycloak.token} : null;
    }.bind(this)

    render() {
        return (
            <div>
                <div className="loggedin">
                    <h2>Home</h2>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <input onChange={(e) => this.setState({sendmessage: e.target.value})} className="message-input" style={{width:"400px"}}/>
                            <button disabled={!this.state.connected} onClick={this.sendMessage} className="classic">Send message</button>
                            <span>
                                Connection:
                                <div className={"connection-radio-button " + (this.state.connected ? "connection-radio-button-on" : "connection-radio-button-inactive")}></div>
                                <div className={"connection-radio-button " + (!this.state.connected ? "connection-radio-button-off" : "connection-radio-button-inactive")}></div>
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <textarea readOnly value={this.messagesToString(this.state.messages)} style={{"height":"557px", "width": "100%"}}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        keycloak: state.keycloak.keycloak,
        authenticated: state.keycloak.authenticated
    };
}

export default withRouter(connect(mapStateToProps, {})(Home));
