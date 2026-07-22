import axios from 'axios'
import type {
  RevenueByCategory,
  RevenueByPeriod,
  TopProduct,
  OrderStatusDistribution,
  ReviewStats,
  RefundStats,
  VoucherStat,
  CarbonIndexStats,
  TopCustomer,
  InventoryOverview,
  NewCustomerStats,
  ReportType,
  ExportFormat,
} from '../model/statistics.model'

const API_URL = 'http://localhost:8080/api/admin/statistics'

export async function getRevenueByCategory(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<RevenueByCategory[]> {
  const response = await axios.get<RevenueByCategory[]>(`${API_URL}/revenue-by-category`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { startDate, endDate },
  })
  return response.data
}

export async function getRevenueByPeriod(
  token: string,
  startDate?: string,
  endDate?: string,
  groupBy: 'day' | 'month' = 'month'
): Promise<RevenueByPeriod[]> {
  const response = await axios.get<RevenueByPeriod[]>(`${API_URL}/revenue-by-period`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { startDate, endDate, groupBy },
  })
  return response.data
}

export async function getTopProducts(
  token: string,
  limit: number = 10,
  startDate?: string,
  endDate?: string
): Promise<TopProduct[]> {
  const response = await axios.get<TopProduct[]>(`${API_URL}/top-products`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit, startDate, endDate },
  })
  return response.data
}

export async function getOrderStatusDistribution(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<OrderStatusDistribution[]> {
  const response = await axios.get<OrderStatusDistribution[]>(
    `${API_URL}/order-status-distribution`,
    { headers: { Authorization: `Bearer ${token}` }, params: { startDate, endDate } }
  )
  return response.data
}

export async function getReviewStats(token: string): Promise<ReviewStats> {
  const response = await axios.get<ReviewStats>(`${API_URL}/review-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getRefundStats(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<RefundStats> {
  const response = await axios.get<RefundStats>(`${API_URL}/refund-stats`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { startDate, endDate },
  })
  return response.data
}

export async function getVoucherStats(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<VoucherStat[]> {
  const response = await axios.get<VoucherStat[]>(`${API_URL}/voucher-stats`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { startDate, endDate },
  })
  return response.data
}

export async function getCarbonIndexStats(token: string): Promise<CarbonIndexStats> {
  const response = await axios.get<CarbonIndexStats>(`${API_URL}/carbon-index-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getTopCustomers(
  token: string,
  limit: number = 10,
  startDate?: string,
  endDate?: string
): Promise<TopCustomer[]> {
  const response = await axios.get<TopCustomer[]>(`${API_URL}/top-customers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit, startDate, endDate },
  })
  return response.data
}

export async function getInventoryOverview(token: string): Promise<InventoryOverview> {
  const response = await axios.get<InventoryOverview>(`${API_URL}/inventory-overview`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getNewCustomerStats(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<NewCustomerStats[]> {
  const response = await axios.get<NewCustomerStats[]>(`${API_URL}/new-customers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { startDate, endDate },
  })
  return response.data
}

export async function exportReport(
  token: string,
  type: ExportFormat,
  report: ReportType,
  startDate?: string,
  endDate?: string
): Promise<Blob> {
  const response = await axios.get(`${API_URL}/export`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { type, report, startDate, endDate },
    responseType: 'blob',
  })
  return response.data
}
