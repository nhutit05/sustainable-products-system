package ctu.student.regreen.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private Integer file_id;

    @NotBlank(message = "Tiêu đề file không được để trống")
    @Column(nullable = false)
    private String file_title;

    @NotBlank(message = "Tên file không được để trống")
    @Column(nullable = false)
    private String file_name;

    @NotBlank(message = "URL file không được để trống")
    @Column(nullable = false)
    private String file_url;

    @NotBlank(message = "Định dạng file không được để trống")
    @Column(nullable = false)
    private String file_format;

    private Boolean update_merchanism;
}
