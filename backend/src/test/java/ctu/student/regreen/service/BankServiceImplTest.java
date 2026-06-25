package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.BankResponse;
import ctu.student.regreen.mapper.BankMapper;
import ctu.student.regreen.model.Bank;
import ctu.student.regreen.repository.BankRepository;
import ctu.student.regreen.service.implement.BankServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.util.AssertionErrors.assertEquals;

@ExtendWith(MockitoExtension.class)
public class BankServiceImplTest {

    @Mock
    private BankRepository repository;

    @InjectMocks
    private BankServiceImpl service;

    @Mock
    private BankMapper mapper;

    private Bank bank;
    private BankResponse response;

    @BeforeEach
    void init() {
        bank = new Bank();
        response = mock(BankResponse.class);

        lenient()
                .when(mapper.toResponse(bank))
                .thenReturn(response);
    }

    @Test
    void getAll_success() {
        when(repository.findAll())
                .thenReturn(java.util.List.of(bank));

        List<BankResponse> result = service.getAll();

        assertEquals(
                "Expected one bank response",
                1,
                result.size());

        verify(repository).findAll();
    }

    @Test
    void getById_success() {
        when(repository.findByBankId(any()))
                .thenReturn(java.util.Optional.of(bank));

        BankResponse result = service.getById("someId");

        assertEquals(
                "Expected bank response",
                response,
                result);

        verify(repository).findByBankId("someId");
    }

    @Test
    void getById_notFound_fail() {
        when(repository.findByBankId("someID"))
                .thenReturn(java.util.Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.getById("someID")
        );

        assertEquals(
                "Expected exception message",
                "Bank not found with id: someID",
                exception.getMessage()
        );
    }
}
