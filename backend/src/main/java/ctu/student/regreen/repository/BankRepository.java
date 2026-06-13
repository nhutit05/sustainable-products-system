package ctu.student.regreen.repository;

import ctu.student.regreen.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BankRepository extends JpaRepository<Bank, String> {

    Optional<Bank> findByBankId(String bankId);
}
