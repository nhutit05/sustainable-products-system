package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileResponse {
    private Integer fileId;
    private String fileTitle;
    private String fileName;
    private String fileUrl;
    private String fileFormat;
    private Boolean updateMerchanism;
}
