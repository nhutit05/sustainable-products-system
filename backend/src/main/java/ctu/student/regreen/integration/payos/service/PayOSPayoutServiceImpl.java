package ctu.student.regreen.integration.payos.service;

import java.util.List;

import org.springframework.stereotype.Service;

// import ctu.student.regreen.integration.payos.exception.PayOSException;
import lombok.RequiredArgsConstructor;
import vn.payos.PayOS;
import vn.payos.exception.PayOSException;
import vn.payos.model.v1.payouts.batch.PayoutBatchItem;
import vn.payos.model.v1.payouts.batch.PayoutBatchRequest;

@Service
@RequiredArgsConstructor
public class PayOSPayoutServiceImpl implements PayOSPayoutService {

    private final PayOS payOS;

    @Override
    public void transfer(
            Integer refundSlipId,
            String bankBin,
            String accountNumber,
            Long amount,
            String description) {

        try {
            String referenceId = "refund_" + refundSlipId;

            PayoutBatchRequest request = PayoutBatchRequest.builder()
                    .referenceId(referenceId)
                    .validateDestination(true)
                    .category(List.of("refund"))
                    .payout(
                            PayoutBatchItem.builder()
                                    .referenceId(referenceId + "_1")
                                    .amount(amount)
                                    .description(description)
                                    .toBin(bankBin)
                                    .toAccountNumber(accountNumber)
                                    .build())
                    .build();

            payOS.payouts().batch().create(request);

        } catch (Exception e) {
            throw new PayOSException(
            "Transfer refund failed: " + e.getMessage(), e);
        }
    }
}