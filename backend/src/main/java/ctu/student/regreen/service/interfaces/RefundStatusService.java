package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.RefundStatusRequest;
import ctu.student.regreen.dto.response.RefundStatusResponse;

import java.util.List;

public interface RefundStatusService {

    List<RefundStatusResponse> getAll();

    RefundStatusResponse getById(
            Integer id);

    RefundStatusResponse create(
            RefundStatusRequest request);

    RefundStatusResponse update(
            Integer id,
            RefundStatusRequest request);

    void delete(
            Integer id);
}