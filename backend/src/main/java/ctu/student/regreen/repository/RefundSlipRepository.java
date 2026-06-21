package ctu.student.regreen.repository;

import ctu.student.regreen.model.RefundSlip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefundSlipRepository
        extends JpaRepository<RefundSlip, Integer> {

    Optional<RefundSlip> findByOrderOrderId(
            Integer orderId);

    boolean existsByOrderOrderId(
            Integer orderId);

    List<RefundSlip> findByOrderCustomerUserId(Integer userId);
}