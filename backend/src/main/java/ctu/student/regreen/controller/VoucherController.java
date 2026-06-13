package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.service.interfaces.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VoucherController {

    private final VoucherService service;

    @PostMapping
    public VoucherResponse create(
            @Valid @RequestBody VoucherRequest request) {

        return service.create(request);
    }

    @GetMapping
    public List<VoucherResponse> getAll() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public VoucherResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PutMapping("/{id}")
    public VoucherResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody VoucherRequest request) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {

        service.delete(id);
    }
}