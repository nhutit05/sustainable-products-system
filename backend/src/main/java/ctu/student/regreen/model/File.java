package ctu.student.regreen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "files")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Integer fileId;

    @NotBlank(message = "Tiêu đề file không được để trống")
    @Column(name = "file_title", nullable = false)
    private String fileTitle;

    @NotBlank(message = "Tên file không được để trống")
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @NotBlank(message = "URL file không được để trống")
    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @NotBlank(message = "Định dạng file không được để trống")
    @Column(name = "file_format", nullable = false)
    private String fileFormat;

    @Column(name = "update_merchanism")
    private Boolean updateMerchanism;
}
