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

export function deleteAction(dispatch, path, bearerToken) {
    return doServerRequest("DELETE", path, null, bearerToken);
};

export function getAction(path, bearerToken) {
    return doServerRequest("GET", path, null, bearerToken);
}

export function putAction(path, body, bearerToken) {
    return doServerRequest("PUT", path, JSON.stringify(body), bearerToken);
}

export function postAction(dispatch, path, body, bearerToken) {
    return doServerRequest("POST", path, JSON.stringify(body), bearerToken);
}

export function doServerRequest(method, path, body, bearerToken) {
    var headers = new Headers();
    headers.set('Authorization', 'Bearer ' + bearerToken)
    headers.set("Content-Type", "application/json");
    return fetch(backendUrl+path, {
        method: method,
        mode: 'cors',
        headers: headers,
        credentials: 'include',
        body: body
    }).then(response =>
        new Promise(function (resolve) {
            resolve(response);
        })
    );
}
