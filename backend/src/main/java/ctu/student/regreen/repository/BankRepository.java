package ctu.student.regreen.repository;

import ctu.student.regreen.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BankRepository extends JpaRepository<Bank, String> {

    Optional<Bank> findByBankId(String bankId);
}
