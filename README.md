#Spring security Websocket chat application with Keycloak and ReactJS
## Demonstration of how to secure Spring Websockets with Keycloak

###Running the application

#### Prerequisites

#####Keycloak installation
The app has been tested with Keycloak version 4.8.3. Download this version or later from
the home page of keycloak: [Keycloak download page](https://www.keycloak.org/downloads.html)

1. Extract the downloaded package and on the commandline navigate to the bin folder.
2. Execute: *./standalone.sh -Djboss.socket.binding.port-offset=100"*
3. Open the Keycloak [Admin Console](http://localhost:8180/auth) and create an initial account
4. Login to [Keycloak](http://localhost:8180/auth)
5. In the top left corner, choose "create realm", and create a realm called: "chat-app-realm".
6. Import the settings from *realm-import.json* provided in this project.
7. Add two new users: "johan", and "tinus". Choose a password of your choosing.

#### Building the backend

1. Within the project folder build with Maven: *mvn clean install*
2. Go to the *frontend* folder and install all npm modules: *npm install*

#### Finally... running it all

1. ./target/spring-keycloak-chatapp.jar&
2. cd frontend/; npm start;
3. Open a browser and navigate to [localhost:3000](http://lcoalhost:3000)
4. Open another browser and navigate to [localhost:3000](http://lcoalhost:3000)
5. Login with *johan* in the one browser, and with *tinus* in the other browser.
6. Edit the new users to give them both the role "USER" in the tab "ROLE MAPPINGS"

Send some messages to one another. After that watch what will happen if you restart the backend.
The browsers should reconnect automatically.

### Justification of implementation choices

As can be read in the Spring documentation, if you choose Bearer Token Auth for Websocket usages,
you need to add your own interceptor like so:

```Java
@Configuration
@EnableWebSocketMessageBroker
public class MyConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    Authentication user = ... ; // access authentication header(s)
                    accessor.setUser(user);
                }
                return message;
            }
        });
    }
}
```

Add the three dots you need to do the Keycloak authentication. Normally this would be done by the Keycloak adapter. But
we didnt get that far yet in the filter chain. So how do we call Keycloak and get an Authentication object?

We first look at the source code to see how Keycloak does it itself. There is a class named *BearerTokenRequestAuthenticator.java*
This class is the key to success. Taking some code from that and some from the Keycloak Spring security adapter, I coded
my own authenicator: *BearerTokenAuthenticator.java*. It does almost the same as the Keycloak source code.

This is therefore by no means production code, only at best a demonstration of how it can be done. To get production code
you need professional Software Engineers that know a thing or two about security. So I am giving a use disclaimer here!