package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.FileResponse;
import ctu.student.regreen.mapper.FileMapper;
import ctu.student.regreen.model.File;
import ctu.student.regreen.repository.FileRepository;
import ctu.student.regreen.service.implement.FileServiceImpl;
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

@ExtendWith(MockitoExtension.class)
public class FileServiceImplTest {

    @InjectMocks
    private FileServiceImpl service;

    @Mock
    private FileRepository repository;

    @Mock
    private FileMapper mapper;

    private File file;
    private FileResponse response;

    @BeforeEach
    void init() {
        file = new File();
        response = mock(FileResponse.class);

        lenient()
                .when(mapper.toResponse(file))
                .thenReturn(response);
    }

    @Test
    void getAll_success() {
        when(repository.findAll())
                .thenReturn(java.util.List.of(file));

        List<FileResponse> result = service.getAllFiles();

        assertEquals(
                "Expected one file response",
                1,
                result.size());

        verify(repository).findAll();
    }

    @Test
    void getAllFilesByMerchanism_success() {
        when(repository.findByUpdateMerchanism(true))
                .thenReturn(java.util.List.of(file));

        List<FileResponse> result = service.getAllFilesByMerchanism(true);

        assertEquals(
                "Expected one file response",
                1,
                result.size());

        verify(repository).findByUpdateMerchanism(true);
    }

    @Test
    void getFileById_success() {
        when(repository.findById(1))
                .thenReturn(java.util.Optional.of(file));

        FileResponse result = service.getFileById(1);

        assertEquals(
                "Expected a file response",
                response,
                result);

        verify(repository).findById(1);

    }

    @Test
    void getFileById_notFound_fail() {
        when(repository.findById(anyInt()))
                .thenReturn(java.util.Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getFileById(1)
        );

        assertEquals(
                "Expected ResourceNotFoundException",
                "ctu.student.regreen.exception.ResourceNotFoundException",
                ex.getClass().getName()
        );;
    }

    @Test
    void getFileByFilename_success() {
        when(repository.findByFileName(anyString()))
                .thenReturn(java.util.Optional.of(file));

        FileResponse result = service.getFileByFilename("test.txt");

        assertEquals(
                "Expected a file response",
                response,
                result);

        verify(repository).findByFileName("test.txt");
    }

    @Test
    void getFileByFilename_notFound_fail() {
        when(repository.findByFileName(anyString()))
                .thenReturn(java.util.Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getFileByFilename("test.txt")
        );

        assertEquals(
                "Expected ResourceNotFoundException",
                "ctu.student.regreen.exception.ResourceNotFoundException",
                ex.getClass().getName()
        );
    }

    @Test
    void getCountFiles_success() {
        when(repository.findAll())
                .thenReturn(java.util.List.of(file));

        Integer result = service.getCountFiles();

        assertEquals(
                "Expected count of files",
                1,
                result);

        verify(repository).findAll();

    }
}
