package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.request.AdminRequest;
import ctu.student.regreen.dto.response.AdminResponse;
import ctu.student.regreen.model.Admin;

@Component
public class AdminMapper {

    public Admin toEntity(AdminRequest request) {

        Admin admin = new Admin();

        admin.setUsername(request.getUsername());
        admin.setEmail(request.getEmail());
        admin.setNumberPhone(request.getNumberPhone());
        admin.setPassword(request.getPassword());
        admin.setNationalId(request.getNationalId());
        admin.setHireDate(request.getHireDate());

        return admin;
    }

    public AdminResponse toResponse(Admin admin) {

        return new AdminResponse(
                admin.getUserId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getNumberPhone(),
                admin.getNationalId(),
                admin.getHireDate());
    }

    public void update(Admin admin, AdminRequest request) {

        admin.setUsername(request.getUsername());
        admin.setEmail(request.getEmail());
        admin.setNumberPhone(request.getNumberPhone());
        admin.setPassword(request.getPassword());
        admin.setNationalId(request.getNationalId());
        admin.setHireDate(request.getHireDate());
    }
}