package ctu.student.regreen.service.interfaces;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.request.VoucherUpdateRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.dto.response.VoucherSummaryResponse;

public interface VoucherService {

    VoucherResponse create(VoucherRequest request);

    List<VoucherResponse> getAll();

    VoucherResponse getById(Integer id);

    VoucherResponse update(Integer id, VoucherUpdateRequest request);

    void delete(Integer id);

    Page<VoucherSummaryResponse> getAllForAdmin(
        String keyword,
        Boolean active,
        Pageable pageable);
}