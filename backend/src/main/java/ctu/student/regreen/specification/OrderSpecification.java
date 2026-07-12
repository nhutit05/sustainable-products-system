package ctu.student.regreen.specification;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import ctu.student.regreen.model.Order;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public final class OrderSpecification {

    private OrderSpecification() {
    }

    public static Specification<Order> filter(
            String keyword,
            Integer orderStatusId,
            Integer paymentStatusId,
            Integer paymentMethodId,
        LocalDate startDate,
    LocalDate endDate) {

        return Specification
                .where(hasKeyword(keyword))
                .and(hasOrderStatus(orderStatusId))
                .and(hasPaymentStatus(paymentStatusId))
                .and(hasPaymentMethod(paymentMethodId))
                 .and(hasStartDate(startDate))
            .and(hasEndDate(endDate));

                
    }

 private static Specification<Order> hasKeyword(String keyword) {

    return (root, query, cb) -> {

        if (keyword == null || keyword.isBlank()) {
            return cb.conjunction();
        }

        final String search = keyword.trim();
        final String pattern = "%" + search.toLowerCase() + "%";

        Predicate predicate = cb.like(
                cb.lower(root.get("orderReceiver")),
                pattern);

        if (search.matches("\\d+")) {

            Integer number = Integer.valueOf(search);

            predicate = cb.or(
                    predicate,

                    cb.equal(
                            root.get("orderId"),
                            number),

                    cb.equal(
                            root.get("customer").get("userId"),
                            number));
        }

        return predicate;
    };
}

    private static Specification<Order> hasOrderStatus(
            Integer orderStatusId) {

        return (root, query, cb) -> {

            if (orderStatusId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.join("orderStatus")
                            .get("orderStatusId"),
                    orderStatusId);
        };
    }

    private static Specification<Order> hasPaymentStatus(
            Integer paymentStatusId) {

        return (root, query, cb) -> {

            if (paymentStatusId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.join("paymentStatus")
                            .get("paymentStatusId"),
                    paymentStatusId);
        };
    }

    private static Specification<Order> hasPaymentMethod(
            Integer paymentMethodId) {

        return (root, query, cb) -> {

            if (paymentMethodId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.join("paymentMethod")
                            .get("paymentMethodId"),
                    paymentMethodId);
        };
    }

    private static Specification<Order> hasStartDate(
        LocalDate startDate) {

    return (root, query, cb) -> {

        if (startDate == null) {
            return cb.conjunction();
        }

        return cb.greaterThanOrEqualTo(
                root.get("orderedAt"),
                startDate.atStartOfDay());
    };
}

private static Specification<Order> hasEndDate(
        LocalDate endDate) {

    return (root, query, cb) -> {

        if (endDate == null) {
            return cb.conjunction();
        }

        return cb.lessThanOrEqualTo(
                root.get("orderedAt"),
                endDate.atTime(23, 59, 59, 999_999_999));
    };
}

}