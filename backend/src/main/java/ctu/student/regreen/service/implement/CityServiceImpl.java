package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.CityRequest;
import ctu.student.regreen.dto.response.CityResponse;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ErrorResponse;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.mapper.CityMapper;
import ctu.student.regreen.model.City;
import ctu.student.regreen.repository.CityRepository;
import ctu.student.regreen.service.interfaces.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {

    private final CityRepository repository;

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

    public CityResponse updateCity(Integer id, CityRequest request) {
        City entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Not found exception"));

        CityMapper.update(entity, request);

        return CityMapper.toResponse(repository.save(entity));
    }

    public void deleteCity(Integer id) {
        repository.deleteById(id);
    }
}
