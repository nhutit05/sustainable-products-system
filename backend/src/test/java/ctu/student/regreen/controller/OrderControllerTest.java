package ctu.student.regreen.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import ctu.student.regreen.config.JwtAuthenticationFilter;
import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.service.implement.JwtService;
import ctu.student.regreen.service.interfaces.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
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
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtService jwtService;

    // ================= CHECKOUT =================

    @Test
    @DisplayName("POST /checkout - success")
    void checkout_success() throws Exception {

        OrderRequest request = new OrderRequest();

        OrderResponse response = new OrderResponse();

        when(orderService.checkout(any(OrderRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/orders/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(orderService).checkout(any(OrderRequest.class));
    }

    // ================= GET BY ID =================

    @Test
    @DisplayName("GET /{id} - success")
    void get_by_id_success() throws Exception {

        when(orderService.getById(1))
                .thenReturn(new OrderResponse());

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk());

        verify(orderService).getById(1);
    }

    // ================= GET MY ORDERS =================

    @Test
    @DisplayName("GET /orders - success")
    void get_my_orders_success() throws Exception {

        when(orderService.getMyOrders())
                .thenReturn(List.of(new OrderResponse()));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk());

        verify(orderService).getMyOrders();
    }

    // ================= CANCEL =================

    @Test
    @DisplayName("PUT /{id}/cancel - success")
    void cancel_success() throws Exception {

        when(orderService.cancel(1))
                .thenReturn(new OrderResponse());

        mockMvc.perform(put("/api/orders/1/cancel"))
                .andExpect(status().isOk());

        verify(orderService).cancel(1);
    }

    // ================= PAY =================

    @Test
    @DisplayName("PATCH /{id}/pay - success")
    void pay_success() throws Exception {

        when(orderService.pay(1))
                .thenReturn(new OrderResponse());

        mockMvc.perform(patch("/api/orders/1/pay"))
                .andExpect(status().isOk());

        verify(orderService).pay(1);
    }
}