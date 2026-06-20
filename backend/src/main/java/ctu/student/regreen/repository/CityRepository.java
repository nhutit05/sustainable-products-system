package ctu.student.regreen.repository;

import ctu.student.regreen.model.City;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CityRepository extends JpaRepository<City, Integer> {
}
