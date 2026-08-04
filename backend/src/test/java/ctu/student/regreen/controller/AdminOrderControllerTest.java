package ctu.student.regreen.controller;

import ctu.student.regreen.config.JwtAuthenticationFilter;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.dto.response.OrderSummaryResponse;
import ctu.student.regreen.service.implement.JwtService;
import ctu.student.regreen.service.interfaces.AdminOrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminOrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminOrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminOrderService adminOrderService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    private OrderResponse buildOrderResponse(
            Integer orderId, String statusName) {

        return new OrderResponse(
                orderId, LocalDateTime.now(),
                "Nguyen Van A", "0123456789",
                "123 Street", 1, "customer1",
                1, "COD",
                null, null,
                1, statusName,
                1, "UNPAID",
                500f, List.of());
    }

    private OrderSummaryResponse buildSummary(
            Integer orderId, String orderStatus) {

        return new OrderSummaryResponse(
                orderId, LocalDateTime.now(),
                1, "customer1",
                1, "COD",
                1, "UNPAID",
                1, orderStatus,
                500f);
    }

    // ================= GET ORDERS (PAGINATED) =================

    @Test
    @DisplayName("GET /api/admin/orders - success")
    void getOrders_success() throws Exception {

        OrderSummaryResponse summary = buildSummary(1, "PENDING");

        var page = new PageImpl<>(
                List.of(summary),
                PageRequest.of(0, 10),
                1);

        when(adminOrderService.getOrders(
                null, null, null, null, null, null,
                PageRequest.of(0, 10)))
                .thenReturn(page);

        mockMvc.perform(get("/api/admin/orders")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].orderId")
                        .value(1))
                .andExpect(jsonPath("$.content[0].orderStatusName")
                        .value("PENDING"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(adminOrderService).getOrders(
                null, null, null, null, null, null,
                PageRequest.of(0, 10));
    }

    // ================= GET BY ID =================

    @Test
    @DisplayName("GET /api/admin/orders/{id} - success")
    void getById_success() throws Exception {

        OrderResponse response = buildOrderResponse(1, "PENDING");

        when(adminOrderService.getOrderById(1))
                .thenReturn(response);

        mockMvc.perform(get("/api/admin/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.orderReceiver")
                        .value("Nguyen Van A"))
                .andExpect(jsonPath("$.orderStatusName")
                        .value("PENDING"));

        verify(adminOrderService).getOrderById(1);
    }

    // ================= CONFIRM =================

    @Test
    @DisplayName("PUT /api/admin/orders/{id}/confirm - success")
    void confirm_success() throws Exception {

        OrderResponse response = buildOrderResponse(1, "CONFIRMED");

        when(adminOrderService.confirmOrder(1))
                .thenReturn(response);

        mockMvc.perform(put("/api/admin/orders/1/confirm"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.orderStatusName")
                        .value("CONFIRMED"));

        verify(adminOrderService).confirmOrder(1);
    }

    // ================= SHIPPING =================

    @Test
    @DisplayName("PUT /api/admin/orders/{id}/shipping - success")
    void shipping_success() throws Exception {

        OrderResponse response = buildOrderResponse(1, "SHIPPING");

        when(adminOrderService.shippingOrder(1))
                .thenReturn(response);

        mockMvc.perform(put("/api/admin/orders/1/shipping"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.orderStatusName")
                        .value("SHIPPING"));

        verify(adminOrderService).shippingOrder(1);
    }

    // ================= COMPLETE =================

    @Test
    @DisplayName("PUT /api/admin/orders/{id}/complete - success")
    void complete_success() throws Exception {

        OrderResponse response = buildOrderResponse(1, "COMPLETED");

        when(adminOrderService.completeOrder(1))
                .thenReturn(response);

        mockMvc.perform(put("/api/admin/orders/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.orderStatusName")
                        .value("COMPLETED"));

        verify(adminOrderService).completeOrder(1);
    }

    // ================= REJECT =================

    @Test
    @DisplayName("PUT /api/admin/orders/{id}/reject - success")
    void reject_success() throws Exception {

        OrderResponse response = buildOrderResponse(1, "REJECTED");

        when(adminOrderService.rejectOrder(1))
                .thenReturn(response);

        mockMvc.perform(put("/api/admin/orders/1/reject"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.orderStatusName")
                        .value("REJECTED"));

        verify(adminOrderService).rejectOrder(1);
    }
}
