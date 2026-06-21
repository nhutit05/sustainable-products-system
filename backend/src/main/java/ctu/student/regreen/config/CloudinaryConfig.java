package ctu.student.regreen.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary getCloudinary() {

        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dl9cupba4",
                "api_key", "365616633837281",
                "api_secret", "_s0IpMZlD_MHKd4ExnADQArUjuo",
                "secure", true
        ));
    }


}
