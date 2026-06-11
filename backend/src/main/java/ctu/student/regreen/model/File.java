package ctu.student.regreen.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @Column(name = "file_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer fileId;

    @NotBlank(message = "Tiêu đề file không được để trống")
    @Column(nullable = false, name = "file_title")
    private String fileTitle;

    @NotBlank(message = "Tên file không được để trống")
    @Column(nullable = false, name = "file_name")
    private String fileName;

    @NotBlank(message = "URL file không được để trống")
    @Column(nullable = false, name = "file_url")
    private String fileUrl;

    @NotBlank(message = "Định dạng file không được để trống")
    @Column(nullable = false, name = "file_format")
    private String fileFormat;

    @NotNull
    @Column(name = "update_mechanism", nullable = false)
    private Boolean updateMerchanism;
}
