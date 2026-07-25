package ctu.student.regreen.repository;

import ctu.student.regreen.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    Optional<Customer> findByUsername(String username);
    Optional<Customer> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByNumberPhone(String numberPhone);

    @Query("SELECT c.userId FROM Customer c")
    List<Integer> findAllIds();
}
