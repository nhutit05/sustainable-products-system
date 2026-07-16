package ctu.student.regreen.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ctu.student.regreen.model.DocumentChunk;

public interface DocumentChunkRepository
        extends JpaRepository<DocumentChunk, UUID>
        // DocumentChunkRepositoryCustom 
        {

    List<DocumentChunk> findByDocumentIdOrderByChunkIndex(
            UUID documentId
    );

     @Query(value = """
        SELECT *
        FROM document_chunks
        WHERE content ILIKE '%' || :query || '%'
        LIMIT :limit
    """, nativeQuery = true)
    List<DocumentChunk> keywordSearch(
            @Param("query") String query,
            @Param("limit") int limit
    );

    long count();

    int countByDocument_Id(UUID documentId);

    @Query("SELECT dc.document.id, COUNT(dc) FROM DocumentChunk dc WHERE dc.document.id IN :documentIds GROUP BY dc.document.id")
    List<Object[]> countByDocumentIdIn(@Param("documentIds") List<UUID> documentIds);

}