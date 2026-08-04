package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.CartResponse;
import ctu.student.regreen.mapper.CartMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.service.implement.CartServiceImpl;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private CartRepository repository;

    @Mock
    private CartMapper mapper;

    @InjectMocks
    private CartServiceImpl service;

    private Cart cart;

    private static final Integer CART_ID = 1;
    private static final Integer CUSTOMER_ID = 10;
    private static final String USERNAME = "testuser";
    private static final LocalDateTime CARTED_AT =
            LocalDateTime.of(2025, 6, 1, 10, 0);

    @BeforeEach
    void setUp() {

        Authentication authentication =
                mock(Authentication.class);

        SecurityContext securityContext =
                mock(SecurityContext.class);

        when(authentication.getName())
                .thenReturn(USERNAME);

        when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(
                securityContext);

        Customer customer = new Customer();
        customer.setUserId(CUSTOMER_ID);
        customer.setUsername(USERNAME);

        cart = new Cart();
        cart.setCartId(CART_ID);
        cart.setCartedAt(CARTED_AT);
        cart.setCustomer(customer);
    }

    @AfterEach
    void tearDown() {

        SecurityContextHolder.clearContext();
    }

    private CartResponse cartResponse() {

        return new CartResponse(
                CART_ID,
                CARTED_AT,
                CUSTOMER_ID,
                USERNAME);
    }

    @Test
    void getMyCart_success() {

        when(repository.findByCustomerUsername(USERNAME))
                .thenReturn(Optional.of(cart));

        when(mapper.toResponse(cart))
                .thenReturn(cartResponse());

        CartResponse result =
                service.getMyCart();

        assertNotNull(result);
        assertEquals(CART_ID, result.getCartId());
        assertEquals(CUSTOMER_ID, result.getCustomerId());
        assertEquals(USERNAME, result.getCustomerUsername());
        assertEquals(CARTED_AT, result.getCartedAt());

        verify(repository).findByCustomerUsername(USERNAME);
        verify(mapper).toResponse(cart);
    }

    @Test
    void getMyCart_notFound_throwsException() {

        when(repository.findByCustomerUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getMyCart());

        assertEquals("Cart not found", ex.getMessage());

        verify(repository).findByCustomerUsername(USERNAME);
        verify(mapper, never()).toResponse(any());
    }
}
