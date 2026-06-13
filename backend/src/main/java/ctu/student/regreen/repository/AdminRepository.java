package ctu.student.regreen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {

    Optional<Admin> findByUsername(String username);

    Optional<Admin> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByNumberPhone(String numberPhone);
}