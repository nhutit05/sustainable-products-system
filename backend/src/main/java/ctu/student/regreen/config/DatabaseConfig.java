package ctu.student.regreen.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class DatabaseConfig implements CommandLineRunner {

    @Autowired
    private DataSource dataSource; // lấy dữ liệu được cấu hình bởi datasource

    @Override
    public void run(String... args) throws Exception {
        Connection connection = dataSource.getConnection();

        if(connection != null) {
            System.out.println("Kết nối CSDL PostgreSQL thành công !");
        } else {
            System.out.println("Có lỗi trong quá trình kết nối CSDL !!!");
        }
        connection.close();
    }
}
