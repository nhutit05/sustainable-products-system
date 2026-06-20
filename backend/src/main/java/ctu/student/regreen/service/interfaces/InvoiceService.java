package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.InvoiceResponse;

public interface InvoiceService {

    InvoiceResponse getById(
            Integer invoiceId);

    InvoiceResponse getByOrder(
            Integer orderId);

    List<InvoiceResponse> getMyInvoices();
}