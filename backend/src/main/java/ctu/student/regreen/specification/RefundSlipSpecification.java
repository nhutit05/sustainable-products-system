package ctu.student.regreen.specification;

import ctu.student.regreen.model.RefundSlip;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class RefundSlipSpecification {

    public static Specification<RefundSlip> withFetchJoins() {

        return (root, query, cb) -> {

            Class<?> resultType = query.getResultType();
            if (resultType != null
                    && (Long.class.equals(resultType)
                            || long.class.equals(resultType))) {
                return cb.conjunction();
            }

            root.fetch("order", JoinType.LEFT);
            root.fetch("bank", JoinType.LEFT);
            root.fetch("refundStatus", JoinType.LEFT);

            return cb.conjunction();
        };
    }

    public static Specification<RefundSlip> filter(
            String search,
            String status
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

           if (search != null && !search.isBlank()) {

    String keyword = "%" + search.toLowerCase() + "%";

    Join<Object, Object> order = root.join("order");
    Join<Object, Object> bank = root.join("bank");

    List<Predicate> searchPredicates = new ArrayList<>();

    // Search text
    searchPredicates.add(
            cb.like(
                    cb.lower(root.get("accountBankName")),
                    keyword
            )
    );

    searchPredicates.add(
            cb.like(
                    cb.lower(root.get("bankNumber")),
                    keyword
            )
    );

    searchPredicates.add(
            cb.like(
                    cb.lower(bank.get("bankName")),
                    keyword
            )
    );

    // Search số
    if (search.matches("\\d+")) {

        Integer number = Integer.valueOf(search);

        searchPredicates.add(
                cb.equal(
                        root.get("refundSlipId"),
                        number
                )
        );

        searchPredicates.add(
                cb.equal(
                        order.get("orderId"),
                        number
                )
        );
    }

    predicates.add(
            cb.or(searchPredicates.toArray(new Predicate[0]))
    );
}
            // Status
            if (status != null && !status.isBlank()) {

                Join<Object, Object> refundStatus = root.join("refundStatus");

                predicates.add(
                        cb.equal(
                                refundStatus.get("refundStatusName"),
                                status
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}