package ctu.student.regreen.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {

    private String url;

    private String serviceKey;

    private Storage storage = new Storage();

    @Getter
    @Setter
    public static class Storage {
        private String bucket;
    }
}