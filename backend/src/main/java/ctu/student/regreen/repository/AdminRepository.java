package ctu.student.regreen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import ctu.student.regreen.model.Admin;
import java.util.List;

public interface AdminRepository extends JpaRepository<Admin, Integer> {

    Optional<Admin> findByUsername(String username);
    Optional<Admin> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByNumberPhone(String numberPhone);

    @Query("SELECT a.userId FROM Admin a")
    List<Integer> findAllIds();
}
