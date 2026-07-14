package ctu.student.regreen.service.implement;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.response.CartResponse;
import ctu.student.regreen.mapper.CartMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.service.interfaces.CartService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartServiceImpl implements CartService {

    private final CartRepository repository;
    private final CartMapper mapper;

    @Override
    public CartResponse getMyCart() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Cart cart = repository.findByCustomerUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        return mapper.toResponse(cart);
    }
}