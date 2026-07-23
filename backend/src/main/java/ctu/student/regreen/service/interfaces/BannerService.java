package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.BannerRequest;
import ctu.student.regreen.dto.response.BannerResponse;

import java.util.List;

public interface BannerService {

    List<BannerResponse> getAll();

    List<BannerResponse> getActiveBanners();

    BannerResponse getById(Integer id);

    BannerResponse create(BannerRequest request);

    BannerResponse update(Integer id, BannerRequest request);

    void delete(Integer id);
}
