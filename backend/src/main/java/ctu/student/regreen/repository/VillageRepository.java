package ctu.student.regreen.repository;

import ctu.student.regreen.model.Village;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VillageRepository extends JpaRepository<Village, Integer> {

    Optional<Village> findByVillageName(String villageName);

    List<Village> findByCityCityId(Integer cityId);
}
