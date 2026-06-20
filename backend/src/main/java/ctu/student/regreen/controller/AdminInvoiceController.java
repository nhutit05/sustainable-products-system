package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.service.interfaces.AdminInvoiceService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/invoices")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminInvoiceController {

    private final AdminInvoiceService service;

    @GetMapping
    public List<InvoiceResponse>
    getAllInvoices() {

        return service.getAllInvoices();
    }

    @GetMapping("/{invoiceId}")
    public InvoiceResponse getInvoiceById(
            @PathVariable Integer invoiceId) {

        return service.getInvoiceById(
                invoiceId);
    }
}