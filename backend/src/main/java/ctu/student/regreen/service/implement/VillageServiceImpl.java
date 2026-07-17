package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.VillageRequest;
import ctu.student.regreen.dto.response.PageResponse;
import ctu.student.regreen.dto.response.VillageResponse;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.mapper.VillageMapper;
import ctu.student.regreen.model.Village;
import ctu.student.regreen.repository.VillageRepository;
import ctu.student.regreen.service.interfaces.VillageService;
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
public class VillageServiceImpl implements VillageService {

    private final VillageRepository repository;

    private final VillageMapper villageMapper;

@Transactional
    public VillageResponse create(VillageRequest request) {
        Village entity = villageMapper.toEntity(request);
        return villageMapper.toResponse(repository.save(entity));
    }

    public List<VillageResponse> getAllVillages(Integer cityId) {
        return repository.findByCityCityId(cityId)
                .stream()
                .map(villageMapper::toResponse)
                .toList();

    }


    public VillageResponse getVillageById(Integer id) {
        Village entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(ErrorCode.VILLAGE_NOT_FOUND));
        return villageMapper.toResponse(entity);
    }

    public VillageResponse getVillageByName(String name) {
        Village entity = repository.findByVillageName(name).orElseThrow(() -> new ResourceNotFoundException(ErrorCode.VILLAGE_NOT_FOUND));
        return villageMapper.toResponse(entity);
    }

    @Transactional
    public VillageResponse updateVillage(Integer id, VillageRequest request) {
        Village entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Not found exception"));
        villageMapper.update(entity, request);
        return villageMapper.toResponse(repository.save(entity));
    }

    @Transactional
    public boolean deleteVillage(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public PageResponse<VillageResponse> getVillagesPaginated(int page, int size, Integer cityId, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("villageName").ascending());
        if (keyword == null) keyword = "";
        keyword = keyword.trim();

        Page<Village> villagePage = repository.searchVillages(cityId, keyword, pageable);

        List<VillageResponse> responses = villagePage.getContent().stream()
                .map(villageMapper::toResponse)
                .toList();

        return PageResponse.<VillageResponse>builder()
                .content(responses)
                .page(villagePage.getNumber())
                .size(villagePage.getSize())
                .totalElements(villagePage.getTotalElements())
                .totalPages(villagePage.getTotalPages())
                .last(villagePage.isLast())
                .build();
    }
}
