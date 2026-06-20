package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService service;

    @PostMapping
    public ProductResponse create(@RequestBody ProductRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ProductResponse update(
            @PathVariable Integer id,
            @RequestBody ProductRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping
    public List<ProductResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }
}