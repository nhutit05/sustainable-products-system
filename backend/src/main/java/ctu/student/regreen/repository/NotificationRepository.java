package ctu.student.regreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Integer userId);

    long countByUserUserIdAndIsReadFalse(Integer userId);

    List<Notification> findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(Integer userId);
}
