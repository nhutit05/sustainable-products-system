package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.BannerRequest;
import ctu.student.regreen.dto.response.BannerResponse;
import ctu.student.regreen.service.interfaces.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {

    private final BannerService service;

    @GetMapping
    public List<BannerResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public BannerResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BannerResponse create(
            @RequestPart("request") BannerRequest request,
            @RequestPart("image") MultipartFile image
    ) {
        request.setImageFile(image);
        return service.create(request);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BannerResponse update(
            @PathVariable Integer id,
            @RequestPart("request") BannerRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        request.setImageFile(image);
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
