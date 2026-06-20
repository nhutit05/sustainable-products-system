package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FileRequest {

    @NotBlank(message = "Chủ đề file không được trống")
    private String fileTitle;

    @NotBlank(message = "Tên file không được trống")
    private String fileName;

    @NotBlank(message = "URL file không được trống")
    private String fileUrl;

    @NotBlank(message = "Định dạng file không được trống")
    private String fileFormat;

    @NotNull(message = "Cơ chế cập nhật không được trống")
    private Boolean updateMerchanism;
}
