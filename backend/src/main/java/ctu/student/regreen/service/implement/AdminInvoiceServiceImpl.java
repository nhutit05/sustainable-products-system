package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.mapper.InvoiceMapper;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.repository.InvoiceRepository;
import ctu.student.regreen.service.interfaces.AdminInvoiceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminInvoiceServiceImpl
        implements AdminInvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final InvoiceMapper invoiceMapper;

    @Override
    public List<InvoiceResponse>
    getAllInvoices() {

        return invoiceRepository.findAll()
                .stream()
                .map(invoiceMapper::toResponse)
                .toList();
    }

    @Override
    public InvoiceResponse getInvoiceById(
            Integer invoiceId) {

        Invoice invoice =
                invoiceRepository.findById(
                                invoiceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"));

        return invoiceMapper.toResponse(
                invoice);
    }
}
