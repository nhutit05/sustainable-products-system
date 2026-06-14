package ctu.student.regreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.OrderItem;
import ctu.student.regreen.model.OrderItemId;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemId> {

    List<OrderItem> findByOrderOrderId(Integer orderId);
}