package ctu.student.regreen.service;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.PaymentStatusRequest;
import ctu.student.regreen.dto.response.PaymentStatusResponse;
import ctu.student.regreen.exception.BusinessException;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.mapper.PaymentStatusMapper;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.repository.PaymentStatusRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentStatusService {

    private final PaymentStatusRepository repository;
    private final PaymentStatusMapper mapper;

    public PaymentStatusResponse create(PaymentStatusRequest request) {

        if (repository.existsByPaymentStatusName(request.getPaymentStatusName())) {
            throw new BusinessException(ErrorCode.PAYMENT_STATUS_ALREADY_EXISTS);
        }

        PaymentStatus entity = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entity));
    }

    public PaymentStatusResponse getById(Integer id) {

        PaymentStatus entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(ErrorCode.PAYMENT_STATUS_NOT_FOUND));

        return mapper.toResponse(entity);
    }

    public List<PaymentStatusResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public PaymentStatusResponse update(Integer id, PaymentStatusRequest request) {

        PaymentStatus entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(ErrorCode.PAYMENT_STATUS_NOT_FOUND));

        entity.setPaymentStatusName(request.getPaymentStatusName());

        return mapper.toResponse(entity);
    }

    public void delete(Integer id) {

        PaymentStatus entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(ErrorCode.PAYMENT_STATUS_NOT_FOUND));

        repository.delete(entity);
    }
}