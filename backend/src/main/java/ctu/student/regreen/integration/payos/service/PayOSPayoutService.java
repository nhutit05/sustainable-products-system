package ctu.student.regreen.integration.payos.service;

public interface PayOSPayoutService {

    void transfer(
            Integer refundSlipId,
            String bankBin,
            String accountNumber,
            Long amount,
            String description
    );
}