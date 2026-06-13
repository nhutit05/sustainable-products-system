package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.response.CartResponse;

public interface CartService {

    CartResponse getByCustomerId(Integer customerId);

}