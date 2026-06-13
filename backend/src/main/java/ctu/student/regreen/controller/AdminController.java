package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.request.AdminRequest;
import ctu.student.regreen.dto.response.AdminResponse;
import ctu.student.regreen.service.interfaces.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;

    @PostMapping
    public AdminResponse create(
            @Valid @RequestBody AdminRequest request) {

        return service.create(request);
    }

    @GetMapping
    public List<AdminResponse> getAll() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public AdminResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PutMapping("/{id}")
    public AdminResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody AdminRequest request) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id) {

        service.delete(id);
    }
}