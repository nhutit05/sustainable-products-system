package ctu.student.regreen.service.interfaces;


import ctu.student.regreen.dto.request.MaterialRequest;
import ctu.student.regreen.dto.response.MaterialResponse;
import ctu.student.regreen.model.Material;

import java.util.List;

public interface MaterialService {

    List<MaterialResponse> getAll();
    MaterialResponse create(MaterialRequest request);
    MaterialResponse getById(Integer id);
    MaterialResponse update(Integer id, MaterialRequest request);
    Boolean delete(Integer id);
}
