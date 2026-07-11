package ctu.student.regreen.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.enums.DocumentStatus;
import ctu.student.regreen.model.Document;

public interface DocumentRepository
                extends JpaRepository<Document, UUID> {
        List<Document> findAllByOrderByUploadedAtDesc();

        long countByStatus(DocumentStatus status);
}