package ctu.student.regreen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.Invoice;

public interface InvoiceRepository
        extends JpaRepository<Invoice, Integer> {

    Optional<Invoice> findByOrderOrderId(Integer orderId);

}