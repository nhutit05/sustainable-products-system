package ctu.student.regreen.integration.payos.service;

import ctu.student.regreen.integration.payos.dto.PayOSCheckoutResult;
import ctu.student.regreen.model.Order;

public interface PayOSService {

    PayOSCheckoutResult createCheckout(
            Order order,
            long payableAmount);

    void refund(Order order);

}