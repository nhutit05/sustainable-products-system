import axios from 'axios'
import type {
  RevenueByCategory,
  TopProduct,
  OrderStatusDistribution,
  ReviewStats,
  RefundStats,
  VoucherStat,
  CarbonIndexStats,
  TopCustomer,
  ReportType,
  ExportFormat,
} from '../model/statistics.model'

const API_URL = 'http://localhost:8080/api/admin/statistics'

export async function getRevenueByCategory(token: string): Promise<RevenueByCategory[]> {
  const response = await axios.get<RevenueByCategory[]>(`${API_URL}/revenue-by-category`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getTopProducts(token: string, limit: number = 10): Promise<TopProduct[]> {
  const response = await axios.get<TopProduct[]>(`${API_URL}/top-products`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit },
  })
  return response.data
}

export async function getOrderStatusDistribution(
  token: string
): Promise<OrderStatusDistribution[]> {
  const response = await axios.get<OrderStatusDistribution[]>(
    `${API_URL}/order-status-distribution`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export async function getReviewStats(token: string): Promise<ReviewStats> {
  const response = await axios.get<ReviewStats>(`${API_URL}/review-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getRefundStats(token: string): Promise<RefundStats> {
  const response = await axios.get<RefundStats>(`${API_URL}/refund-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getVoucherStats(token: string): Promise<VoucherStat[]> {
  const response = await axios.get<VoucherStat[]>(`${API_URL}/voucher-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getCarbonIndexStats(token: string): Promise<CarbonIndexStats> {
  const response = await axios.get<CarbonIndexStats>(`${API_URL}/carbon-index-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getTopCustomers(token: string, limit: number = 10): Promise<TopCustomer[]> {
  const response = await axios.get<TopCustomer[]>(`${API_URL}/top-customers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit },
  })
  return response.data
}

export async function exportReport(
  token: string,
  type: ExportFormat,
  report: ReportType
): Promise<Blob> {
  const response = await axios.get(`${API_URL}/export`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { type, report },
    responseType: 'blob',
  })
  return response.data
}
