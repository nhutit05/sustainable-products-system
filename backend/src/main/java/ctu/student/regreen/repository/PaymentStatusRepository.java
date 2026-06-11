package ctu.student.regreen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import ctu.student.regreen.model.PaymentStatus;


public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Integer>{
    Optional<PaymentStatus> findByPaymentStatusName(String name);
    boolean existsByPaymentStatusName(String name);
}