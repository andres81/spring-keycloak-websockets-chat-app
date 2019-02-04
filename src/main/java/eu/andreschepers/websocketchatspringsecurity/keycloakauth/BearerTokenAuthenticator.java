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

package eu.andreschepers.websocketchatspringsecurity.keycloakauth;

import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.AdapterUtils;
import org.keycloak.adapters.KeycloakDeployment;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.keycloak.adapters.rotation.AdapterTokenVerifier;
import org.keycloak.adapters.springsecurity.account.SimpleKeycloakAccount;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.common.VerificationException;
import org.keycloak.representations.AccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.stereotype.Component;

@Component
public class BearerTokenAuthenticator {

    private KeycloakDeployment deployment;
    private KeycloakAuthenticationProvider keycloakAuthenticationProvider;

    @Autowired
    public BearerTokenAuthenticator(KeycloakDeployment deployment) {
        this.deployment = deployment;
        keycloakAuthenticationProvider = createKeycloakAuthenticationProvider();
    }

    private KeycloakAuthenticationProvider createKeycloakAuthenticationProvider() {
        KeycloakAuthenticationProvider keycloakAuthenticationProvider = new KeycloakAuthenticationProvider();
        keycloakAuthenticationProvider.setGrantedAuthoritiesMapper(getSimpleAuthorityMapper());
        return keycloakAuthenticationProvider;
    }

    private SimpleAuthorityMapper getSimpleAuthorityMapper() {
        SimpleAuthorityMapper mapper = new SimpleAuthorityMapper();
        mapper.setPrefix("ROLE_");
        return mapper;
    }

    public Authentication authenticate(String authHeaderValue)  {
        return authenticateBearerToken(getBearerTokenFromHeader(authHeaderValue));
    }

    private String getBearerTokenFromHeader(String header) {
        String[] split = header.trim().split("\\s+");
        if (split != null && split.length == 2) {
            if (split[0].equalsIgnoreCase("Bearer")) {
                return split[1];
            }
        }
        return null;
    }

    private Authentication authenticateBearerToken(String tokenString) {
        AccessToken token = authenticateToken(tokenString);
        if (token == null) {
            return null;
        }
        RefreshableKeycloakSecurityContext context = getContext(tokenString, token);
        KeycloakPrincipal<RefreshableKeycloakSecurityContext> keycloakPrincipal =
            new KeycloakPrincipal<>(
                AdapterUtils.getPrincipalName(deployment, token)
                ,context);

        KeycloakAuthenticationToken keycloakAuthenticationToken = new KeycloakAuthenticationToken(
            new SimpleKeycloakAccount(keycloakPrincipal, AdapterUtils.getRolesFromSecurityContext(context), context)
            ,false);
        return keycloakAuthenticationProvider.authenticate(keycloakAuthenticationToken);
    }

    private RefreshableKeycloakSecurityContext getContext(String tokenString, AccessToken token) {
        return new RefreshableKeycloakSecurityContext(
                deployment
                ,null
                ,tokenString
                ,token
                ,null
                ,null
                ,null);
    }

    private AccessToken authenticateToken(String tokenString) {
        try {
            return AdapterTokenVerifier.verifyToken(tokenString, deployment);
        } catch (VerificationException e) {
            return null;
        }
    }
}
