package ctu.student.regreen.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    Page<Notification> findByUserUserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);

    long countByUserUserIdAndIsReadFalse(Integer userId);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.userId = :userId AND n.isRead = false")
    int markAllAsReadByUserId(Integer userId);

    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO notifications (user_id, title, message, type, reference_id, reference_type, is_read, created_at)
        VALUES (:userId, :title, :message, :type, :refId, :refType, false, NOW())
        """, nativeQuery = true)
    void insertSingle(Integer userId, String title, String message,
                      String type, Integer refId, String refType);
}
