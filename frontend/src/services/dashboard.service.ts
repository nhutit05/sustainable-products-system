import axios from 'axios';
import type { DashboardSummary, RevenueByMonth, RecentOrder } from '../model/dashboard.model';

const API_URL = 'http://localhost:8080/api/admin/dashboard';

export async function getDashboardSummary(
  token: string,
): Promise<DashboardSummary> {
  const response = await axios.get<DashboardSummary>(`${API_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getRevenueByMonth(
  token: string,
  year: number,
): Promise<RevenueByMonth[]> {
  const response = await axios.get<RevenueByMonth[]>(`${API_URL}/revenue`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { year },
  });
  return response.data;
}

export async function getRecentOrders(
  token: string,
  limit: number = 10,
): Promise<RecentOrder[]> {
  const response = await axios.get<RecentOrder[]>(
    `${API_URL}/recent-orders`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit },
    },
  );
  return response.data;
}
