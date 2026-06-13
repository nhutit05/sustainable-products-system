package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.request.AdminRequest;
import ctu.student.regreen.dto.response.AdminResponse;
import ctu.student.regreen.mapper.AdminMapper;
import ctu.student.regreen.model.Admin;
import ctu.student.regreen.repository.AdminRepository;
import ctu.student.regreen.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository repository;
    private final AdminMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminResponse create(AdminRequest request) {

        if (repository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (repository.existsByNumberPhone(request.getNumberPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        Admin admin = mapper.toEntity(request);

        admin.setPassword(
                passwordEncoder.encode(request.getPassword()));

        admin = repository.save(admin);

        return mapper.toResponse(admin);
    }

    @Override
    public List<AdminResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public AdminResponse getById(Integer id) {

        Admin admin = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return mapper.toResponse(admin);
    }

    @Override
    public AdminResponse update(Integer id, AdminRequest request) {

        Admin admin = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        mapper.update(admin, request);
        admin.setPassword(
                passwordEncoder.encode(request.getPassword()));

        admin = repository.save(admin);

        return mapper.toResponse(admin);
    }

    @Override
    public void delete(Integer id) {

        Admin admin = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        repository.delete(admin);
    }
}