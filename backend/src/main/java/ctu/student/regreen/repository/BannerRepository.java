package ctu.student.regreen.repository;

import ctu.student.regreen.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Integer> {

    List<Banner> findAllByOrderByDisplayOrderAsc();

    List<Banner> findAllByIsActiveTrueOrderByDisplayOrderAsc();
}
