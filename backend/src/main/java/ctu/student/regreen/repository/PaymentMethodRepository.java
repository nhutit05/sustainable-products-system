package ctu.student.regreen.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.PaymentMethod;

public interface PaymentMethodRepository  extends JpaRepository<PaymentMethod, Integer>{

    boolean existsByPaymentMethodName(String paymentMethodName);
    
}
