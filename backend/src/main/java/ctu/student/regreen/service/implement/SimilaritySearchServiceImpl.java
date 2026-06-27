package ctu.student.regreen.service.implement;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.pgvector.PGvector;

import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.service.interfaces.SimilaritySearchService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SimilaritySearchServiceImpl implements SimilaritySearchService {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public List<DocumentChunk> search(float[] embedding, int topK) {

        String sql = """
            SELECT id, document_id, chunk_index, content,
                   character_count, token_count,
                   embedding <=> CAST(? AS vector) AS distance
            FROM document_chunks
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> CAST(? AS vector)
            LIMIT ?
            
        """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> map(rs),
                new PGvector(embedding),
                new PGvector(embedding),
                topK
        );
    }

    private DocumentChunk map(ResultSet rs) throws SQLException {
        return DocumentChunk.builder()
                .id(UUID.fromString(rs.getString("id")))
                .content(rs.getString("content"))
                .chunkIndex(rs.getInt("chunk_index"))
                .characterCount(rs.getInt("character_count"))
                .tokenCount(rs.getInt("token_count"))
                .build();
    }
}