package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.response.VoucherResponse;

public interface VoucherService {

    VoucherResponse create(VoucherRequest request);

    List<VoucherResponse> getAll();

    VoucherResponse getById(Integer id);

    VoucherResponse update(Integer id, VoucherRequest request);

    void delete(Integer id);
}