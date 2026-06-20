package ctu.student.regreen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.RefundStatus;

public interface RefundStatusRepository
        extends JpaRepository<RefundStatus, Integer> {

    Optional<RefundStatus> findByRefundStatusName(
            String refundStatusName);
}