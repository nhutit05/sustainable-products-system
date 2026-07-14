package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.RefundStatusRequest;
import ctu.student.regreen.dto.response.RefundStatusResponse;
import ctu.student.regreen.mapper.RefundStatusMapper;
import ctu.student.regreen.model.RefundStatus;
import ctu.student.regreen.repository.RefundStatusRepository;
import ctu.student.regreen.service.interfaces.RefundStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RefundStatusServiceImpl
        implements RefundStatusService {

    private final RefundStatusRepository repository;

    private final RefundStatusMapper mapper;

    @Override
    public List<RefundStatusResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public RefundStatusResponse getById(
            Integer id) {

        RefundStatus status =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Refund status not found"));

        return mapper.toResponse(status);
    }

    @Override
    @Transactional
    public RefundStatusResponse create(
            RefundStatusRequest request) {

        RefundStatus status =
                mapper.toEntity(request);

        return mapper.toResponse(
                repository.save(status));
    }

    @Override
    @Transactional
    public RefundStatusResponse update(
            Integer id,
            RefundStatusRequest request) {

        RefundStatus status =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Refund status not found"));

        mapper.update(
                status,
                request);

        return mapper.toResponse(
                repository.save(status));
    }

    @Override
    @Transactional
    public void delete(
            Integer id) {

        if (!repository.existsById(id)) {

            throw new RuntimeException(
                    "Refund status not found");
        }

        repository.deleteById(id);
    }
}