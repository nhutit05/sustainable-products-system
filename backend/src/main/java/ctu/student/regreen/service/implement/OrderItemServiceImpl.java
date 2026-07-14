package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.response.OrderItemResponse;
import ctu.student.regreen.mapper.OrderItemMapper;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.OrderItemRepository;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.service.interfaces.OrderItemService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository repository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemMapper mapper;

    @Override
    public List<OrderItemResponse> getByOrder(Integer orderId) {

        Customer customer = getCurrentCustomer();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        validateOwnership(order, customer);

        return repository.findByOrderOrderId(orderId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    // =========================
    // SECURITY HELPERS
    // =========================

    private Customer getCurrentCustomer() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    private void validateOwnership(Order order, Customer customer) {

        if (!order.getCustomer()
                .getUserId()
                .equals(customer.getUserId())) {

            throw new RuntimeException("Access denied");
        }
    }
}