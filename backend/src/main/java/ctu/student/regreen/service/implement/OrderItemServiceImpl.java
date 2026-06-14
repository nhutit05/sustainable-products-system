package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.response.OrderItemResponse;
import ctu.student.regreen.mapper.OrderItemMapper;
import ctu.student.regreen.repository.OrderItemRepository;
import ctu.student.regreen.service.interfaces.OrderItemService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl
        implements OrderItemService {

    private final OrderItemRepository repository;

    private final OrderItemMapper mapper;

    @Override
    public List<OrderItemResponse> getByOrder(
            Integer orderId) {

        return repository.findByOrderOrderId(orderId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}