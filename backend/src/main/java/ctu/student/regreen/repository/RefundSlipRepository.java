package ctu.student.regreen.repository;

import ctu.student.regreen.model.RefundSlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RefundSlipRepository
        extends JpaRepository<RefundSlip, Integer>, JpaSpecificationExecutor<RefundSlip>  {

    Optional<RefundSlip> findByOrderOrderId(
            Integer orderId);

    boolean existsByOrderOrderId(
            Integer orderId);

    List<RefundSlip> findByOrderCustomerUserId(Integer userId);

    @Query("SELECT rs FROM RefundSlip rs " +
           "LEFT JOIN FETCH rs.order " +
           "LEFT JOIN FETCH rs.bank " +
           "LEFT JOIN FETCH rs.refundStatus " +
           "WHERE rs.refundSlipId = :id")
    Optional<RefundSlip> findByIdWithDetails(@Param("id") Integer id);
}