package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.OrderStatusRequest;
import ctu.student.regreen.dto.response.OrderStatusResponse;
import ctu.student.regreen.mapper.OrderStatusMapper;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.repository.OrderStatusRepository;
import ctu.student.regreen.service.interfaces.OrderStatusService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderStatusServiceImpl implements OrderStatusService {

    private final OrderStatusRepository repository;
    private final OrderStatusMapper mapper;

    @Override
    @Transactional
    public OrderStatusResponse create(OrderStatusRequest request) {

        if (repository.existsByOrderStatusName(request.getOrderStatusName())) {
            throw new RuntimeException("Order status already exists");
        }

        OrderStatus orderStatus = mapper.toEntity(request);

        return mapper.toResponse(repository.save(orderStatus));
    }

    @Override
    public List<OrderStatusResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public OrderStatusResponse getById(Integer id) {

        OrderStatus orderStatus = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order status not found with id: " + id));

        return mapper.toResponse(orderStatus);
    }

    @Override
    @Transactional
    public OrderStatusResponse update(Integer id, OrderStatusRequest request) {

        OrderStatus orderStatus = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order status not found with id: " + id));

        if (repository.existsByOrderStatusName(request.getOrderStatusName())
                && !orderStatus.getOrderStatusName().equals(request.getOrderStatusName())) {
            throw new RuntimeException("Order status already exists");
        }

        mapper.update(orderStatus, request);

        return mapper.toResponse(orderStatus);
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        OrderStatus orderStatus = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order status not found with id: " + id));

        repository.delete(orderStatus);
    }
}