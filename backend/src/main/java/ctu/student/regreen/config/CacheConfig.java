package ctu.student.regreen.config;

import java.time.Duration;
import java.util.List;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    CacheManager cacheManager() {

        CaffeineCacheManager manager = new CaffeineCacheManager();

        manager.setCacheNames(List.of("embeddings", "retrievals", "rag-context", "rewrite-query"));

        manager.setCaffeine(

                Caffeine.newBuilder()

                        // tối đa 5000 embedding
                        .maximumSize(5000)

                        // hết hạn sau 30 phút không sử dụng
                        .expireAfterAccess(Duration.ofMinutes(30))

                        // thống kê hit/miss
                        .recordStats()

        );
        

        return manager;
    }

}