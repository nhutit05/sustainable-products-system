package ctu.student.regreen.service.implement;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class GoogleTokenVerifier {

    private final String googleClientId;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GoogleTokenVerifier(
            @Value("${google.client-id}") String googleClientId) {
        this.googleClientId = googleClientId;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, String> verify(String credential) {
        try {
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + credential;
            String response = restTemplate.getForObject(url, String.class);
            JsonNode json = objectMapper.readTree(response);

            String aud = json.get("aud").asText();
            if (!googleClientId.equals(aud)) {
                throw new RuntimeException("Invalid Google token audience");
            }

            return Map.of(
                    "email", json.get("email").asText(),
                    "name", json.has("name") ? json.get("name").asText() : "",
                    "sub", json.get("sub").asText());
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Google token không hợp lệ: " + e.getMessage());
        }
    }
}
