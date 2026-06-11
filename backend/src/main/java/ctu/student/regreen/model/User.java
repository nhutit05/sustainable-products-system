package ctu.student.regreen.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@Getter
@Setter
@ToString(exclude = { "addresses", "password" })
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, unique = true, name = "username")
    @NotBlank(message = "Username không được trống.")
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username chỉ chứa chữ, số và dấu _")
    private String username;

    @Column(nullable = false, unique = true, name = "email")
    @Email
    @Size(max = 100)
    @NotBlank(message = "Email không được trống")
    private String email;

    @Column(nullable = false, unique = true, name = "number_phone")
    @NotBlank(message = "Số điện thoại không được bỏ trống.")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain exactly 10 digits")
    private String numberPhone;

    @Column(nullable = false, name = "password")
    @NotBlank(message = "Password không được để trống.")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,255}$", message = "Password phải chứa chữ hoa, chữ thường và số")
    private String password;

    @Column(name = "national_id")
    @Pattern(regexp = "^$|^[0-9]{12}$", message = "CCCD phải gồm 12 chữ số")
    private String nationalId;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();
}
