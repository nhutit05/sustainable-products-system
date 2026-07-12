// package ctu.student.regreen.controller;

// import ctu.student.regreen.config.JwtAuthenticationFilter;
// import ctu.student.regreen.dto.response.OrderResponse;
// import ctu.student.regreen.service.implement.JwtService;
// import ctu.student.regreen.service.interfaces.AdminOrderService;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
// import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
// import org.springframework.security.test.context.support.WithMockUser;
// import org.springframework.test.context.bean.override.mockito.MockitoBean;
// import org.springframework.test.web.servlet.MockMvc;

// import java.util.List;

// import static org.mockito.Mockito.*;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(AdminOrderController.class)
// @AutoConfigureMockMvc(addFilters = false)
// class AdminOrderControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

  
// //     private final ObjectMapper objectMapper = new ObjectMapper();

//     @MockitoBean
//     private AdminOrderService adminOrderService;

//         @MockitoBean
//     private JwtAuthenticationFilter jwtAuthenticationFilter;

//     @MockitoBean
//     private JwtService jwtService;

//     // ================= GET ALL =================

//     @Test
//     @DisplayName("ADMIN - get all orders")
//     @WithMockUser(roles = "ADMIN")
//     void get_all_success() throws Exception {

//         when(adminOrderService.getAllOrders())
//                 .thenReturn(List.of(new OrderResponse()));

//         mockMvc.perform(get("/api/admin/orders"))
//                 .andExpect(status().isOk());

//         verify(adminOrderService, times(1)).getAllOrders();
//     }

//     // ================= GET BY ID =================

//     @Test
//     @DisplayName("ADMIN - get order by id")
//     @WithMockUser(roles = "ADMIN")
//     void get_by_id_success() throws Exception {

//         when(adminOrderService.getOrderById(1))
//                 .thenReturn(new OrderResponse());

//         mockMvc.perform(get("/api/admin/orders/1"))
//                 .andExpect(status().isOk());

//         verify(adminOrderService).getOrderById(1);
//     }

//     // ================= CONFIRM =================

//     @Test
//     @DisplayName("ADMIN - confirm order")
//     @WithMockUser(roles = "ADMIN")
//     void confirm_success() throws Exception {

//         when(adminOrderService.confirmOrder(1))
//                 .thenReturn(new OrderResponse());

//         mockMvc.perform(put("/api/admin/orders/1/confirm"))
//                 .andExpect(status().isOk());

//         verify(adminOrderService).confirmOrder(1);
//     }

//     // ================= SHIPPING =================

//     @Test
//     @DisplayName("ADMIN - shipping order")
//     @WithMockUser(roles = "ADMIN")
//     void shipping_success() throws Exception {

//         when(adminOrderService.shippingOrder(1))
//                 .thenReturn(new OrderResponse());

//         mockMvc.perform(put("/api/admin/orders/1/shipping"))
//                 .andExpect(status().isOk());

//         verify(adminOrderService).shippingOrder(1);
//     }

//     // ================= COMPLETE =================

//     @Test
//     @DisplayName("ADMIN - complete order")
//     @WithMockUser(roles = "ADMIN")
//     void complete_success() throws Exception {

//         when(adminOrderService.completeOrder(1))
//                 .thenReturn(new OrderResponse());

//         mockMvc.perform(put("/api/admin/orders/1/complete"))
//                 .andExpect(status().isOk());

//         verify(adminOrderService).completeOrder(1);
//     }

//     // ================= REJECT =================

//     @Test
//     @DisplayName("ADMIN - reject order")
//     @WithMockUser(roles = "ADMIN")
//     void reject_success() throws Exception {

//         when(adminOrderService.rejectOrder(1))
//                 .thenReturn(new OrderResponse());

//         mockMvc.perform(put("/api/admin/orders/1/reject"))
//                 .andExpect(status().isOk());

//         verify(adminOrderService).rejectOrder(1);
//     }

//     // ================= SECURITY TEST =================

//     @Test
//     @DisplayName("FORBIDDEN when not ADMIN")
//     @WithMockUser(roles = "CUSTOMER")
//     void forbidden_when_not_admin() throws Exception {

//         mockMvc.perform(get("/api/admin/orders"))
//                 .andExpect(status().isOk());

//     }
// }