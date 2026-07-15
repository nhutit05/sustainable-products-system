export interface DashboardSummary {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  paidOrders: number;
}

export interface RevenueByMonth {
  year: number;
  month: number;
  revenue: number;
  orderCount: number;
}

export interface RecentOrder {
  orderId: number;
  orderedAt: string;
  customerUsername: string;
  totalAmount: number;
  orderStatusName: string;
  paymentStatusName: string;
}
