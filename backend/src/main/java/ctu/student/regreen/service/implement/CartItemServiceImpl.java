package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
import ctu.student.regreen.service.interfaces.CartItemService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository repository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartItemMapper mapper;

    private Cart getCurrentCart() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return cartRepository.findByCustomerUsername(username)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    //

    @Override
    public CartItemResponse add(CartItemRequest request) {

        Cart cart = getCurrentCart();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItemId id = new CartItemId(cart.getCartId(), product.getProductId());

        CartItem item = repository.findById(id).orElse(null);

        int requestedQuantity = request.getQuantity();

        // Kiểm tra số lượng hợp lệ
        if (requestedQuantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (item != null) {
            int newQuantity = item.getQuantity() + requestedQuantity;

            // Kiểm tra tồn kho
            if (newQuantity > product.getInventory()) {
                throw new RuntimeException(
                        "Not enough stock. Available: " + product.getInventory());
            }

            item.setQuantity(newQuantity);
        } else {

            // Kiểm tra tồn kho
            if (requestedQuantity > product.getInventory()) {
                throw new RuntimeException(
                        "Not enough stock. Available: " + product.getInventory());
            }

            item = new CartItem();
            item.setId(id);
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(requestedQuantity);
        }

        return mapper.toResponse(repository.save(item));
    }

    @Override
    public List<CartItemResponse> getMyCartItems() {

        Cart cart = getCurrentCart();

        return repository.findByCartCartId(cart.getCartId())
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public CartItemResponse update(Integer productId, Integer quantity) {

        Cart cart = getCurrentCart();

        CartItemId id = new CartItemId(cart.getCartId(), productId);

        CartItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(quantity);

        return mapper.toResponse(repository.save(item));
    }

    @Override
    public void delete(Integer productId) {

        Cart cart = getCurrentCart();

        CartItemId id = new CartItemId(cart.getCartId(), productId);

        CartItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        repository.delete(item);
    }
}