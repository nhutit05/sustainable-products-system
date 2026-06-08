package ctu.student.regreen.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class FavoriteProductId  implements Serializable {
    private Integer product_id;
    private Integer user_id;
}
