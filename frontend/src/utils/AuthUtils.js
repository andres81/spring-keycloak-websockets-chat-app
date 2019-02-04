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

import {backendUrl} from '../conf/application.properties'

export function requestPasswordReset(data) {
    return fetch(backendUrl+'/auth/resetpassword?email='+data.email,
        {
            method: "PUT"
        })
        .then(function(response) {
            return new Promise(function(resolve, reject) {
                switch (response.status) {
                    case 204:
                        resolve();
                        break;
                    default:
                        reject(response);
                }
            })
        });
}

export function signup(data) {

    var myHeaders = new Headers();
    myHeaders.set("Content-Type", "application/json")
    return fetch(backendUrl+'/auth/signup', {
        method: "POST",
        mode: 'cors',
        headers: myHeaders,
        body: JSON.stringify(data)
    }).then(function(response) {
        return new Promise(function(resolve, reject) {
            if (response.status === 204) resolve();
            else if (response.status === 200) {
                response.json().then(function(json) {
                    reject(json);
                });
            }
            else reject();
        })
    });
}

export function resetPassword(data) {

    let requestBody = {
        newPassword : data.newPassword,
        resetToken : data.token
    };

    var myHeaders = new Headers();
    myHeaders.set("Content-Type", "application/json")
    return fetch(backendUrl+'/auth/resetpassword', {
        method: "POST",
        mode: 'cors',
        headers: myHeaders,
        body: JSON.stringify(requestBody)
    }).then(function(response) {
        return new Promise(function(resolve, reject) {
            switch (response.status) {
                case 204:
                    resolve();
                    break;
                default:
                    reject(response);
            }
        })
    });
}
