package ctu.student.regreen.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;

import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.service.implement.CloudinaryServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CloudinaryServiceImplTest {

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @InjectMocks
    private CloudinaryServiceImpl service;

    private MultipartFile file;

    @BeforeEach
    void setUp() {

        file = new MockMultipartFile(
                "file",
                "image.jpg",
                "image/jpeg",
                "test-image".getBytes());
    }

    @Test
    void uploadImage_success() throws Exception {

        Map<String, Object> result = new HashMap<>();

        result.put(
                "url",
                "https://cloudinary.com/test.jpg");

        when(cloudinary.uploader())
                .thenReturn(uploader);

        when(uploader.upload(
                any(byte[].class),
                any(Map.class)))
                .thenReturn(result);

        Map response = service.uploadImage(file);

        assertNotNull(response);

        assertEquals(
                "https://cloudinary.com/test.jpg",
                response.get("url"));

        verify(uploader)
                .upload(
                        any(byte[].class),
                        any(Map.class));
    }

    @Test
    void uploadImage_fail() throws Exception {

        when(cloudinary.uploader())
                .thenReturn(uploader);

        when(uploader.upload(
                any(byte[].class),
                any(Map.class)))
                .thenThrow(
                        new RuntimeException());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.uploadImage(file));
    }

    @Test
    void uploadImage_errorCode() throws Exception {

        when(cloudinary.uploader())
                .thenReturn(uploader);

        when(uploader.upload(
                any(byte[].class),
                any(Map.class)))
                .thenThrow(
                        new RuntimeException());

        ResourceNotFoundException ex = assertThrows(
                ResourceNotFoundException.class,
                () -> service.uploadImage(file));

        assertEquals(
                ErrorCode.IMAGE_UPLOAD_FAILED,
                ex.getErrorCode());
    }
}