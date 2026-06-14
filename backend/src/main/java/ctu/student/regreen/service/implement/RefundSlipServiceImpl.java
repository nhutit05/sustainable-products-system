package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.RefundSlipRequest;
import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.mapper.RefundSlipMapper;
import ctu.student.regreen.model.Bank;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.repository.BankRepository;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.RefundSlipRepository;
import ctu.student.regreen.service.interfaces.RefundSlipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RefundSlipServiceImpl
        implements RefundSlipService {

    private final RefundSlipRepository repository;

    private final OrderRepository orderRepository;

    private final BankRepository bankRepository;

    private final RefundSlipMapper mapper;

    @Override
    public RefundSlipResponse create(
            RefundSlipRequest request) {

        if (repository.existsByOrderOrderId(
                request.getOrderId())) {

            throw new RuntimeException(
                    "Order already has refund slip");
        }

        Order order =
                orderRepository.findById(
                                request.getOrderId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"));

        Bank bank =
                bankRepository.findById(
                                request.getBankId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bank not found"));

        RefundSlip refundSlip =
                new RefundSlip();

        refundSlip.setBankNumber(
                request.getBankNumber());

        refundSlip.setAccountBankName(
                request.getAccountBankName());

        refundSlip.setReason(
                request.getReason());

        refundSlip.setOrder(order);

        refundSlip.setBank(bank);

        return mapper.toResponse(
                repository.save(refundSlip));
    }

    @Override
    public RefundSlipResponse getById(
            Integer id) {

        return mapper.toResponse(
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Refund slip not found")));
    }

    @Override
    public RefundSlipResponse getByOrder(
            Integer orderId) {

        return mapper.toResponse(
                repository.findByOrderOrderId(
                                orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Refund slip not found")));
    }

    @Override
    public List<RefundSlipResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void delete(
            Integer id) {

        if (!repository.existsById(id)) {

            throw new RuntimeException(
                    "Refund slip not found");
        }

        repository.deleteById(id);
    }
}