package ctu.student.regreen.controller;

import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.service.interfaces.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

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
}