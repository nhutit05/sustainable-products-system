package ctu.student.regreen.repository;

import ctu.student.regreen.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Integer> {

    List<Address> findAllByCustomerUserId(Integer userId);

    List<Address> findAllByVillageVillageId(Integer villageId);
}
