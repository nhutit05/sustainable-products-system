package ctu.student.regreen.controller;

import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @GetMapping
    public List<ProductResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }
}