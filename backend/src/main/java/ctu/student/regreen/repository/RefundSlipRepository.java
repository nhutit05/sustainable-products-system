package ctu.student.regreen.repository;

import ctu.student.regreen.model.RefundSlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface RefundSlipRepository
        extends JpaRepository<RefundSlip, Integer>, JpaSpecificationExecutor<RefundSlip>  {

    Optional<RefundSlip> findByOrderOrderId(
            Integer orderId);

    boolean existsByOrderOrderId(
            Integer orderId);

    List<RefundSlip> findByOrderCustomerUserId(Integer userId);
}