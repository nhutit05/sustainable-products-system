package ctu.student.regreen.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import ctu.student.regreen.config.JwtAuthenticationFilter;
import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.CheckoutResponse;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.service.implement.JwtService;
import ctu.student.regreen.service.interfaces.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private OrderService orderService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private UserDetailsService userDetailsService;

    // ================= CHECKOUT =================

    @Test
    @DisplayName("POST /checkout - success")
    void checkout_success() throws Exception {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("Nguyen Van A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        CheckoutResponse response = CheckoutResponse.builder()
                .order(new OrderResponse())
                .checkoutUrl("https://checkout.payos.vn")
                .qrCode("QR_CODE")
                .build();

        when(orderService.checkout(any(OrderRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/orders/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checkoutUrl")
                        .value("https://checkout.payos.vn"))
                .andExpect(jsonPath("$.qrCode")
                        .value("QR_CODE"));

        verify(orderService).checkout(any(OrderRequest.class));
    }

    @Test
    @DisplayName("POST /checkout - validation fail")
    void checkout_validation_fail() throws Exception {

        mockMvc.perform(post("/api/orders/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    // ================= GET BY ID =================

    @Test
    @DisplayName("GET /{id} - success")
    void getById_success() throws Exception {

        OrderResponse response = new OrderResponse(
                1, null, "Nguyen Van A", "0123456789",
                null, 1, "testuser", 1, "COD",
                null, null, 1, "PENDING",
                1, "UNPAID", 200f, List.of());

        when(orderService.getById(1)).thenReturn(response);

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.orderReceiver")
                        .value("Nguyen Van A"))
                .andExpect(jsonPath("$.orderStatusName")
                        .value("PENDING"));

        verify(orderService).getById(1);
    }

    // ================= GET MY ORDERS =================

    @Test
    @DisplayName("GET / - success")
    void getMyOrders_success() throws Exception {

        OrderResponse response = new OrderResponse(
                1, null, "Nguyen Van A", "0123456789",
                null, 1, "testuser", 1, "COD",
                null, null, 1, "PENDING",
                1, "UNPAID", 200f, List.of());

        when(orderService.getMyOrders())
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].orderId").value(1))
                .andExpect(jsonPath("$[0].orderReceiver")
                        .value("Nguyen Van A"));

        verify(orderService).getMyOrders();
    }

    // ================= CANCEL =================

    @Test
    @DisplayName("PUT /{id}/cancel - success")
    void cancel_success() throws Exception {

        OrderResponse response = new OrderResponse(
                1, null, null, null,
                null, null, null, null, null,
                null, null, 1, "CANCELLED",
                null, null, null, List.of());

        when(orderService.cancel(1)).thenReturn(response);

        mockMvc.perform(put("/api/orders/1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderStatusName")
                        .value("CANCELLED"));

        verify(orderService).cancel(1);
    }

    // ================= PAY =================

    @Test
    @DisplayName("PATCH /{id}/pay - success")
    void pay_success() throws Exception {

        OrderResponse response = new OrderResponse(
                1, null, null, null,
                null, null, null, null, null,
                null, null, 1, "PENDING",
                1, "PAID", null, List.of());

        when(orderService.pay(1)).thenReturn(response);

        mockMvc.perform(patch("/api/orders/1/pay"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentStatusName")
                        .value("PAID"));

        verify(orderService).pay(1);
    }

    // ================= REPAY =================

    @Test
    @DisplayName("POST /{orderId}/repay - success")
    void repay_success() throws Exception {

        CheckoutResponse response = CheckoutResponse.builder()
                .order(new OrderResponse())
                .checkoutUrl("https://checkout.payos.vn/repay")
                .qrCode("QR_REPAY")
                .build();

        when(orderService.repay(1)).thenReturn(response);

        mockMvc.perform(post("/api/orders/1/repay"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checkoutUrl")
                        .value("https://checkout.payos.vn/repay"))
                .andExpect(jsonPath("$.qrCode")
                        .value("QR_REPAY"));

        verify(orderService).repay(1);
    }
}
