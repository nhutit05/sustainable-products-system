package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.InvoiceRequest;
import ctu.student.regreen.dto.response.InvoiceResponse;

public interface InvoiceService {

    InvoiceResponse create(InvoiceRequest request);

    List<InvoiceResponse> getAll();

    InvoiceResponse getById(Integer id);

    InvoiceResponse getByOrder(Integer orderId);
}