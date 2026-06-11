package ctu.student.regreen.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseConfig implements CommandLineRunner {

    private final DataSource dataSource;

    @Value("${server.port}")
    private String port;

    @Override
    public void run(String... args) {
        try (Connection connection = dataSource.getConnection()) {

            log.info("Kết nối CSDL PostgreSQL thành công!");

            log.info("Database: {}", connection.getMetaData().getDatabaseProductName());

        } catch (Exception e) {
            log.error("Có lỗi khi kết nối CSDL!", e);
        }

        log.info("Link: http://localhost:{}/api", port);
    }
}