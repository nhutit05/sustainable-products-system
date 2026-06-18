package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.BankRequest;
import ctu.student.regreen.dto.response.BankResponse;
import ctu.student.regreen.service.interfaces.BankService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/banks")
@RequiredArgsConstructor
public class AdminBankController {

    private final BankService service;

    @PostMapping
    public BankResponse create(
            @Valid
            @RequestBody
            BankRequest request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public BankResponse update(
            @PathVariable String id,
            @Valid
            @RequestBody
            BankRequest request) {

        return service.update(
                id,
                request);
    }

    @DeleteMapping("/{id}")
    public Boolean delete(
            @PathVariable String id) {

        return service.delete(id);
    }
}