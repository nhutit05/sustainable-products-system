package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.request.InvoiceRequest;
import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.mapper.InvoiceMapper;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.repository.InvoiceRepository;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.service.interfaces.InvoiceService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository repository;
    private final OrderRepository orderRepository;
    private final InvoiceMapper mapper;

    @Override
    public InvoiceResponse create(InvoiceRequest request) {

        Order order = orderRepository.findById(
                request.getOrderId())
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        repository.findByOrderOrderId(order.getOrderId())
                .ifPresent(invoice -> {
                    throw new RuntimeException(
                            "Invoice already exists");
                });

        Invoice invoice = new Invoice();

        invoice.setOrder(order);

        invoice = repository.save(invoice);

        return mapper.toResponse(invoice);
    }

    @Override
    public List<InvoiceResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public InvoiceResponse getById(Integer id) {

        Invoice invoice = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));

        return mapper.toResponse(invoice);
    }

    @Override
    public InvoiceResponse getByOrder(Integer orderId) {

        Invoice invoice = repository.findByOrderOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));

        return mapper.toResponse(invoice);
    }
}