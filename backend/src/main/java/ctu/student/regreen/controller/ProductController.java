package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.service.interfaces.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping
    public ProductResponse create(
            @Valid @RequestBody ProductRequest request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public ProductResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody ProductRequest request) {

        return service.update(id, request);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @GetMapping
    public List<ProductResponse> getAll() {

        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id) {

        service.delete(id);
    }
}