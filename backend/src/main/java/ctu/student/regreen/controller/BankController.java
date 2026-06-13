package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.BankRequest;
import ctu.student.regreen.dto.response.BankResponse;
import ctu.student.regreen.service.interfaces.BankService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banks")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class BankController {

    private final BankService service;

    // [GET] /api/banks
    @GetMapping
    public List<BankResponse> getAllBanks() {
        return service.getAll();
    }

    // [GET] /api/banks/{bankId}
    @GetMapping("/{bankId}")
    public BankResponse getBankById(@PathVariable String bankId) {
        return service.getById(bankId);
    }

    // [POST] /api/banks
    @PostMapping
    public BankResponse createBank(@RequestBody BankRequest request) {
        return service.create(request);
    }

    // [PUT] /api/banks/{bankId}
    @PutMapping("/{bankId}")
    public BankResponse updateBank(@PathVariable String bankId, @RequestBody BankRequest request) {
        return service.update(bankId, request);
    }

    // [DELETE] /api/banks/{bankId}
    @DeleteMapping("/{bankId}")
    public Boolean deleteBank(@PathVariable String bankId) {
        return service.delete(bankId);
    }
}
