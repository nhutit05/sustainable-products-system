package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.request.InvoiceRequest;
import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.service.interfaces.InvoiceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService service;

    @PostMapping
    public InvoiceResponse create(
            @Valid @RequestBody
            InvoiceRequest request) {

        return service.create(request);
    }

    @GetMapping
    public List<InvoiceResponse> getAll() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public InvoiceResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @GetMapping("/order/{orderId}")
    public InvoiceResponse getByOrder(
            @PathVariable Integer orderId) {

        return service.getByOrder(orderId);
    }
}