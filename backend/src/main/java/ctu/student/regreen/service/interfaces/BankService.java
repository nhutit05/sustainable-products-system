package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.BankRequest;
import ctu.student.regreen.dto.response.BankResponse;

import java.util.List;

public interface BankService {

    List<BankResponse> getAll();
    BankResponse getById(String bankId);
    BankResponse create(BankRequest request);
    BankResponse update(String bankId, BankRequest request);
    Boolean delete(String bankId);
}
