package ctu.student.regreen.integration.payos.util;

import org.springframework.stereotype.Component;

@Component
public class PayOSOrderCodeGenerator {

    public long generate() {
        return System.currentTimeMillis();
    }

}