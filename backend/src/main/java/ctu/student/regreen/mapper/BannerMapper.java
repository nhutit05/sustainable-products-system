package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.BannerRequest;
import ctu.student.regreen.dto.response.BannerResponse;
import ctu.student.regreen.model.Banner;
import org.springframework.stereotype.Component;

@Component
public class BannerMapper {

    public Banner toEntity(BannerRequest request) {
        Banner banner = new Banner();
        banner.setTitle(request.getTitle());
        banner.setSubtitle(request.getSubtitle());
        banner.setContent(request.getContent());
        banner.setButtonText(request.getButtonText());
        banner.setButtonLink(request.getButtonLink());
        banner.setDisplayOrder(request.getDisplayOrder());
        banner.setIsActive(request.getIsActive());
        return banner;
    }

    public void update(Banner banner, BannerRequest request) {
        banner.setTitle(request.getTitle());
        banner.setSubtitle(request.getSubtitle());
        banner.setContent(request.getContent());
        banner.setButtonText(request.getButtonText());
        banner.setButtonLink(request.getButtonLink());
        banner.setDisplayOrder(request.getDisplayOrder());
        banner.setIsActive(request.getIsActive());
    }

    public BannerResponse toResponse(Banner banner) {
        return new BannerResponse(
                banner.getBannerId(),
                banner.getTitle(),
                banner.getSubtitle(),
                banner.getContent(),
                banner.getImageUrl(),
                banner.getButtonText(),
                banner.getButtonLink(),
                banner.getDisplayOrder(),
                banner.getIsActive(),
                banner.getCreatedAt(),
                banner.getUpdatedAt()
        );
    }
}
