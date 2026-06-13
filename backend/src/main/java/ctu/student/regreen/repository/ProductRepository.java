package ctu.student.regreen.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    
}
