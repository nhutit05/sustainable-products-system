package ctu.student.regreen.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import ctu.student.regreen.model.Product;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> withFetchJoins() {

        return (root, query, cb) -> {

            Class<?> resultType = query.getResultType();
            if (resultType != null
                    && (Long.class.equals(resultType)
                            || long.class.equals(resultType))) {
                return cb.conjunction();
            }

            root.fetch("category", JoinType.LEFT);

            return cb.conjunction();
        };
    }

    public static Specification<Product> filter(
            String keyword,
            List<Integer> categoryIds,
            Boolean statusSale) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // isDeleted = false
            predicates.add(
                    cb.or(
                            cb.equal(root.get("isDeleted"), false),
                            cb.isNull(root.get("isDeleted"))));

            // keyword search (product name)
            if (keyword != null && !keyword.isBlank()) {

                String value = "%" + keyword.toLowerCase() + "%";

                predicates.add(
                        cb.like(
                                cb.lower(root.get("productName")),
                                value));
            }

            // category filter (supports parent/child hierarchy)
            if (categoryIds != null && !categoryIds.isEmpty()) {

                predicates.add(
                        root.get("category").get("categoryId").in(categoryIds));
            }

            // statusSale filter
            if (statusSale != null) {

                predicates.add(
                        cb.equal(
                                root.get("statusSale"),
                                statusSale));
            }

            return cb.and(
                    predicates.toArray(new Predicate[0]));
        };
    }
}
