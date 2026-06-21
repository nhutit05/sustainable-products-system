package ctu.student.regreen.service.implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.service.interfaces.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;


@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map uploadImage(MultipartFile file) {
        try {
            Map data = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                    "folder", "ReGreen"
            ));
            return data;
        } catch (Exception e) {
            throw new ResourceNotFoundException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }
}
