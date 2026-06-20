package ctu.student.regreen.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import ctu.student.regreen.service.implement.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException,
            IOException {

        String header =
                request.getHeader(
                        "Authorization");

        if (header == null
                || !header.startsWith(
                        "Bearer ")) {

            filterChain.doFilter(
                    request,
                    response);

            return;
        }

        String token =
                header.substring(7);

        String username =
                jwtService.extractUsername(
                        token);

        String role =
                jwtService.extractRole(
                        token);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        List.of(
                                new SimpleGrantedAuthority(
                                        role)));

        SecurityContextHolder
                .getContext()
                .setAuthentication(
                        auth);

        filterChain.doFilter(
                request,
                response);
    }
}
