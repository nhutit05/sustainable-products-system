package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.CityRequest;
import ctu.student.regreen.dto.response.CityResponse;
import ctu.student.regreen.dto.response.PageResponse;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.mapper.CityMapper;
import ctu.student.regreen.model.City;
import ctu.student.regreen.repository.CityRepository;
import ctu.student.regreen.service.interfaces.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CityServiceImpl implements CityService {

    private final CityRepository repository;
    private final CityMapper CityMapper;

    @Transactional
    public CityResponse create(CityRequest request) {
        City entity = CityMapper.toEntity(request);
        return CityMapper.toResponse(repository.save(entity));
    }

    public List<CityResponse> getAllCities() {
        return repository.findAll()
                .stream()
                .map(CityMapper::toResponse)
                .toList();
    }

    public CityResponse getCityById(Integer id) {
        City entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CITY_NOT_FOUND));

        return CityMapper.toResponse(entity);
    }

    @Transactional
    public CityResponse updateCity(Integer id, CityRequest request) {
        City entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Not found exception"));

        CityMapper.update(entity, request);

        return CityMapper.toResponse(repository.save(entity));
    }

    @Transactional
    public void deleteCity(Integer id) {
        repository.deleteById(id);
    }

    public PageResponse<CityResponse> getCitiesPaginated(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("cityName").ascending());
        if (keyword == null) keyword = "";
        keyword = keyword.trim();

        Page<City> cityPage = repository.findByCityNameContainingIgnoreCase(keyword, pageable);

        List<CityResponse> responses = cityPage.getContent().stream()
                .map(CityMapper::toResponse)
                .toList();

        return PageResponse.<CityResponse>builder()
                .content(responses)
                .page(cityPage.getNumber())
                .size(cityPage.getSize())
                .totalElements(cityPage.getTotalElements())
                .totalPages(cityPage.getTotalPages())
                .last(cityPage.isLast())
                .build();
    }
}
