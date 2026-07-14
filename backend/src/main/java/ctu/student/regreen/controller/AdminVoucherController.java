package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.request.VoucherUpdateRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.dto.response.VoucherSummaryResponse;
import ctu.student.regreen.service.interfaces.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/vouchers")
@RequiredArgsConstructor
public class AdminVoucherController {

    private final VoucherService service;

    @GetMapping
    public Page<VoucherSummaryResponse> getAll(
            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "voucherId") String sortBy,

            @RequestParam(defaultValue = "desc") String direction,

            @RequestParam(required = false) String keyword,

            @RequestParam(required = false) Boolean active) {

        Sort.Direction sortDirection =
        Sort.Direction.fromOptionalString(direction)
                .orElse(Sort.Direction.DESC);

Pageable pageable = PageRequest.of(
        page,
        size,
        Sort.by(sortDirection, sortBy));

        return service.getAllForAdmin(
                keyword,
                active,
                pageable);
    }

    @GetMapping("/{id}")
    public VoucherResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PostMapping
    public VoucherResponse create(
            @Valid @RequestBody VoucherRequest request) {

        return service.create(request);
    }

    @PatchMapping("/{id}")
    public VoucherResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody VoucherUpdateRequest request) {

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