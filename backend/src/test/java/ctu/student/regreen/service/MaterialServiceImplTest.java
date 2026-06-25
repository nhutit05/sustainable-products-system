package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.MaterialResponse;
import ctu.student.regreen.mapper.MaterialMapper;
import ctu.student.regreen.model.Material;
import ctu.student.regreen.repository.MaterialRepository;
import ctu.student.regreen.service.implement.MaterialServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.test.util.AssertionErrors.assertEquals;
import static org.springframework.test.util.AssertionErrors.assertNotNull;

@ExtendWith(MockitoExtension.class)
public class MaterialServiceImplTest {

    @Mock
    private MaterialRepository repository;

    @InjectMocks
    private MaterialServiceImpl materialService;

    @Mock
    private MaterialMapper mapper;

    private Material material;
    private MaterialResponse response;

    @BeforeEach
    void init() {
        material = new Material();
        response = mock(MaterialResponse.class);

        lenient()
                .when(mapper.toResponse(material))
                .thenReturn(response);

    }

    @Test
    void getAll_success() {
        when(repository.findAll())
                .thenReturn(List.of(material));

        List<MaterialResponse> result = materialService.getAll();

        assertEquals(
                "Expected one material response",
                1,
                result.size());

        verify(repository).findAll();
    }

    @Test
    void getById_success() {
        when(repository.findById(anyInt()))
                .thenReturn(java.util.Optional.of(material));

        MaterialResponse result = materialService.getById(1);

        assertNotNull(
                "Expected a material response",
                result);

        verify(repository).findById(1);
    }

    @Test
    void getById_notFound_fail() {
        when(repository.findById(anyInt()))
                .thenReturn(java.util.Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> materialService.getById(1));

        assertEquals("Expected exception message",
                "Material not found with id: 1",
                ex.getMessage());
    }
}
