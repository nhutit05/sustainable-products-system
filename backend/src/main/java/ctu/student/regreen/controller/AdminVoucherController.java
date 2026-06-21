package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.service.interfaces.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/vouchers")
@RequiredArgsConstructor
public class AdminVoucherController {

    private final VoucherService service;

    @GetMapping
    public List<VoucherResponse> getAll() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public VoucherResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PostMapping
    public VoucherResponse create(
            @Valid
            @RequestBody
            VoucherRequest request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public VoucherResponse update(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            VoucherRequest request) {

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