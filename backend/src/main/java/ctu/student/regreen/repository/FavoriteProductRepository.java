package ctu.student.regreen.repository;

import ctu.student.regreen.model.FavoriteProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, Integer> {


    List<FavoriteProduct> findAllByCustomerUserId(Integer userId);

    List<FavoriteProduct> findAllByProductProductId(Integer productId);

    FavoriteProduct findByCustomerUserIdAndProductProductId(Integer userId, Integer productId);

    Optional<FavoriteProduct> deleteByCustomerUserIdAndProductProductId(Integer userId, Integer productId);
}
