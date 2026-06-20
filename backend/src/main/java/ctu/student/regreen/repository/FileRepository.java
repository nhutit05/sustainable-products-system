package ctu.student.regreen.repository;

import ctu.student.regreen.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Integer> {

    Optional<File> findByFileName(String fileName);

    List<File> findByUpdateMerchanism(Boolean updateMerchanism);
}
