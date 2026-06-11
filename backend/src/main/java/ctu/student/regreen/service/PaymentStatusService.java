package ctu.student.regreen.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.repository.PaymentStatusRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentStatusService {
    
    private final PaymentStatusRepository repository;

    @Transactional
    public PaymentStatus addPaymentStatus(PaymentStatus paymentStatus) {
        return repository.save(paymentStatus);
    }

    public List<PaymentStatus> getAllPaymentStatuses() {
        return repository.findAll();
    }

    public Optional<PaymentStatus> getPaymentStatusById(Integer id) {
        return repository.findById(id);
    }

    public PaymentStatus updatePaymentStatus(Integer id, PaymentStatus newData) {
        return repository.findById(id)
        .map(existingStatus -> {
            existingStatus.setPaymentStatusName(newData.getPaymentStatusName());
            return repository.save(existingStatus);
        })
        .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi phù hợp với id" + id));
    }

    @Transactional
    public void deleteAllPaymentStatuses() {
        repository.deleteAll();
    }

    @Transactional
    public boolean deletePaymentStatusById(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
