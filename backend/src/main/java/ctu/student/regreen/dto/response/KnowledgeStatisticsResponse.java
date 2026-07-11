package ctu.student.regreen.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class KnowledgeStatisticsResponse {

    private long totalDocuments;

    private long totalChunks;

    private long embeddedDocuments;

    private long failedDocuments;

}