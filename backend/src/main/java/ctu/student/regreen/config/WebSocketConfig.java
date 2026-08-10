package ctu.student.regreen.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    public WebSocketConfig(
            WebSocketAuthInterceptor webSocketAuthInterceptor) {

        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        config.enableSimpleBroker("/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        String allowedOrigins = System.getenv().getOrDefault(
                "CORS_ALLOWED_ORIGINS",
                "http://localhost:5173");

        registry.addEndpoint("/ws")
                .setAllowedOrigins(allowedOrigins.split(","))
                .addInterceptors(webSocketAuthInterceptor)
                .withSockJS();
    }
}
