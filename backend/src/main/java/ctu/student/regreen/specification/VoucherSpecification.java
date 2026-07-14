package ctu.student.regreen.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import ctu.student.regreen.model.Voucher;
import jakarta.persistence.criteria.Predicate;

public class VoucherSpecification {

    private VoucherSpecification() {
    }

    public static Specification<Voucher> filter(
            String keyword,
            Boolean active) {

        return (root, query, builder) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {

                String value = "%" + keyword.toLowerCase() + "%";

                predicates.add(
                        builder.or(
                                builder.like(
                                        builder.lower(root.get("code")),
                                        value),
                                builder.like(
                                        builder.lower(root.get("description")),
                                        value)));
            }

            if (active != null) {

                predicates.add(
                        builder.equal(
                                root.get("isActive"),
                                active));
            }

            return builder.and(
                    predicates.toArray(new Predicate[0]));
        };
    }

}