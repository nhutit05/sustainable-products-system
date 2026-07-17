package ctu.student.regreen.repository;

import ctu.student.regreen.model.Village;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VillageRepository extends JpaRepository<Village, Integer> {

    Optional<Village> findByVillageName(String villageName);

    List<Village> findByCityCityId(Integer cityId);

    @Query("""
        SELECT v FROM Village v
        WHERE (:cityId IS NULL OR v.city.cityId = :cityId)
        AND (:keyword IS NULL OR TRIM(:keyword) = ''
             OR LOWER(v.villageName) LIKE LOWER(CONCAT('%', TRIM(:keyword), '%')))
    """)
    Page<Village> searchVillages(@Param("cityId") Integer cityId,
                                  @Param("keyword") String keyword,
                                  Pageable pageable);
}
