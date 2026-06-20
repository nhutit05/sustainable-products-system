package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.mapper.InvoiceMapper;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.InvoiceRepository;
import ctu.student.regreen.service.interfaces.InvoiceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl
        implements InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final CustomerRepository customerRepository;

    private final InvoiceMapper invoiceMapper;

    @Override
    public InvoiceResponse getById(
            Integer invoiceId) {

        Customer customer =
                getCurrentCustomer();

        Invoice invoice =
                invoiceRepository.findById(
                                invoiceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"));

        validateOwnership(
                invoice.getOrder(),
                customer);

        return invoiceMapper.toResponse(
                invoice);
    }

    @Override
    public InvoiceResponse getByOrder(
            Integer orderId) {

        Customer customer =
                getCurrentCustomer();

        Invoice invoice =
                invoiceRepository
                        .findByOrderOrderId(
                                orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"));

        validateOwnership(
                invoice.getOrder(),
                customer);

        return invoiceMapper.toResponse(
                invoice);
    }

    @Override
    public List<InvoiceResponse>
    getMyInvoices() {

        Customer customer =
                getCurrentCustomer();

        return invoiceRepository
                .findByOrderCustomerUserId(
                        customer.getUserId())
                .stream()
                .map(invoiceMapper::toResponse)
                .toList();
    }

    private Customer getCurrentCustomer() {

        String username =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return customerRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));
    }

    private void validateOwnership(
            Order order,
            Customer customer) {

        if (!order.getCustomer()
                .getUserId()
                .equals(
                        customer.getUserId())) {

            throw new RuntimeException(
                    "Access denied");
        }
    }
}