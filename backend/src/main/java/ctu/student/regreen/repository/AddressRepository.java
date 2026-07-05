package ctu.student.regreen.repository;

import ctu.student.regreen.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Integer> {

    List<Address> findByCustomerUserId(Integer userId);

    Optional<Address> findByIsDefaultAndCustomerUserId(Boolean isDefault, Integer userId);
}
