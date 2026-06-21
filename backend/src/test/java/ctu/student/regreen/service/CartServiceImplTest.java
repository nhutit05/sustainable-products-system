package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.CartResponse;
import ctu.student.regreen.mapper.CartMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.service.implement.CartServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

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
    private CartResponse response;

    @BeforeEach
    void setUp() {

        Authentication authentication =
                mock(Authentication.class);

        SecurityContext securityContext =
                mock(SecurityContext.class);

        when(authentication.getName())
                .thenReturn("testuser");

        when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(
                securityContext);

        cart = new Cart();
        cart.setCartId(1);

        response =
                mock(CartResponse.class);

        lenient()
                .when(mapper.toResponse(any()))
                .thenReturn(response);
    }

    @Test
    void getMyCart_success() {

        when(repository.findByCustomerUsername(
                "testuser"))
                .thenReturn(
                        Optional.of(cart));

        CartResponse result =
                service.getMyCart();

        assertNotNull(result);

        verify(repository)
                .findByCustomerUsername(
                        "testuser");
    }

    @Test
    void getMyCart_notFound_fail() {

        when(repository.findByCustomerUsername(
                "testuser"))
                .thenReturn(
                        Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getMyCart());

        assertEquals(
                "Cart not found",
                ex.getMessage());
    }
}