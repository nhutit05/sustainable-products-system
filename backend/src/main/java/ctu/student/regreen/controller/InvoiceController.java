package ctu.student.regreen.controller;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.service.interfaces.InvoiceService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class InvoiceController {

    private final InvoiceService service;

    @GetMapping("/my")
    public List<InvoiceResponse>
    getMyInvoices() {

        return service.getMyInvoices();
    }

    @GetMapping("/{invoiceId}")
    public InvoiceResponse getById(
            @PathVariable Integer invoiceId) {

        return service.getById(
                invoiceId);
    }

    @GetMapping("/order/{orderId}")
    public InvoiceResponse getByOrder(
            @PathVariable Integer orderId) {

        return service.getByOrder(
                orderId);
    }
}