import axios from "axios"
import type {
  CityAdminResponse,
  VillageAdminResponse,
  PageResponse,
  CustomerAdminResponse,
  BankAdminResponse,
  CategoryAdminResponse,
  MaterialAdminResponse,
  OrderStatusAdminResponse,
  PaymentStatusAdminResponse,
  PaymentMethodAdminResponse,
} from "../model/admin-category.model"
import type { ReviewResponse } from "../model/review.model"

const API_URL = "http://localhost:8080/api"

// ─── Cities ────────────────────────────────────────────────

export async function getCitiesPaginated(
  token: string,
  page: number,
  size: number,
  keyword?: string
): Promise<PageResponse<CityAdminResponse>> {
  const response = await axios.get<PageResponse<CityAdminResponse>>(
    `${API_URL}/cities/paginated`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size, keyword: keyword || undefined },
    }
  )
  return response.data
}

export async function createCity(
  token: string,
  data: { cityId: number; cityName: string; cityLevel: string }
): Promise<CityAdminResponse> {
  const response = await axios.post<CityAdminResponse>(`${API_URL}/cities`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updateCity(
  token: string,
  id: number,
  data: { cityId: number; cityName: string; cityLevel: string }
): Promise<CityAdminResponse> {
  const response = await axios.put<CityAdminResponse>(`${API_URL}/cities/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteCity(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/cities/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Villages ──────────────────────────────────────────────

export async function getVillagesPaginated(
  token: string,
  page: number,
  size: number,
  cityId?: number,
  keyword?: string
): Promise<PageResponse<VillageAdminResponse>> {
  const response = await axios.get<PageResponse<VillageAdminResponse>>(
    `${API_URL}/villages/paginated`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size, cityId: cityId || undefined, keyword: keyword || undefined },
    }
  )
  return response.data
}

export async function getAllCities(token: string): Promise<CityAdminResponse[]> {
  const response = await axios.get<CityAdminResponse[]>(`${API_URL}/cities`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createVillage(
  token: string,
  data: { villageId: number; villageName: string; villageLevel: string; cityRequest: { cityId: number; cityName: string; cityLevel: string } }
): Promise<VillageAdminResponse> {
  const response = await axios.post<VillageAdminResponse>(`${API_URL}/villages`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updateVillage(
  token: string,
  id: number,
  data: { villageId: number; villageName: string; villageLevel: string; cityRequest: { cityId: number; cityName: string; cityLevel: string } }
): Promise<VillageAdminResponse> {
  const response = await axios.put<VillageAdminResponse>(`${API_URL}/villages/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteVillage(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/villages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Customers ─────────────────────────────────────────────

export async function getAllCustomers(token: string): Promise<CustomerAdminResponse[]> {
  const response = await axios.get<CustomerAdminResponse[]>(`${API_URL}/customers`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createCustomer(
  token: string,
  data: { username: string; email: string; numberPhone: string; password: string; nationalId?: string; accumulatedEcoPoints: number }
): Promise<CustomerAdminResponse> {
  const response = await axios.post<CustomerAdminResponse>(`${API_URL}/customers`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updateCustomer(
  token: string,
  id: number,
  data: { username: string; email: string; numberPhone: string; password: string; nationalId?: string; accumulatedEcoPoints: number }
): Promise<CustomerAdminResponse> {
  const response = await axios.put<CustomerAdminResponse>(`${API_URL}/customers/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteCustomer(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Banks ─────────────────────────────────────────────────

export async function getAllBanks(token: string): Promise<BankAdminResponse[]> {
  const response = await axios.get<BankAdminResponse[]>(`${API_URL}/banks`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createBank(
  token: string,
  data: { bankId: string; bankShortName: string; bankName: string }
): Promise<BankAdminResponse> {
  const response = await axios.post<BankAdminResponse>(`${API_URL}/admin/banks`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updateBank(
  token: string,
  id: string,
  data: { bankId: string; bankShortName: string; bankName: string }
): Promise<BankAdminResponse> {
  const response = await axios.put<BankAdminResponse>(`${API_URL}/admin/banks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteBank(token: string, id: string): Promise<void> {
  await axios.delete(`${API_URL}/admin/banks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Categories (Product Categories) ───────────────────────

export async function getAllCategories(token: string): Promise<CategoryAdminResponse[]> {
  const response = await axios.get<CategoryAdminResponse[]>(`${API_URL}/admin/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createCategory(
  token: string,
  data: { categoryName: string }
): Promise<CategoryAdminResponse> {
  const response = await axios.post<CategoryAdminResponse>(`${API_URL}/admin/categories`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updateCategory(
  token: string,
  id: number,
  data: { categoryName: string }
): Promise<CategoryAdminResponse> {
  const response = await axios.put<CategoryAdminResponse>(`${API_URL}/admin/categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteCategory(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/admin/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Materials ─────────────────────────────────────────────

export async function getAllMaterials(token: string): Promise<MaterialAdminResponse[]> {
  const response = await axios.get<MaterialAdminResponse[]>(`${API_URL}/admin/materials`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createMaterial(
  token: string,
  data: { materialName: string; emissionIndex: number }
): Promise<MaterialAdminResponse> {
  const response = await axios.post<MaterialAdminResponse>(`${API_URL}/admin/materials`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updateMaterial(
  token: string,
  id: number,
  data: { materialName: string; emissionIndex: number }
): Promise<MaterialAdminResponse> {
  const response = await axios.put<MaterialAdminResponse>(`${API_URL}/admin/materials/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteMaterial(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/admin/materials/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Order Statuses ────────────────────────────────────────

export async function getAllOrderStatuses(token: string): Promise<OrderStatusAdminResponse[]> {
  const response = await axios.get<OrderStatusAdminResponse[]>(`${API_URL}/admin/order-statuses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createOrderStatus(
  token: string,
  data: { orderStatusName: string }
): Promise<OrderStatusAdminResponse> {
  const response = await axios.post<OrderStatusAdminResponse>(`${API_URL}/admin/order-statuses`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updateOrderStatus(
  token: string,
  id: number,
  data: { orderStatusName: string }
): Promise<OrderStatusAdminResponse> {
  const response = await axios.put<OrderStatusAdminResponse>(`${API_URL}/admin/order-statuses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteOrderStatus(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/admin/order-statuses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Payment Statuses ──────────────────────────────────────

export async function getAllPaymentStatuses(token: string): Promise<PaymentStatusAdminResponse[]> {
  const response = await axios.get<PaymentStatusAdminResponse[]>(`${API_URL}/admin/payment-statuses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createPaymentStatus(
  token: string,
  data: { paymentStatusName: string }
): Promise<PaymentStatusAdminResponse> {
  const response = await axios.post<PaymentStatusAdminResponse>(`${API_URL}/admin/payment-statuses`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updatePaymentStatus(
  token: string,
  id: number,
  data: { paymentStatusName: string }
): Promise<PaymentStatusAdminResponse> {
  const response = await axios.put<PaymentStatusAdminResponse>(`${API_URL}/admin/payment-statuses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deletePaymentStatus(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/admin/payment-statuses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Payment Methods ───────────────────────────────────────

export async function getAllPaymentMethods(token: string): Promise<PaymentMethodAdminResponse[]> {
  const response = await axios.get<PaymentMethodAdminResponse[]>(`${API_URL}/admin/payment-methods`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createPaymentMethod(
  token: string,
  data: { paymentMethodName: string; online: boolean }
): Promise<PaymentMethodAdminResponse> {
  const response = await axios.post<PaymentMethodAdminResponse>(`${API_URL}/admin/payment-methods`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updatePaymentMethod(
  token: string,
  id: number,
  data: { paymentMethodName: string; online: boolean }
): Promise<PaymentMethodAdminResponse> {
  const response = await axios.put<PaymentMethodAdminResponse>(`${API_URL}/admin/payment-methods/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deletePaymentMethod(token: string, id: number): Promise<void> {
  await axios.delete(`${API_URL}/admin/payment-methods/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ─── Reviews ─────────────────────────────────────────────

export async function getReviewsPaginated(
  token: string,
  page: number,
  size: number,
  keyword?: string
): Promise<PageResponse<ReviewResponse>> {
  const response = await axios.get<PageResponse<ReviewResponse>>(
    `${API_URL}/admin/reviews`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size, keyword: keyword || undefined },
    }
  )
  return response.data
}

export async function toggleReviewHidden(token: string, reviewId: number): Promise<ReviewResponse> {
  const response = await axios.patch<ReviewResponse>(`${API_URL}/admin/reviews/${reviewId}/toggle-hidden`, null, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
