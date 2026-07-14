import {
  CircleCheckBig,
  Eye,
  SquarePenIcon,
} from "lucide-react";

import {
  Drawer,
  Descriptions,
  Popconfirm,
  message,
  Divider,
} from "antd";

import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

import { Spin } from "antd";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Input,
  Pagination,
  Select,
  Skeleton,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";


import type {
  orderStatusResponse,
  paymentStatusResponse,
  paymentMethodResponse,
  orderSummaryResponse,
  orderResponse
} from "../model/order.model";

import {
  getOrderStatuses,
  getPaymentStatuses,
  getPaymentMethods,
} from "../services/admin-order.service";

import {
  getOrderById,
  confirmOrder,
  shippingOrder,
  completeOrder,
  rejectOrder,
} from "../services/admin-order.service";


import { getOrders } from "../services/admin-order.service";

const { Search } = Input;


export default function AdminOrders() {
  const token = localStorage.getItem("token") ?? "";

  // ==========================
  // STATE
  // ==========================

  const [orders, setOrders] =
    useState<orderSummaryResponse[]>([]);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] =
    useState(0);

  const [pageSize] = useState(10);

  const [orderStatuses, setOrderStatuses] =
    useState<orderStatusResponse[]>([]);

  const [paymentStatuses, setPaymentStatuses] =
    useState<paymentStatusResponse[]>([]);

  const [paymentMethods, setPaymentMethods] =
    useState<paymentMethodResponse[]>([]);

    const [dateRange, setDateRange] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [keyword, setKeyword] = useState("");

  const [debouncedKeyword, setDebouncedKeyword] =
    useState("");

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState<orderResponse | null>(null);


  const [
    selectedOrderStatus,
    setSelectedOrderStatus,
  ] = useState<number>();

  const [
    selectedPaymentStatus,
    setSelectedPaymentStatus,
  ] = useState<number>();

  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState<number>();

  const [currentPage, setCurrentPage] =
    useState(1);

  // ==========================
  // HELPER
  // ==========================

  const vietnameseDateFormatter = (
    dateString: string
  ) => {
    return new Date(
      dateString
    ).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (
    value: number
  ) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const openOrderDetail = async (
    orderId: number
  ) => {

    if (!token) return;

    setDrawerOpen(true);

    setDetailLoading(true);

    try {

      const response =
        await getOrderById(
          token,
          orderId
        );

      setSelectedOrder(response);

    } catch {

      message.error(
        "Không thể tải chi tiết đơn hàng."
      );

      setDrawerOpen(false);

    } finally {

      setDetailLoading(false);

    }
  };

  const handleOrderAction = async (
    action: "confirm" | "shipping" | "complete" | "reject"
) => {

    if (!token || !selectedOrder) return;

    setActionLoading(true);

    try {

        switch (action) {

            case "confirm":

                await confirmOrder(
                    token,
                    selectedOrder.orderId
                );

                break;

            case "shipping":

                await shippingOrder(
                    token,
                    selectedOrder.orderId
                );

                break;

            case "complete":

                await completeOrder(
                    token,
                    selectedOrder.orderId
                );

                break;

            case "reject":

                await rejectOrder(
                    token,
                    selectedOrder.orderId
                );

                break;
        }

        message.success("Cập nhật trạng thái thành công.");

        setDrawerOpen(false);

        setSelectedOrder(null);

        fetchOrders();

    } catch (error: any) {

        message.error(
            error?.response?.data?.message ??
            "Không thể cập nhật trạng thái."
        );

    } finally {

        setActionLoading(false);

    }

};

  // ==========================
  // FETCH
  // ==========================

  useEffect(() => {

    if (!token) return;

    const fetchFilters = async () => {

      try {

        const [

          orderStatusData,

          paymentStatusData,

          paymentMethodData,


        ] = await Promise.all([

          getOrderStatuses(token),

          getPaymentStatuses(token),

          getPaymentMethods(token)

        ]);

        setOrderStatuses(
          orderStatusData
        );

        setPaymentStatuses(
          paymentStatusData
        );

        setPaymentMethods(
          paymentMethodData
        );

      } catch (error) {

        console.error(error);

      }

    };

    fetchFilters();

  }, [token]);


  const fetchOrders = async () => {

    if (!token) return;

    setLoading(true);

    try {

      const response =
        await getOrders(token, {

          page: currentPage - 1,

          size: pageSize,

          keyword:
            debouncedKeyword || undefined,

          orderStatusId:
            selectedOrderStatus,

          paymentStatusId:
            selectedPaymentStatus,

          paymentMethodId:
            selectedPaymentMethod,

          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),

          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),

        });

      setOrders(response.content);

      setTotalPages(
        response.totalPages
      );

      setTotalElements(
        response.totalElements
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    setCurrentPage(1);

  }, [

    debouncedKeyword,

    selectedOrderStatus,

    selectedPaymentStatus,

    selectedPaymentMethod

  ]);

  useEffect(() => {

    fetchOrders();

  }, [

    currentPage,

    pageSize,

    debouncedKeyword,

    selectedOrderStatus,

    selectedPaymentStatus,

    selectedPaymentMethod,

    dateRange,

    token

  ]);

  // HANDLERS
  // ==========================

  const handlePrev =
    useCallback(() => {
      setCurrentPage((prev) =>
        Math.max(prev - 1, 1)
      );
    }, []);

  const handleNext =
    useCallback(() => {
      setCurrentPage((prev) =>
        Math.min(
          prev + 1,
          totalPages || 1
        )
      );
    }, [totalPages]);

  const handleRefresh = () => {
    setSearchQuery("");

    setSelectedOrderStatus(
      undefined
    );

    setSelectedPaymentStatus(
      undefined
    );

    setSelectedPaymentMethod(
      undefined
    );

        setDateRange(null);

    setCurrentPage(1);



    fetchOrders();
  };

  useEffect(() => {

    const timeout = setTimeout(() => {

      setDebouncedKeyword(keyword);

    }, 300);

    return () => clearTimeout(timeout);

  }, [keyword]);

 

  return (
    <div className="flex flex-col gap-4 px-4">

      {/* ================= HEADER ================= */}

      <header className="bg-white rounded-2xl shadow p-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

          <h1 className="text-2xl font-semibold text-green-900">
            Quản lý đơn hàng
          </h1>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* <Search
            allowClear
            placeholder="Mã đơn, mã KH, tên khách..."
            enterButton={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          /> */}

          <Input
            placeholder="Tìm theo mã đơn, mã khách..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
          />

          <RangePicker
    value={dateRange}
    onChange={setDateRange}
    format="DD/MM/YYYY"
    placeholder={[
        "Từ ngày",
        "Đến ngày",
    ]}
    className="w-full"
/>

          <Select
            allowClear
            placeholder="Trạng thái đơn hàng"
            value={selectedOrderStatus}
            onChange={setSelectedOrderStatus}
            options={orderStatuses.map((status) => ({
              value: status.orderStatusId,
              label: status.orderStatusName,
            }))}
          />

          <Select
            allowClear
            placeholder="Trạng thái thanh toán"
            value={selectedPaymentStatus}
            onChange={setSelectedPaymentStatus}
            options={paymentStatuses.map((status) => ({
              value: status.paymentStatusId,
              label: status.paymentStatusName,
            }))}
          />

          <Select
            allowClear
            placeholder="Phương thức thanh toán"
            value={selectedPaymentMethod}
            onChange={setSelectedPaymentMethod}
            options={paymentMethods.map((method) => ({
              value: method.paymentMethodId,
              label: method.paymentMethodName,
            }))}
          />

        </div>

      </header>

      {/* ================= TABLE ================= */}

      <main className="bg-white rounded-2xl shadow p-5">

        <Spin spinning={loading} size="medium">

          <div className="overflow-x-auto">

            <table className="min-w-full border border-gray-200">

              <thead className="bg-emerald-50">

                <tr>

                  <th className="p-3 text-left whitespace-nowrap">
                    Mã đơn
                  </th>

                  <th className="p-3 text-left whitespace-nowrap">
                    Mã KH
                  </th>

                  <th className="p-3 text-left whitespace-nowrap">
                    Khách hàng
                  </th>

                  <th className="p-3 text-right whitespace-nowrap">
                    Giá trị
                  </th>

                  <th className="p-3 text-center whitespace-nowrap">
                    PTTT
                  </th>

                  <th className="p-3 text-center whitespace-nowrap">
                    Thanh toán
                  </th>

                  <th className="p-3 text-center whitespace-nowrap">
                    Trạng thái
                  </th>

                  <th className="p-3 text-center whitespace-nowrap">
                    Ngày đặt
                  </th>

                  <th className="p-3 text-center whitespace-nowrap">
                    Thao tác
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.length === 0 && (

                  <tr>

                    <td
                      colSpan={9}
                      className="py-12 text-center text-gray-500"
                    >
                      Không có đơn hàng
                    </td>

                  </tr>

                )}

                {orders.map((order) => (

                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-50 transition-colors"
                  >

                    <td className="p-3 font-medium whitespace-nowrap">
                      #{order.orderId}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {order.customerId}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {order.customerUsername}
                    </td>

                    <td className="p-3 text-right whitespace-nowrap">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td className="p-3 text-center whitespace-nowrap">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentMethodId === 1
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                          }`}
                      >
                        {order.paymentMethodId === 2 ? "COD" : "ONLINE"}
                      </span>

                    </td>

                    <td className="p-3 text-center whitespace-nowrap">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatusId === 2
                            ? "bg-green-100 text-green-700"
                            : order.paymentStatusId === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {order.paymentStatusName}
                      </span>

                    </td>

                    <td className="p-3 text-center whitespace-nowrap">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.orderStatusId === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : order.orderStatusId === 2
                              ? "bg-blue-100 text-blue-700"
                              : order.orderStatusId === 3
                                ? "bg-indigo-100 text-indigo-700"
                                : order.orderStatusId === 4
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                      >
                        {order.orderStatusName}
                      </span>

                    </td>

                    <td className="p-3 text-center whitespace-nowrap">
                      {vietnameseDateFormatter(
                        order.orderedAt
                      )}
                    </td>

                    <td className="p-3">

                      <div className="flex justify-center gap-4">

                        <Eye
                          size={18}
                          className="cursor-pointer text-amber-500 hover:scale-110 transition"
                          onClick={() =>
                            openOrderDetail(order.orderId)
                          }
                        />

                       

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= PAGINATION ================= */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">

            <span className="text-sm text-gray-500">
              Hiển thị{" "}
              <b>{orders.length}</b> /{" "}
              <b>{totalElements}</b> đơn hàng
            </span>

            <div className="flex items-center gap-2 flex-wrap">

              <Button
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                Trước
              </Button>

              <Pagination
                current={currentPage}
                total={totalElements}
                pageSize={pageSize}
                showSizeChanger={false}
                onChange={(page) =>
                  setCurrentPage(page)}
              />

              <Button
                onClick={handleNext}
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
              >
                Sau
              </Button>

            </div>

          </div>

        </Spin>

      </main>

      <Drawer
    title={
        selectedOrder
            ? `Chi tiết đơn hàng #${selectedOrder.orderId}`
            : "Chi tiết đơn hàng"
    }
    width={720}
    open={drawerOpen}
    onClose={() => {
      if (actionLoading) return;

        setDrawerOpen(false);
        setSelectedOrder(null);
    }}
    destroyOnClose
>
    {detailLoading ? (

        <Spin/>

    ) : (

        // <div>
        //     Nội dung Drawer sẽ làm ở bước tiếp theo.
        // </div>

        <div className="space-y-6">

    {/* ================= Thông tin đơn hàng ================= */}

    <div className="rounded-xl border border-gray-200 p-4">

        <h3 className="font-semibold text-lg text-green-700 mb-4">
            Thông tin đơn hàng
        </h3>

        <Descriptions
            bordered
            column={1}
            size="small"
        >
            <Descriptions.Item label="Mã đơn">
                #{selectedOrder?.orderId}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày đặt">
                {selectedOrder &&
                    new Date(
                        selectedOrder.orderedAt
                    ).toLocaleString("vi-VN")}
            </Descriptions.Item>

            <Descriptions.Item label="Khách hàng">
                {selectedOrder?.customerUsername}
            </Descriptions.Item>

            <Descriptions.Item label="Mã khách hàng">
                {selectedOrder?.customerId}
            </Descriptions.Item>

        </Descriptions>

    </div>

    {/* ================= Người nhận ================= */}

    <div className="rounded-xl border border-gray-200 p-4">

        <h3 className="font-semibold text-lg text-green-700 mb-4">
            Người nhận
        </h3>

        <Descriptions
            bordered
            column={1}
            size="small"
        >

            <Descriptions.Item label="Họ tên">
                {selectedOrder?.orderReceiver}
            </Descriptions.Item>

            <Descriptions.Item label="Số điện thoại">
                {selectedOrder?.orderReceiverPhone}
            </Descriptions.Item>

            <Descriptions.Item label="Địa chỉ">
                {selectedOrder?.orderAddress}
            </Descriptions.Item>

        </Descriptions>

    </div>

    {/* ================= Thanh toán ================= */}

    <div className="rounded-xl border border-gray-200 p-4">

        <h3 className="font-semibold text-lg text-green-700 mb-4">
            Thanh toán
        </h3>

        <Descriptions
            bordered
            column={1}
            size="small"
        >

            <Descriptions.Item label="Phương thức">

                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedOrder?.paymentMethodId === 2
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                    }`}
                >
                    {selectedOrder?.paymentMethodName}
                </span>

            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái thanh toán">

                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedOrder?.paymentStatusId === 2
                            ? "bg-green-100 text-green-700"
                            : selectedOrder?.paymentStatusId === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {selectedOrder?.paymentStatusName}
                </span>

            </Descriptions.Item>

            <Descriptions.Item label="Voucher">

                {selectedOrder?.voucherCode ??
                    "Không sử dụng"}

            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái đơn">

                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedOrder?.orderStatusId === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : selectedOrder?.orderStatusId === 2
                            ? "bg-blue-100 text-blue-700"
                            : selectedOrder?.orderStatusId === 3
                            ? "bg-indigo-100 text-indigo-700"
                            : selectedOrder?.orderStatusId === 4
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {selectedOrder?.orderStatusName}
                </span>

            </Descriptions.Item>

        </Descriptions>

    </div>

    {/* ================= Danh sách sản phẩm ================= */}

    <div className="rounded-xl border border-gray-200 p-4">

        <h3 className="font-semibold text-lg text-green-700 mb-4">
            Danh sách sản phẩm
        </h3>

        <div className="overflow-x-auto">

            <table className="min-w-full border border-gray-200">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="p-2 text-left">
                            Sản phẩm
                        </th>

                        <th className="p-2 text-center">
                            SL
                        </th>

                        <th className="p-2 text-right">
                            Đơn giá
                        </th>

                        <th className="p-2 text-right">
                            Thành tiền
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {selectedOrder?.items.map(
                        (item) => (

                            <tr
                                key={item.productId}
                                className="border-t"
                            >

                                <td className="p-2">
                                    {item.productName}
                                </td>

                                <td className="p-2 text-center">
                                    {item.quantity}
                                </td>

                                <td className="p-2 text-right">
                                    {formatCurrency(
                                        item.purchasedPrice
                                    )}
                                </td>

                                <td className="p-2 text-right font-medium">
                                    {formatCurrency(
                                        item.subTotal
                                    )}
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>

    </div>

    {/* ================= Tổng tiền ================= */}

    <Divider />

    <Divider />

<div>

    <h3 className="font-semibold text-lg text-green-700 mb-4">
        Thao tác
    </h3>

    <div className="flex justify-end gap-3 flex-wrap">

        {/* PENDING */}

        {selectedOrder?.orderStatusName === "PENDING" && (

            <>

                <Popconfirm
                    title="Xác nhận đơn hàng?"
                    onConfirm={() =>
                        handleOrderAction(
                            "confirm"
                        )
                    }
                    okText="Đồng ý"
                    cancelText="Huỷ"
                >

                    <Button
                        type="primary"
                        loading={actionLoading}
                    >
                        Xác nhận
                    </Button>

                </Popconfirm>

                <Popconfirm
                    title="Huỷ đơn hàng?"
                    onConfirm={() =>
                        handleOrderAction(
                            "reject"
                        )
                    }
                    okText="Huỷ đơn"
                    cancelText="Quay lại"
                >

                    <Button
                        danger
                        loading={actionLoading}
                    >
                        Huỷ đơn
                    </Button>

                </Popconfirm>

            </>

        )}

        {/* CONFIRMED */}

        {selectedOrder?.orderStatusName ===
            "CONFIRMED" && (

            <>

                <Popconfirm
                    title="Chuyển sang giao hàng?"
                    onConfirm={() =>
                        handleOrderAction(
                            "shipping"
                        )
                    }
                    okText="Đồng ý"
                    cancelText="Huỷ"
                >

                    <Button
                        type="primary"
                        loading={actionLoading}
                    >
                        Giao hàng
                    </Button>

                </Popconfirm>

                <Popconfirm
                    title="Huỷ đơn hàng?"
                    onConfirm={() =>
                        handleOrderAction(
                            "reject"
                        )
                    }
                    okText="Huỷ đơn"
                    cancelText="Quay lại"
                >

                    <Button
                        danger
                        loading={actionLoading}
                    >
                        Huỷ đơn
                    </Button>

                </Popconfirm>

            </>

        )}

        {/* SHIPPING */}

        {selectedOrder?.orderStatusName ===
            "SHIPPING" && (

            <Popconfirm
                title="Hoàn thành đơn hàng?"
                onConfirm={() =>
                    handleOrderAction(
                        "complete"
                    )
                }
                okText="Hoàn thành"
                cancelText="Huỷ"
            >

                <Button
                    type="primary"
                    loading={actionLoading}
                >
                    Hoàn thành
                </Button>

            </Popconfirm>

        )}

        {/* COMPLETED */}

        {selectedOrder?.orderStatusName ===
            "COMPLETED" && (

            <span className="text-green-600 font-medium">
                Đơn hàng đã hoàn thành.
            </span>

        )}

        {/* CANCELLED */}

        {selectedOrder?.orderStatusName ===
            "CANCELLED" && (

            <span className="text-red-600 font-medium">
                Đơn hàng đã bị huỷ.
            </span>

        )}

    </div>

</div>

    <div className="flex justify-end">

        <div className="text-right">

            <div className="text-gray-500">
                Tổng thanh toán
            </div>

            <div className="text-2xl font-bold text-green-700">

                {selectedOrder &&
                    formatCurrency(
                        selectedOrder.totalAmount
                    )}

            </div>

        </div>

    </div>

</div>

    )}
</Drawer>

    </div>
  );
}