package ctu.student.regreen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class RegreenApplication {
	public static void main(String[] args) {
		SpringApplication.run(RegreenApplication.class, args);
	}

}
