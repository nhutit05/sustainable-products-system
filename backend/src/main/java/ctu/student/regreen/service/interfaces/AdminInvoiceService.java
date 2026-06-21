package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.InvoiceResponse;

public interface AdminInvoiceService {

    List<InvoiceResponse> getAllInvoices();

    InvoiceResponse getInvoiceById(
            Integer invoiceId);
}