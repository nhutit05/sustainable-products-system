package ctu.student.regreen.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Lấy đường dẫn tuyệt đối đến thư mục chứa báo cáo JaCoCo
        String reportPath = Paths.get("target/site/jacoco").toAbsolutePath().toUri().toString();
        
        // Cấu hình: Khi truy cập /jacoco/** sẽ map vào thư mục target/site/jacoco
        registry.addResourceHandler("/jacoco/**")
                .addResourceLocations(reportPath);
    }
}
