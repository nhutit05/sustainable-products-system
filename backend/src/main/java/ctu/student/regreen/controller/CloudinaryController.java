package ctu.student.regreen.controller;

import ctu.student.regreen.service.interfaces.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService service;

    @PostMapping("/upload")
    public String getUrlAndUploadImage(
            @RequestParam("image")MultipartFile file) {
        Map data = service.uploadImage(file);

        String url = (String) data.get("url");
        return url;
    }
}
