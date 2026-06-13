package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.BankRequest;
import ctu.student.regreen.dto.response.BankResponse;
import ctu.student.regreen.model.Bank;
import org.springframework.stereotype.Component;

@Component
public class BankMapper {

    public static Bank toEntity(BankRequest request) {
        return new Bank(
                request.getBankId(),
                request.getBankShortName(),
                request.getBankName()
        );
    }

    public static BankResponse toResponse(Bank bank) {
        return new BankResponse(
                bank.getBankId(),
                bank.getBankShortName(),
                bank.getBankName()
        );
    }

    public static void update(Bank bank, BankRequest request) {
        bank.setBankId(request.getBankId());
        bank.setBankName(request.getBankName());
    }
}
