package ctu.student.regreen.service.interfaces;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;


public interface CloudinaryService {

    public Map uploadImage(MultipartFile file);
}
