package ro.unibuc.ml.mlapp.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@EnableCaching
@Configuration
public class CacheConfiguration {

    @Bean
    public Caffeine<?, ?> caffeineConfig() {
        return Caffeine
                .newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES);
    }

    @Bean
    public CacheManager cacheManager(Caffeine<?, ?> caffeine) {
        var cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine((Caffeine<Object, Object>) caffeine);

        return cacheManager;
    }
}
