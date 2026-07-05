package ctu.student.regreen.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter filter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // ================= AUTH =================
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/test/**").permitAll()
                        .requestMatchers("/api/payos/**").permitAll()

                        // ================= ADMIN ONLY =================
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/storage/**").hasRole("ADMIN")
                        .requestMatchers("/api/parser/**").hasRole("ADMIN")

                        // ================= CUSTOMER AUTH REQUIRED =================
                        .requestMatchers("/api/orders/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/refund-slips/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/cart/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/addresses/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/favorite-products/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/payment-methods/**").hasRole("CUSTOMER")
                        // .requestMatchers("/api/villages/**").hasRole("CUSTOMER")
                        // .requestMatchers("/api/cities/**").hasRole("CUSTOMER")

                        // ================= PUBLIC READ (CUSTOMER + ADMIN) =================
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers("/api/vouchers/**").permitAll()
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/reviews/**").permitAll()
                        .requestMatchers("/api/cloudinary/**").permitAll()

                                                .requestMatchers(
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui.html")
                                                .permitAll()
                        .requestMatchers("/api/banks").hasAnyRole("CUSTOMER", "ADMIN")
                        .requestMatchers("/api/cities").hasAnyRole("CUSTOMER", "ADMIN")
                        .requestMatchers("/api/villages").hasAnyRole("CUSTOMER", "ADMIN")
                        .requestMatchers("/jacoco/**").permitAll()
                        .requestMatchers("/api/chat/**").permitAll()
                        // fallback
                        .anyRequest().authenticated())

                .addFilterBefore(
                        filter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173"));

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}