package ctu.student.regreen.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.DocumentContent;

import java.util.Optional;
import java.util.UUID;

public interface DocumentContentRepository
        extends JpaRepository<DocumentContent, UUID> {

    Optional<DocumentContent> findByDocument_Id(UUID documentId);
}