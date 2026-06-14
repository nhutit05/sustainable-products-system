package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.RefundSlipRequest;
import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.service.interfaces.RefundSlipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/refund-slips")
@RequiredArgsConstructor
public class RefundSlipController {

    private final RefundSlipService service;

    @PostMapping
    public RefundSlipResponse create(
            @Valid
            @RequestBody
            RefundSlipRequest request) {

        return service.create(request);
    }

    @GetMapping("/{id}")
    public RefundSlipResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @GetMapping("/order/{orderId}")
    public RefundSlipResponse getByOrder(
            @PathVariable Integer orderId) {

        return service.getByOrder(orderId);
    }

    @GetMapping
    public List<RefundSlipResponse> getAll() {

        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id) {

        service.delete(id);
    }
}