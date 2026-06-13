package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.MaterialRequest;
import ctu.student.regreen.dto.response.MaterialResponse;
import ctu.student.regreen.model.Material;
import org.springframework.stereotype.Component;

@Component
public class MaterialMapper {

    public static Material toEntity(MaterialRequest request) {
        Material material = new Material();

        material.setMaterialName(request.getMaterialName());
        material.setEmissionIndex(request.getEmissionIndex());

        return material;
    }

    public static MaterialResponse toResponse(Material material) {
        return new MaterialResponse(
                material.getMaterialId(),
                material.getMaterialName(),
                material.getEmissionIndex()
        );
    }

    public static void update(Material material, MaterialRequest request) {
        material.setMaterialName(request.getMaterialName());
        material.setEmissionIndex(request.getEmissionIndex());
    }
}
