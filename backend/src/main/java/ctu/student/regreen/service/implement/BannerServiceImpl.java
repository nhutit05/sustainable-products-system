package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.BannerRequest;
import ctu.student.regreen.dto.response.BannerResponse;
import ctu.student.regreen.mapper.BannerMapper;
import ctu.student.regreen.model.Banner;
import ctu.student.regreen.repository.BannerRepository;
import ctu.student.regreen.service.interfaces.BannerService;
import ctu.student.regreen.service.interfaces.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BannerServiceImpl implements BannerService {

    private final BannerRepository repository;
    private final BannerMapper mapper;
    private final CloudinaryService cloudinaryService;

    @Override
    public List<BannerResponse> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<BannerResponse> getActiveBanners() {
        return repository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public BannerResponse getById(Integer id) {
        Banner banner = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Banner not found with id: " + id));
        return mapper.toResponse(banner);
    }

    @Override
    @Transactional
    public BannerResponse create(BannerRequest request) {
        MultipartFile imageFile = request.getImageFile();
        if (imageFile == null || imageFile.isEmpty()) {
            throw new RuntimeException("Hình ảnh banner không được trống");
        }

        Map uploadResult = cloudinaryService.uploadImage(imageFile);
        String imageUrl = (String) uploadResult.get("url");

        Banner banner = mapper.toEntity(request);
        banner.setImageUrl(imageUrl);

        return mapper.toResponse(repository.save(banner));
    }

    @Override
    @Transactional
    public BannerResponse update(Integer id, BannerRequest request) {
        Banner banner = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Banner not found with id: " + id));

        MultipartFile imageFile = request.getImageFile();
        if (imageFile != null && !imageFile.isEmpty()) {
            Map uploadResult = cloudinaryService.uploadImage(imageFile);
            String imageUrl = (String) uploadResult.get("url");
            banner.setImageUrl(imageUrl);
        }

        mapper.update(banner, request);

        return mapper.toResponse(repository.save(banner));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Banner banner = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Banner not found with id: " + id));
        repository.delete(banner);
    }
}
