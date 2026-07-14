package ctu.student.regreen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ctu.student.regreen.model.Voucher;
import java.util.List;


public interface VoucherRepository extends JpaRepository<Voucher, Integer>, JpaSpecificationExecutor<Voucher> {

    Optional<Voucher> findByCode(String code);
    List<Voucher> findAllByIsActiveTrue();

    Optional<Voucher> findByVoucherIdAndIsActiveTrue(Integer id);
    boolean existsByCode(String code);
}
