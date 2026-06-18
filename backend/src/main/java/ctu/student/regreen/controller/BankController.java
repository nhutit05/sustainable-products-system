package ctu.student.regreen.controller;

import ctu.student.regreen.dto.response.BankResponse;
import ctu.student.regreen.service.interfaces.BankService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banks")
@RequiredArgsConstructor
public class BankController {

    private final BankService service;

    @GetMapping
    public List<BankResponse> getAll() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public BankResponse getById(
            @PathVariable String id) {

        return service.getById(id);
    }
}