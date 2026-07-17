import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Skeleton,
  Spin,
  message,
} from "antd";
import type { Dayjs } from "dayjs";
import { Eye } from "lucide-react";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";

import type {
  orderStatusResponse,
  paymentStatusResponse,
  paymentMethodResponse,
  orderSummaryResponse,
  orderResponse,
} from "../model/order.model";

import {
  getOrderStatuses,
  getPaymentStatuses,
  getPaymentMethods,
  getOrderById,
  getOrders,
  confirmOrder,
  shippingOrder,
  completeOrder,
  rejectOrder,
} from "../services/admin-order.service";
import type dayjs from "dayjs";

const { RangePicker } = DatePicker;

// ==========================
// HELPERS (pure, stable refs)
// ==========================

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("vi-VN");

const formatCurrency = (value: number) =>
  Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const statusBadge = (id: number, name: string) => {
  const map: Record<number, string> = {
    1: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
    2: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/60",
    3: "bg-violet-50 text-violet-700 ring-1 ring-violet-200/60",
    4: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
    5: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${map[id] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/60"}`}>
      {name}
    </span>
  );
};

const paymentBadge = (id: number, name: string) => {
  const map: Record<number, string> = {
    1: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
    2: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
    3: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${map[id] ?? "bg-gray-50 text-gray-600 ring-1 ring-gray-200/60"}`}>
      {name}
    </span>
  );
};

const methodBadge = (id: number) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${id === 1 ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200/60" : "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200/60"}`}>
    {id === 2 ? "COD" : "ONLINE"}
  </span>
);

// ==========================
// COMPONENT
// ==========================

export default function AdminOrders() {
  const token = localStorage.getItem("token") ?? "";
  const abortRef = useRef<AbortController | null>(null);

  // ---- state ----
  const [orders, setOrders] = useState<orderSummaryResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [orderStatuses, setOrderStatuses] = useState<orderStatusResponse[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<paymentStatusResponse[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<paymentMethodResponse[]>([]);

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<number>();
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<number>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<orderResponse | null>(null);

  // ---- fetch filters (once) ----
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const [os, ps, pm] = await Promise.all([
          getOrderStatuses(token),
          getPaymentStatuses(token),
          getPaymentMethods(token),
        ]);
        if (!cancelled) {
          setOrderStatuses(os);
          setPaymentStatuses(ps);
          setPaymentMethods(pm);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  // ---- fetch orders ----
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const response = await getOrders(token, {
        page: currentPage - 1,
        size: pageSize,
        keyword: debouncedKeyword || undefined,
        orderStatusId: selectedOrderStatus,
        paymentStatusId: selectedPaymentStatus,
        paymentMethodId: selectedPaymentMethod,
        startDate: dateRange?.[0]?.toDate(),
        endDate: dateRange?.[1]?.toDate(),
      });
      if (!controller.signal.aborted) {
        setOrders(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [token, currentPage, pageSize, debouncedKeyword, selectedOrderStatus, selectedPaymentStatus, selectedPaymentMethod, dateRange, refreshKey]);

  // ---- reset page on filter change ----
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, selectedOrderStatus, selectedPaymentStatus, selectedPaymentMethod]);

  // ---- trigger fetch ----
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ---- debounce keyword ----
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(t);
  }, [keyword]);

  // ---- handlers ----
  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setKeyword("");
    setSelectedOrderStatus(undefined);
    setSelectedPaymentStatus(undefined);
    setSelectedPaymentMethod(undefined);
    setDateRange(null);
    setCurrentPage(1);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages || 1));
  }, [totalPages]);

  const openOrderDetail = useCallback(
    async (orderId: number) => {
      if (!token) return;
      setDrawerOpen(true);
      setDetailLoading(true);
      try {
        const response = await getOrderById(token, orderId);
        setSelectedOrder(response);
      } catch {
        message.error("Không thể tải chi tiết đơn hàng.");
        setDrawerOpen(false);
      } finally {
        setDetailLoading(false);
      }
    },
    [token]
  );

  const handleOrderAction = useCallback(
    async (action: "confirm" | "shipping" | "complete" | "reject") => {
      if (!token || !selectedOrder) return;
      setActionLoading(true);
      try {
        let updated: orderResponse;
        switch (action) {
          case "confirm": updated = await confirmOrder(token, selectedOrder.orderId); break;
          case "shipping": updated = await shippingOrder(token, selectedOrder.orderId); break;
          case "complete": updated = await completeOrder(token, selectedOrder.orderId); break;
          case "reject": updated = await rejectOrder(token, selectedOrder.orderId); break;
        }
        message.success("Cập nhật trạng thái thành công.");
        setDrawerOpen(false);
        setSelectedOrder(null);
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === updated!.orderId
              ? {
                  ...o,
                  orderStatusId: updated!.orderStatusId,
                  orderStatusName: updated!.orderStatusName,
                }
              : o
          )
        );
      } catch (error: any) {
        message.error(error?.response?.data?.message ?? "Không thể cập nhật trạng thái.");
      } finally {
        setActionLoading(false);
      }
    },
    [token, selectedOrder]
  );

  const handleCloseDrawer = useCallback(() => {
    if (actionLoading) return;
    setDrawerOpen(false);
    setSelectedOrder(null);
  }, [actionLoading]);

  // ---- derived ----
  const paginationInfo = useMemo(
    () => ({ from: orders.length, total: totalElements }),
    [orders.length, totalElements]
  );

  // ==========================
  // RENDER
  // ==========================

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-5 lg:space-y-6">

        {/* ================= HEADER ================= */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 sm:px-6 sm:py-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                Quản lý đơn hàng
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 truncate">
                Theo dõi và quản lý tất cả đơn hàng
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 active:bg-emerald-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              <ReloadOutlined className={`text-sm ${loading ? "animate-spin" : ""}`}/>
              Làm mới
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <Input
              placeholder="Tìm theo mã đơn, mã khách..."
              prefix={<SearchOutlined className="text-emerald-400" />}
              allowClear
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="hover:border-emerald-300 focus-within:border-emerald-400 focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.1)]"
            />
            <RangePicker
              value={dateRange}
              onChange={(v) => setDateRange(v as [Dayjs | null, Dayjs | null] | null)}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              className="w-full"
            />
            <Select
              allowClear
              placeholder="Trạng thái đơn hàng"
              value={selectedOrderStatus}
              onChange={setSelectedOrderStatus}
              options={orderStatuses.map((s) => ({ value: s.orderStatusId, label: s.orderStatusName }))}
              className="w-full"
            />
            <Select
              allowClear
              placeholder="Trạng thái thanh toán"
              value={selectedPaymentStatus}
              onChange={setSelectedPaymentStatus}
              options={paymentStatuses.map((s) => ({ value: s.paymentStatusId, label: s.paymentStatusName }))}
              className="w-full"
            />
            <Select
              allowClear
              placeholder="Phương thức thanh toán"
              value={selectedPaymentMethod}
              onChange={setSelectedPaymentMethod}
              options={paymentMethods.map((m) => ({ value: m.paymentMethodId, label: m.paymentMethodName }))}
              className="w-full"
            />
          </div>
        </header>

        {/* ================= TABLE (desktop) ================= */}
        <main className="bg-white rounded-2xl shadow-sm border border-emerald-100/60 overflow-hidden">
          <Spin spinning={loading} size="medium">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100/60">
                    <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Mã đơn</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-emerald-800 uppercase tracking-wider">Giá trị</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">PTTT</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">Thanh toán</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">Ngày đặt</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80">
                  {orders.length === 0 && !loading && (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-3xl">📦</div>
                          <div>
                            <p className="font-semibold text-gray-500">Không có đơn hàng</p>
                            <p className="text-sm text-gray-400 mt-0.5">Thử thay đổi bộ lọc tìm kiếm</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-emerald-50/30 transition-colors duration-150">
                      <td className="px-4 py-3 font-bold text-emerald-700 whitespace-nowrap">#{order.orderId}</td>
                      <td className="px-4 py-3">
                        <div className="whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.customerUsername}</div>
                          <div className="text-xs text-gray-400">#{order.customerId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-4 py-3 text-center">{methodBadge(order.paymentMethodId)}</td>
                      <td className="px-4 py-3 text-center">{paymentBadge(order.paymentStatusId, order.paymentStatusName)}</td>
                      <td className="px-4 py-3 text-center">{statusBadge(order.orderStatusId, order.orderStatusName)}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500 whitespace-nowrap">{formatDate(order.orderedAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openOrderDetail(order.orderId)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors duration-150 cursor-pointer"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {orders.length === 0 && !loading && (
                <div className="py-16 text-center text-gray-400">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-3xl mb-3">📦</div>
                  <p className="font-semibold text-gray-500">Không có đơn hàng</p>
                  <p className="text-sm text-gray-400 mt-0.5">Thử thay đổi bộ lọc tìm kiếm</p>
                </div>
              )}
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  onClick={() => openOrderDetail(order.orderId)}
                  className="px-4 py-3.5 active:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-emerald-700">#{order.orderId}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 truncate mr-2">{order.customerUsername}</span>
                    <span className="text-xs text-gray-400 shrink-0">{formatDate(order.orderedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {statusBadge(order.orderStatusId, order.orderStatusName)}
                    {paymentBadge(order.paymentStatusId, order.paymentStatusName)}
                    {methodBadge(order.paymentMethodId)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-t border-emerald-100/60">
              <span className="text-sm text-gray-500">
                Hiển thị <b>{paginationInfo.from}</b> / <b>{paginationInfo.total}</b> đơn hàng
              </span>
              <div className="flex items-center gap-2">
                <Button onClick={handlePrev} disabled={currentPage === 1} size="small">Trước</Button>
                <Pagination
                  current={currentPage}
                  total={totalElements}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  size="small"
                  onChange={(page) => setCurrentPage(page)}
                />
                <Button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0} size="small">Sau</Button>
              </div>
            </div>
          </Spin>
        </main>

        {/* ================= DETAIL DRAWER ================= */}
        <Drawer
          title={selectedOrder ? `Chi tiết đơn hàng #${selectedOrder.orderId}` : "Chi tiết đơn hàng"}
          size={720}
          open={drawerOpen}
          onClose={handleCloseDrawer}
          destroyOnHidden
        >
          {detailLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} active paragraph={{ rows: 2 }} />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Thông tin đơn hàng */}
              <section className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-4">
                <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">Thông tin đơn hàng</h3>
                <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                  <Descriptions.Item label="Mã đơn">#{selectedOrder?.orderId}</Descriptions.Item>
                  <Descriptions.Item label="Ngày đặt">
                    {selectedOrder && formatDateTime(selectedOrder.orderedAt + 'Z')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khách hàng">{selectedOrder?.customerUsername}</Descriptions.Item>
                  <Descriptions.Item label="Mã khách hàng">#{selectedOrder?.customerId}</Descriptions.Item>
                </Descriptions>
              </section>

              {/* Người nhận */}
              <section className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-4">
                <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">Người nhận</h3>
                <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                  <Descriptions.Item label="Họ tên">{selectedOrder?.orderReceiver}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{selectedOrder?.orderReceiverPhone}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ" span={2}>{selectedOrder?.orderAddress}</Descriptions.Item>
                </Descriptions>
              </section>

              {/* Thanh toán */}
              <section className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-4">
                <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">Thanh toán</h3>
                <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                  <Descriptions.Item label="Phương thức">
                    {selectedOrder && methodBadge(selectedOrder.paymentMethodId)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái thanh toán">
                    {selectedOrder && paymentBadge(selectedOrder.paymentStatusId, selectedOrder.paymentStatusName)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Voucher">{selectedOrder?.voucherCode ?? "Không sử dụng"}</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái đơn">
                    {selectedOrder && statusBadge(selectedOrder.orderStatusId, selectedOrder.orderStatusName)}
                  </Descriptions.Item>
                </Descriptions>
              </section>

              {/* Danh sách sản phẩm */}
              <section className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-4">
                <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">Danh sách sản phẩm</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-emerald-100">
                        <th className="py-2 pr-4 text-left font-semibold text-emerald-800 text-xs uppercase">Sản phẩm</th>
                        <th className="py-2 px-4 text-center font-semibold text-emerald-800 text-xs uppercase">SL</th>
                        <th className="py-2 px-4 text-right font-semibold text-emerald-800 text-xs uppercase">Đơn giá</th>
                        <th className="py-2 pl-4 text-right font-semibold text-emerald-800 text-xs uppercase">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder?.items.map((item) => (
                        <tr key={item.productId}>
                          <td className="py-2.5 pr-4 text-gray-900">{item.productName}</td>
                          <td className="py-2.5 px-4 text-center text-gray-600">{item.quantity}</td>
                          <td className="py-2.5 px-4 text-right text-gray-600">{formatCurrency(item.purchasedPrice)}</td>
                          <td className="py-2.5 pl-4 text-right font-medium text-gray-900">{formatCurrency(item.subTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Thao tác */}
              <section className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-4">
                <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">Thao tác</h3>
                <div className="flex flex-wrap justify-end gap-2">
                  {selectedOrder?.orderStatusName === "PENDING" && (
                    <>
                      <Popconfirm title="Xác nhận đơn hàng?" onConfirm={() => handleOrderAction("confirm")} okText="Đồng ý" cancelText="Huỷ">
                        <Button type="primary" loading={actionLoading}>Xác nhận</Button>
                      </Popconfirm>
                      <Popconfirm title="Huỷ đơn hàng?" onConfirm={() => handleOrderAction("reject")} okText="Huỷ đơn" cancelText="Quay lại">
                        <Button danger loading={actionLoading}>Huỷ đơn</Button>
                      </Popconfirm>
                    </>
                  )}
                  {selectedOrder?.orderStatusName === "CONFIRMED" && (
                    <>
                      <Popconfirm title="Chuyển sang giao hàng?" onConfirm={() => handleOrderAction("shipping")} okText="Đồng ý" cancelText="Huỷ">
                        <Button type="primary" loading={actionLoading}>Giao hàng</Button>
                      </Popconfirm>
                      <Popconfirm title="Huỷ đơn hàng?" onConfirm={() => handleOrderAction("reject")} okText="Huỷ đơn" cancelText="Quay lại">
                        <Button danger loading={actionLoading}>Huỷ đơn</Button>
                      </Popconfirm>
                    </>
                  )}
                  {selectedOrder?.orderStatusName === "SHIPPING" && (
                    <Popconfirm title="Hoàn thành đơn hàng?" onConfirm={() => handleOrderAction("complete")} okText="Hoàn thành" cancelText="Huỷ">
                      <Button type="primary" loading={actionLoading}>Hoàn thành</Button>
                    </Popconfirm>
                  )}
                  {selectedOrder?.orderStatusName === "COMPLETED" && (
                    <span className="text-emerald-600 font-semibold">Đơn hàng đã hoàn thành.</span>
                  )}
                  {selectedOrder?.orderStatusName === "CANCELLED" && (
                    <span className="text-rose-600 font-semibold">Đơn hàng đã bị huỷ.</span>
                  )}
                </div>
              </section>

              <Divider className="!my-2 !border-emerald-100" />

              {/* Tổng tiền */}
              <div className="flex justify-end">
                <div className="text-right bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl px-6 py-3 border border-emerald-100">
                  <div className="text-sm text-emerald-600 font-medium">Tổng thanh toán</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                    {selectedOrder && formatCurrency(selectedOrder.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
}
