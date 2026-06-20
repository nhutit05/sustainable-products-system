package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.RefundStatusRequest;
import ctu.student.regreen.dto.response.RefundStatusResponse;
import ctu.student.regreen.service.interfaces.RefundStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/refund-statuses")
@RequiredArgsConstructor
public class AdminRefundStatusController {

    private final RefundStatusService service;

    @GetMapping
    public List<RefundStatusResponse> getAll() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public RefundStatusResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PostMapping
    public RefundStatusResponse create(
            @Valid
            @RequestBody
            RefundStatusRequest request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public RefundStatusResponse update(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            RefundStatusRequest request) {

        return service.update(
                id,
                request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id) {

        service.delete(id);
    }
}