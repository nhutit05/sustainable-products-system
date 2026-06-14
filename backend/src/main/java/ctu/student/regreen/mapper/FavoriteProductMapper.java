package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.FavoriteProductRequest;
import ctu.student.regreen.dto.response.FavoriteProductResponse;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.FavoriteProduct;
import ctu.student.regreen.model.FavoriteProductId;
import ctu.student.regreen.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FavoriteProductMapper {

    private final ProductMapper productMapper;

    private final CustomerMapper customerMapper;

    public FavoriteProduct toEntity(FavoriteProductRequest request,
                                    Product product,
                                    Customer customer) {
        FavoriteProduct entity = new FavoriteProduct();

        FavoriteProductId id = new FavoriteProductId();
        id.setProductId(product.getProductId());
        id.setUserId(customer.getUserId());
        entity.setId(id);

        entity.setProduct(product);
        entity.setCustomer(customer);
        return entity;
    }

    public void update(FavoriteProduct favoriteProduct,
                       FavoriteProductRequest request,
                       Product product,
                       Customer customer) {
        favoriteProduct.setProduct(product);
        favoriteProduct.setCustomer(customer);
    }

    public FavoriteProductResponse toResponse(FavoriteProduct entity) {
        return new FavoriteProductResponse(
                entity.getProduct().getProductId(),
                entity.getCustomer().getUserId()
        );
    }
}
