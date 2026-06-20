package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.BankRequest;
import ctu.student.regreen.dto.response.BankResponse;
import ctu.student.regreen.mapper.BankMapper;
import ctu.student.regreen.model.Bank;
import ctu.student.regreen.repository.BankRepository;
import ctu.student.regreen.service.interfaces.BankService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BankServiceImpl implements BankService {

    private final BankRepository repository;

    public List<BankResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(BankMapper::toResponse)
                .toList();
    }

    public BankResponse getById(String id) {
        return repository.findByBankId(id)
                .map(BankMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Bank not found with id: " + id));
    }

    public BankResponse create(BankRequest request) {
        Bank bank = BankMapper.toEntity(request);
        return BankMapper.toResponse(repository.save(bank));
    }

    public BankResponse update(String id, BankRequest request) {
        Bank bank = repository.findByBankId(id)
                .orElseThrow(() -> new RuntimeException("Bank not found with id: " + id));

        BankMapper.update(bank, request);
        return BankMapper.toResponse(repository.save(bank));
    }

    public Boolean delete(String id) {
        Bank bank = repository.findByBankId(id)
                .orElseThrow(() -> new RuntimeException("Bank not found with id: " + id));

        repository.delete(bank);
        return true;
    }

}
