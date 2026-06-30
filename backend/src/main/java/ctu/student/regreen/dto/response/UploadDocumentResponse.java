package ctu.student.regreen.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class UploadDocumentResponse {

    private UUID documentId;

    private String fileName;

    private String storagePath;

    private Long size;

    private int characterCount;

    private int wordCount;
}