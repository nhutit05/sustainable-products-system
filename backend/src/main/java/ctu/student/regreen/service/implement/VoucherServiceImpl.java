package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.mapper.VoucherMapper;
import ctu.student.regreen.model.Voucher;
import ctu.student.regreen.repository.VoucherRepository;
import ctu.student.regreen.service.interfaces.VoucherService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository repository;
    private final VoucherMapper mapper;

    @Override
    public VoucherResponse create(VoucherRequest request) {

        if (repository.existsByCode(request.getCode())) {
            throw new RuntimeException("Voucher code already exists");
        }

        validateDate(request);

        Voucher voucher = mapper.toEntity(request);

        voucher = repository.save(voucher);

        return mapper.toResponse(voucher);
    }

    @Override
    public List<VoucherResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public VoucherResponse getById(Integer id) {

        Voucher voucher = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Voucher not found with id: " + id));

        return mapper.toResponse(voucher);
    }

    @Override
    public VoucherResponse update(Integer id, VoucherRequest request) {

        validateDate(request);

        Voucher voucher = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Voucher not found with id: " + id));

        mapper.update(voucher, request);

        voucher = repository.save(voucher);

        return mapper.toResponse(voucher);
    }

    @Override
    public void delete(Integer id) {

        Voucher voucher = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Voucher not found with id: " + id));

        repository.delete(voucher);
    }

    private void validateDate(VoucherRequest request) {

        if (request.getExpiredAt().isBefore(request.getStartedAt())) {
            throw new RuntimeException(
                    "Expired date must be after or equal started date");
        }
    }
}