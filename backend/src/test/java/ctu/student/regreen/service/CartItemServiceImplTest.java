package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.CartItemRequest;
import ctu.student.regreen.dto.response.CartItemResponse;
import ctu.student.regreen.mapper.CartItemMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.CartItem;
import ctu.student.regreen.model.CartItemId;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.repository.CartItemRepository;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.implement.CartItemServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartItemServiceImplTest {

        @Mock
        private CartItemRepository repository;

        @Mock
        private CartRepository cartRepository;

        @Mock
        private ProductRepository productRepository;

        @Mock
        private CartItemMapper mapper;

        @InjectMocks
        private CartItemServiceImpl service;

        private Cart cart;
        private Product product;
        private CartItem item;
        private CartItemResponse response;

        @BeforeEach
        void setUp() {

                Authentication authentication = mock(Authentication.class);

                SecurityContext securityContext = mock(SecurityContext.class);

                when(authentication.getName())
                                .thenReturn("testuser");

                when(securityContext.getAuthentication())
                                .thenReturn(authentication);

                SecurityContextHolder.setContext(
                                securityContext);

                cart = new Cart();
                cart.setCartId(1);

                product = new Product();
                product.setProductId(10);
                product.setProductName("Sản phẩm tái chế");
                product.setInventory(10);

                item = new CartItem();
                item.setId(
                                new CartItemId(1, 10));
                item.setCart(cart);
                item.setProduct(product);
                item.setQuantity(2);

                response = mock(CartItemResponse.class);

                lenient().when(cartRepository
                                .findByCustomerUsername("testuser"))
                                .thenReturn(Optional.of(cart));

                lenient()
                                .when(mapper.toResponse(any()))
                                .thenReturn(response);
        }

        @Test
        void add_newItem_success() {

                CartItemRequest request = new CartItemRequest();

                request.setProductId(10);
                request.setQuantity(3);

                when(productRepository.findById(10))
                                .thenReturn(Optional.of(product));

                when(repository.findById(any()))
                                .thenReturn(Optional.empty());

                when(repository.save(any()))
                                .thenAnswer(i -> i.getArgument(0));

                CartItemResponse result = service.add(request);

                assertNotNull(result);

                verify(repository)
                                .save(any());
        }

        @Test
        void add_existingItem_success() {

                CartItemRequest request = new CartItemRequest();

                request.setProductId(10);
                request.setQuantity(3);

                when(productRepository.findById(10))
                                .thenReturn(Optional.of(product));

                when(repository.findById(any()))
                                .thenReturn(Optional.of(item));

                when(repository.save(any()))
                                .thenAnswer(i -> i.getArgument(0));

                service.add(request);

                assertEquals(
                                5,
                                item.getQuantity());
        }

        @Test
        void add_productNotFound_fail() {

                CartItemRequest request = new CartItemRequest();

                request.setProductId(10);
                request.setQuantity(1);

                when(productRepository.findById(10))
                                .thenReturn(Optional.empty());

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.add(request));

                assertEquals(
                                "Product not found",
                                ex.getMessage());
        }

        @Test
        void getMyCartItems_success() {

                when(repository.findByCartCartId(1))
                                .thenReturn(List.of(item));

                List<CartItemResponse> result = service.getMyCartItems();

                assertEquals(
                                1,
                                result.size());
        }

        @Test
        void update_success() {

                when(repository.findById(any()))
                                .thenReturn(Optional.of(item));

                when(repository.save(any()))
                                .thenAnswer(i -> i.getArgument(0));

                service.update(
                                10,
                                7);

                assertEquals(
                                7,
                                item.getQuantity());
        }

        @Test
        void update_itemNotFound_fail() {

                when(repository.findById(any()))
                                .thenReturn(Optional.empty());

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.update(
                                                10,
                                                5));

                assertEquals(
                                "Cart item not found",
                                ex.getMessage());
        }

        @Test
        void delete_success() {

                when(repository.findById(any()))
                                .thenReturn(Optional.of(item));

                service.delete(10);

                verify(repository)
                                .delete(item);
        }

        @Test
        void delete_itemNotFound_fail() {

                when(repository.findById(any()))
                                .thenReturn(Optional.empty());

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.delete(10));

                assertEquals(
                                "Cart item not found",
                                ex.getMessage());
        }

        @Test
        void add_insufficientInventory_fail() {

                CartItemRequest request = new CartItemRequest();
                request.setProductId(10);
                request.setQuantity(5);

                product.setInventory(2);

                when(productRepository.findById(10))
                                .thenReturn(Optional.of(product));

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.add(request));

                assertEquals(
                                "Not enough stock. Available: "  + product.getInventory(),
                                ex.getMessage());

                verify(repository, never()).save(any());
        }
}