package ctu.student.regreen.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.enums.DocumentStatus;
import ctu.student.regreen.model.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentRepository
                extends JpaRepository<Document, UUID> {
        // List<Document> findAllByOrderByUploadedAtDesc();
        Page<Document> findAllByOrderByUploadedAtDesc(
        Pageable pageable
);

        long countByStatus(DocumentStatus status);

       @Query("""
SELECT d
FROM Document d
WHERE
    (
        :keyword = ''
        OR LOWER(d.originalFileName)
           LIKE CONCAT('%', LOWER(:keyword), '%')
    )
AND
    (
        :status IS NULL
        OR d.status = :status
    )
""")
Page<Document> searchDocuments(
        @Param("keyword") String keyword,
        @Param("status") DocumentStatus status,
        Pageable pageable
);
}