package ro.unibuc.gw.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .authorizeExchange()
                .pathMatchers("/**", "/_next/**", "/favicon.ico",
                        "/api/auth/**", "/api/gw/**", "/api/home/**", "/api/country/**", "/api/city/**",
                        "/api/home/**", "/api/room/**", "/api/record/**", "/devices", "/settings")
                    .permitAll()
                .anyExchange()
                    .authenticated()
                .and()
                .csrf()
                    .disable()
                .oauth2ResourceServer()
                    .jwt();

        return http.build();
    }
}
