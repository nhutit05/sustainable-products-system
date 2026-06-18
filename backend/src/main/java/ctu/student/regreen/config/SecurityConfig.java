package ctu.student.regreen.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter filter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        return http
                .csrf(
                        csrf -> csrf.disable())

                .sessionManagement(
                        session -> session
                                .sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(
                        auth -> auth

                                .requestMatchers(
                                        "/api/auth/**")
                                .permitAll()

                                .requestMatchers("/api/admin/**")
                                .hasRole("ADMIN")

                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/products/**")
                                .permitAll()

                                .requestMatchers(
                                        "/api/cart/**")
                                .hasRole(
                                        "CUSTOMER")

                                .requestMatchers(
                                        "/api/orders/**")
                                .hasRole(
                                        "CUSTOMER")

                                .requestMatchers(
                                        "/api/refund-slips/**")
                                .hasRole(
                                        "CUSTOMER")

                                .anyRequest()
                                .authenticated())

                .addFilterBefore(
                        filter,
                        UsernamePasswordAuthenticationFilter.class)

                .build();
    }

}