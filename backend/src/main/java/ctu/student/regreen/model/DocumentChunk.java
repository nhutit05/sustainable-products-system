package ctu.student.regreen.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.Array;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_chunks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentChunk {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "document_id", nullable = false)
        private Document document;

        @Column(nullable = false)
        private Integer chunkIndex;

        @Column(columnDefinition = "TEXT", nullable = false)
        private String content;

        @Column(nullable = false)
        private Integer characterCount;

        @Column(nullable = false)
        private Integer tokenCount;

        @Column(nullable = false)
        private LocalDateTime createdAt;

        @JdbcTypeCode(SqlTypes.VECTOR)
        @Array(length = 3072)

        @Column(columnDefinition = "vector(3072)")
        private float[] embedding;
}

