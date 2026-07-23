package ctu.student.regreen.controller;

import ctu.student.regreen.dto.response.BannerResponse;
import ctu.student.regreen.service.interfaces.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerPublicController {

    private final BannerService service;

    @GetMapping("/active")
    public List<BannerResponse> getActiveBanners() {
        return service.getActiveBanners();
    }
}
