package ctu.student.regreen.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AttributeRow {

    private String key;
    private String label;

    private Map<String, String> values;
    private String highlightedValue;
}
