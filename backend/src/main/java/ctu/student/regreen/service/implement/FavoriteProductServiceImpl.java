package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.FavoriteProductRequest;
import ctu.student.regreen.dto.response.FavoriteProductResponse;
import ctu.student.regreen.mapper.FavoriteProductMapper;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.FavoriteProduct;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.FavoriteProductRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.FavoriteProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteProductServiceImpl implements FavoriteProductService {
    private final FavoriteProductRepository repository;

    private final ProductRepository productRepository;

    private final CustomerRepository customerRepository;

    private final FavoriteProductMapper mapper;

    private Customer getCurrentCustomer() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public List<FavoriteProductResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<FavoriteProductResponse> getAllByUserId() {
        Customer customer = getCurrentCustomer();

        return repository.findAllByCustomerUserId(customer.getUserId())
                .stream()
                .map(mapper::toResponse)
                .toList();
    }


    public FavoriteProductResponse getByUserIdAndProductId(Integer productId) {
        Customer customer = getCurrentCustomer();
        return mapper.toResponse(repository.findByCustomerUserIdAndProductProductId(customer.getUserId(), productId));
    }

    public FavoriteProductResponse create(FavoriteProductRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Customer customer = getCurrentCustomer();

        FavoriteProduct entity = mapper.toEntity(request, product, customer);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public FavoriteProductResponse update(Integer userId, Integer productId, FavoriteProductRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Customer customer = getCurrentCustomer();

        FavoriteProduct entity = repository.findByCustomerUserIdAndProductProductId(userId, productId);

        mapper.update(entity, request, product, customer);

        return mapper.toResponse(repository.save(entity));
    }


    @Transactional
    public Boolean delete(Integer productId) {
        Customer customer = getCurrentCustomer();
        FavoriteProduct entity = repository.findByCustomerUserIdAndProductProductId(customer.getUserId(), productId);
        if(entity != null) {
            repository.delete(entity);
            return true;
        } else {
            return false;
        }
    }
}
