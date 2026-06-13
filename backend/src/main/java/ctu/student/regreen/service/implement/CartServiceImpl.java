package ctu.student.regreen.service.implement;

import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.response.CartResponse;
import ctu.student.regreen.mapper.CartMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.service.interfaces.CartService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository repository;
    private final CartMapper mapper;

    @Override
    public CartResponse getByCustomerId(Integer customerId) {

        Cart cart = repository.findByCustomerUserId(customerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart not found for customer id: " + customerId));

        return mapper.toResponse(cart);
    }
}