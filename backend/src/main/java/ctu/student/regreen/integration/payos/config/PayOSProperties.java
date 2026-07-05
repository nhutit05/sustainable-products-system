package ctu.student.regreen.integration.payos.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "payos")
public class PayOSProperties {

    private String clientId;

    private String apiKey;

    private String checksumKey;

    private String returnUrl;

    private String cancelUrl;

}