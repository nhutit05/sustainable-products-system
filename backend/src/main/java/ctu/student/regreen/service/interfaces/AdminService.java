package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.AdminRequest;
import ctu.student.regreen.dto.response.AdminResponse;

public interface AdminService {

    AdminResponse create(AdminRequest request);

    List<AdminResponse> getAll();

    AdminResponse getById(Integer id);

    AdminResponse update(Integer id, AdminRequest request);

    void delete(Integer id);
}