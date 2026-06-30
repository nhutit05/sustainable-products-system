package ctu.student.regreen.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UploadFileResponse {

    private String fileName;

    private String storagePath;

    private Long size;

}