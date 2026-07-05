package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.CityResponse;
import ctu.student.regreen.mapper.CityMapper;
import ctu.student.regreen.model.City;
import ctu.student.regreen.repository.CityRepository;
import ctu.student.regreen.service.implement.CityServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.util.AssertionErrors.assertEquals;
import static org.springframework.test.util.AssertionErrors.assertNotNull;

@ExtendWith(MockitoExtension.class)
public class CityServiceImplTest {

    @InjectMocks
    private CityServiceImpl service;

    @Mock
    private CityMapper mapper;

    @Mock
    private CityRepository repository;

    private City city;
    private CityResponse response;

    @BeforeEach
    void init() {
        city = new City();
        response = mock(CityResponse.class);

        lenient()
                .when(mapper.toResponse(city))
                .thenReturn(response);
    }

    @Test
    void getAll_success() {
        when(repository.findAll())
                .thenReturn(List.of(city));

        List<CityResponse> result = service.getAllCities();

        assertEquals(
                "Expected one city response",
                1,
                result.size());

        verify(repository).findAll();
    }

    @Test
    void getById_success() {
        when(repository.findById(1))
                .thenReturn(java.util.Optional.of(city));

        CityResponse result = service.getCityById(1);

        assertNotNull(
                "Expected non-null city response",
                result);

        verify(repository).findById(1);
    }

    @Test
    void getById_notFound_fail() {
        when(repository.findById(1))
                .thenReturn(java.util.Optional.empty());

        try {
            service.getCityById(1);
        } catch (RuntimeException e) {
            assertEquals(
                    "Expected exception message",
                    "City not found",
                    e.getMessage());
        }

        verify(repository).findById(1);
    }
}
