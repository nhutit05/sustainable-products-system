package ctu.student.regreen.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CompareSection {
    private String sectionName;
    private List<AttributeRow> attributes;
}
