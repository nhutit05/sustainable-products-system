package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.PaymentMethodRequest;
import ctu.student.regreen.dto.response.PaymentMethodResponse;
import ctu.student.regreen.mapper.PaymentMethodMapper;
import ctu.student.regreen.model.PaymentMethod;
import ctu.student.regreen.repository.PaymentMethodRepository;
import ctu.student.regreen.service.interfaces.PaymentMethodService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository repository;
    private final PaymentMethodMapper mapper;

    @Override
    @Transactional
    public PaymentMethodResponse create(PaymentMethodRequest request) {

        if (repository.existsByPaymentMethodName(
                request.getPaymentMethodName())) {

            throw new RuntimeException(
                    "Payment method already exists");
        }

        PaymentMethod entity = mapper.toEntity(request);

        return mapper.toResponse(
                repository.save(entity));
    }

    @Override
    public List<PaymentMethodResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public PaymentMethodResponse getById(Integer id) {

        PaymentMethod entity = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment method not found"));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public PaymentMethodResponse update(
            Integer id,
            PaymentMethodRequest request) {

        PaymentMethod entity = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment method not found"));

        if (repository.existsByPaymentMethodName(
                request.getPaymentMethodName())
                && !entity.getPaymentMethodName()
                        .equals(request.getPaymentMethodName())) {

            throw new RuntimeException(
                    "Payment method already exists");
        }

        mapper.update(entity, request);

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        PaymentMethod entity = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment method not found"));

        repository.delete(entity);
    }
}