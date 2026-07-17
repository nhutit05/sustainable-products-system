import { useCallback, useEffect, useState } from "react"
import { Pagination, Spin, Button, Modal, Form, Input, InputNumber, Select, Switch, message, Popconfirm } from "antd"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

import type {
  CityAdminResponse,
  VillageAdminResponse,
  CustomerAdminResponse,
  BankAdminResponse,
  CategoryAdminResponse,
  MaterialAdminResponse,
  OrderStatusAdminResponse,
  PaymentStatusAdminResponse,
  PaymentMethodAdminResponse,
} from "../model/admin-category.model"

import {
  getCitiesPaginated,
  createCity,
  updateCity,
  deleteCity,
  getVillagesPaginated,
  getAllCities,
  createVillage,
  updateVillage,
  deleteVillage,
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllBanks,
  createBank,
  updateBank,
  deleteBank,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getAllOrderStatuses,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
  getAllPaymentStatuses,
  createPaymentStatus,
  updatePaymentStatus,
  deletePaymentStatus,
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/admin-category.service"

type TabKey =
  | "customers"
  | "banks"
  | "categories"
  | "cities"
  | "villages"
  | "materials"
  | "orderStatuses"
  | "paymentStatuses"
  | "paymentMethods"

const TABS: { key: TabKey; label: string }[] = [
  { key: "customers", label: "Khách hàng" },
  { key: "banks", label: "Ngân hàng" },
  { key: "categories", label: "Danh mục SP" },
  { key: "cities", label: "Tỉnh/TP" },
  { key: "villages", label: "Xã/Phường" },
  { key: "materials", label: "Nguyên liệu" },
  { key: "orderStatuses", label: "Trạng thái ĐH" },
  { key: "paymentStatuses", label: "Trạng thái TT" },
  { key: "paymentMethods", label: "Phương thức TT" },
]

const PAGE_SIZE = 10

// ================================
// COMPONENT
// ================================

export default function AdminSystemCategories() {
  const token = localStorage.getItem("token") ?? ""
  const [form] = Form.useForm()

  const [activeTab, setActiveTab] = useState<TabKey>("customers")
  const [keyword, setKeyword] = useState("")
  const [debouncedKeyword, setDebouncedKeyword] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Data states
  const [customers, setCustomers] = useState<CustomerAdminResponse[]>([])
  const [banks, setBanks] = useState<BankAdminResponse[]>([])
  const [categories, setCategories] = useState<CategoryAdminResponse[]>([])
  const [cities, setCities] = useState<CityAdminResponse[]>([])
  const [citiesPaginated, setCitiesPaginated] = useState<{ content: CityAdminResponse[]; totalElements: number; totalPages: number } | null>(null)
  const [villages, setVillages] = useState<VillageAdminResponse[]>([])
  const [villagesPaginated, setVillagesPaginated] = useState<{ content: VillageAdminResponse[]; totalElements: number; totalPages: number } | null>(null)
  const [materials, setMaterials] = useState<MaterialAdminResponse[]>([])
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusAdminResponse[]>([])
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatusAdminResponse[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodAdminResponse[]>([])
  const [allCities, setAllCities] = useState<CityAdminResponse[]>([])

  // Debounced keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [keyword])

  // ─── Fetchers ──────────────────────────────────────────

  const fetchCustomers = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllCustomers(token)
      setCustomers(data)
    } catch { /* empty */ } finally { setLoading(false) }
  }, [token])

  const fetchBanks = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllBanks(token)
      setBanks(data)
    } catch { /* empty */ } finally { setLoading(false) }
  }, [token])

  const fetchCategories = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllCategories(token)
      setCategories(data)
    } catch { /* empty */ } finally { setLoading(false) }
  }, [token])

  const fetchCitiesPaginated = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getCitiesPaginated(token, currentPage - 1, PAGE_SIZE, debouncedKeyword)
      setCitiesPaginated(data)
      setCities(data.content)
    } catch { setCitiesPaginated(null) } finally { setLoading(false) }
  }, [token, currentPage, debouncedKeyword])

  const fetchAllCities = useCallback(async () => {
    if (!token) return
    try {
      const data = await getAllCities(token)
      setAllCities(data)
    } catch { /* empty */ }
  }, [token])

  const fetchVillagesPaginated = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getVillagesPaginated(token, currentPage - 1, PAGE_SIZE, undefined, debouncedKeyword)
      setVillagesPaginated(data)
      setVillages(data.content)
    } catch { setVillagesPaginated(null) } finally { setLoading(false) }
  }, [token, currentPage, debouncedKeyword])

  const fetchMaterials = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllMaterials(token)
      setMaterials(data)
    } catch { /* empty */ } finally { setLoading(false) }
  }, [token])

  const fetchOrderStatuses = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllOrderStatuses(token)
      setOrderStatuses(data)
    } catch { /* empty */ } finally { setLoading(false) }
  }, [token])

  const fetchPaymentStatuses = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllPaymentStatuses(token)
      setPaymentStatuses(data)
    } catch { /* empty */ } finally { setLoading(false) }
  }, [token])

  const fetchPaymentMethods = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllPaymentMethods(token)
      setPaymentMethods(data)
    } catch { /* empty */ } finally { setLoading(false) }
  }, [token])

  // ─── Main fetch dispatch ───────────────────────────────

  useEffect(() => {
    switch (activeTab) {
      case "customers": fetchCustomers(); break
      case "banks": fetchBanks(); break
      case "categories": fetchCategories(); break
      case "cities": fetchCitiesPaginated(); break
      case "villages": fetchVillagesPaginated(); break
      case "materials": fetchMaterials(); break
      case "orderStatuses": fetchOrderStatuses(); break
      case "paymentStatuses": fetchPaymentStatuses(); break
      case "paymentMethods": fetchPaymentMethods(); break
    }
  }, [activeTab, fetchCustomers, fetchBanks, fetchCategories, fetchCitiesPaginated, fetchVillagesPaginated, fetchMaterials, fetchOrderStatuses, fetchPaymentStatuses, fetchPaymentMethods])

  // Fetch all cities for village form
  useEffect(() => {
    if (modalOpen && activeTab === "villages") {
      fetchAllCities()
    }
  }, [modalOpen, activeTab, fetchAllCities])

  // ─── Tab change ────────────────────────────────────────

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
    setKeyword("")
    setDebouncedKeyword("")
    setCurrentPage(1)
    setEditingId(null)
  }

  // ─── Modal ─────────────────────────────────────────────

  const openAddModal = () => {
    setEditingId(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEditModal = (id: string | number, record: Record<string, unknown>) => {
    setEditingId(id)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingId(null)
    form.resetFields()
  }

  // ─── Submit ────────────────────────────────────────────

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      switch (activeTab) {
        case "customers": {
          if (editingId) {
            await updateCustomer(token, editingId as number, values)
            message.success("Cập nhật khách hàng thành công")
          } else {
            await createCustomer(token, values)
            message.success("Thêm khách hàng thành công")
          }
          fetchCustomers()
          break
        }
        case "banks": {
          if (editingId) {
            await updateBank(token, editingId as string, values)
            message.success("Cập nhật ngân hàng thành công")
          } else {
            await createBank(token, values)
            message.success("Thêm ngân hàng thành công")
          }
          fetchBanks()
          break
        }
        case "categories": {
          if (editingId) {
            await updateCategory(token, editingId as number, values)
            message.success("Cập nhật danh mục thành công")
          } else {
            await createCategory(token, values)
            message.success("Thêm danh mục thành công")
          }
          fetchCategories()
          break
        }
        case "cities": {
          if (editingId) {
            await updateCity(token, editingId as number, values)
            message.success("Cập nhật tỉnh/thành phố thành công")
          } else {
            await createCity(token, values)
            message.success("Thêm tỉnh/thành phố thành công")
          }
          fetchCitiesPaginated()
          break
        }
        case "villages": {
          const city = allCities.find((c) => c.cityId === values.cityId)
          const payload = {
            villageId: values.villageId,
            villageName: values.villageName,
            villageLevel: values.villageLevel,
            cityRequest: { cityId: values.cityId, cityName: city?.cityName ?? "", cityLevel: city?.cityLevel ?? "" },
          }
          if (editingId) {
            await updateVillage(token, editingId as number, payload)
            message.success("Cập nhật xã/phường thành công")
          } else {
            await createVillage(token, payload)
            message.success("Thêm xã/phường thành công")
          }
          fetchVillagesPaginated()
          break
        }
        case "materials": {
          if (editingId) {
            await updateMaterial(token, editingId as number, values)
            message.success("Cập nhật nguyên liệu thành công")
          } else {
            await createMaterial(token, values)
            message.success("Thêm nguyên liệu thành công")
          }
          fetchMaterials()
          break
        }
        case "orderStatuses": {
          if (editingId) {
            await updateOrderStatus(token, editingId as number, values)
            message.success("Cập nhật trạng thái đơn hàng thành công")
          } else {
            await createOrderStatus(token, values)
            message.success("Thêm trạng thái đơn hàng thành công")
          }
          fetchOrderStatuses()
          break
        }
        case "paymentStatuses": {
          if (editingId) {
            await updatePaymentStatus(token, editingId as number, values)
            message.success("Cập nhật trạng thái thanh toán thành công")
          } else {
            await createPaymentStatus(token, values)
            message.success("Thêm trạng thái thanh toán thành công")
          }
          fetchPaymentStatuses()
          break
        }
        case "paymentMethods": {
          if (editingId) {
            await updatePaymentMethod(token, editingId as number, values)
            message.success("Cập nhật phương thức thanh toán thành công")
          } else {
            await createPaymentMethod(token, values)
            message.success("Thêm phương thức thanh toán thành công")
          }
          fetchPaymentMethods()
          break
        }
      }
      handleModalClose()
    } catch {
      // validation error or API error
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Delete ────────────────────────────────────────────

  const handleDelete = async (id: string | number) => {
    try {
      switch (activeTab) {
        case "customers": await deleteCustomer(token, id as number); fetchCustomers(); break
        case "banks": await deleteBank(token, id as string); fetchBanks(); break
        case "categories": await deleteCategory(token, id as number); fetchCategories(); break
        case "cities": await deleteCity(token, id as number); fetchCitiesPaginated(); break
        case "villages": await deleteVillage(token, id as number); fetchVillagesPaginated(); break
        case "materials": await deleteMaterial(token, id as number); fetchMaterials(); break
        case "orderStatuses": await deleteOrderStatus(token, id as number); fetchOrderStatuses(); break
        case "paymentStatuses": await deletePaymentStatus(token, id as number); fetchPaymentStatuses(); break
        case "paymentMethods": await deletePaymentMethod(token, id as number); fetchPaymentMethods(); break
      }
      message.success("Xóa thành công")
    } catch {
      message.error("Xóa thất bại")
    }
  }

  // ─── Client-side filter for non-paginated tabs ─────────

  const clientFilter = <T extends Record<string, unknown>>(data: T[], fields: string[]): T[] => {
    if (!debouncedKeyword) return data
    const lower = debouncedKeyword.toLowerCase()
    return data.filter((item) =>
      fields.some((f) => String(item[f] ?? "").toLowerCase().includes(lower))
    )
  }

  // ─── Search placeholder ────────────────────────────────

  const searchPlaceholder: Record<TabKey, string> = {
    customers: "Tìm kiếm khách hàng...",
    banks: "Tìm kiếm ngân hàng...",
    categories: "Tìm kiếm danh mục sản phẩm...",
    cities: "Tìm kiếm tỉnh/thành phố...",
    villages: "Tìm kiếm xã/phường/thị trấn...",
    materials: "Tìm kiếm nguyên liệu...",
    orderStatuses: "Tìm kiếm trạng thái đơn hàng...",
    paymentStatuses: "Tìm kiếm trạng thái thanh toán...",
    paymentMethods: "Tìm kiếm phương thức thanh toán...",
  }

  // ─── Get current data & pagination info ────────────────

  const isPaginated = activeTab === "cities" || activeTab === "villages"
  let displayData: Record<string, unknown>[] = []
  let totalElements = 0

  switch (activeTab) {
    case "customers":
      displayData = clientFilter(customers as unknown as Record<string, unknown>[], ["username", "email", "numberPhone"])
      totalElements = displayData.length
      break
    case "banks":
      displayData = clientFilter(banks as unknown as Record<string, unknown>[], ["bankId", "bankShortName", "bankName"])
      totalElements = displayData.length
      break
    case "categories":
      displayData = clientFilter(categories as unknown as Record<string, unknown>[], ["categoryName"])
      totalElements = displayData.length
      break
    case "cities":
      displayData = cities as unknown as Record<string, unknown>[]
      totalElements = citiesPaginated?.totalElements ?? 0
      break
    case "villages":
      displayData = villages as unknown as Record<string, unknown>[]
      totalElements = villagesPaginated?.totalElements ?? 0
      break
    case "materials":
      displayData = clientFilter(materials as unknown as Record<string, unknown>[], ["materialName"])
      totalElements = displayData.length
      break
    case "orderStatuses":
      displayData = clientFilter(orderStatuses as unknown as Record<string, unknown>[], ["orderStatusName"])
      totalElements = displayData.length
      break
    case "paymentStatuses":
      displayData = clientFilter(paymentStatuses as unknown as Record<string, unknown>[], ["paymentStatusName"])
      totalElements = displayData.length
      break
    case "paymentMethods":
      displayData = clientFilter(paymentMethods as unknown as Record<string, unknown>[], ["paymentMethodName"])
      totalElements = displayData.length
      break
  }

  const totalPages = isPaginated
    ? (activeTab === "cities" ? citiesPaginated?.totalPages ?? 0 : villagesPaginated?.totalPages ?? 0)
    : Math.ceil(totalElements / PAGE_SIZE)

  const paginatedData = isPaginated
    ? displayData
    : displayData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const paginationInfo = {
    from: totalElements === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1,
    to: Math.min(currentPage * PAGE_SIZE, totalElements),
    total: totalElements,
  }

  // ─── Refresh callback for paginated tabs ───────────────

  const refetchCurrent = () => {
    switch (activeTab) {
      case "customers": fetchCustomers(); break
      case "banks": fetchBanks(); break
      case "categories": fetchCategories(); break
      case "cities": fetchCitiesPaginated(); break
      case "villages": fetchVillagesPaginated(); break
      case "materials": fetchMaterials(); break
      case "orderStatuses": fetchOrderStatuses(); break
      case "paymentStatuses": fetchPaymentStatuses(); break
      case "paymentMethods": fetchPaymentMethods(); break
    }
  }

  // ─── Modal title & form fields ─────────────────────────

  const modalTitle = editingId ? "Chỉnh sửa" : "Thêm mới"

  const renderFormFields = () => {
    switch (activeTab) {
      case "customers":
        return (
          <>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: "Vui lòng nhập username" }]}>
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}>
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item name="numberPhone" label="Số điện thoại" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: "10 chữ số" }]}>
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: !editingId, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,255}$/, message: "Chữ hoa, chữ thường và số, tối thiểu 8 ký tự" }]}>
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item name="nationalId" label="CCCD">
              <Input placeholder="12 chữ số" maxLength={12} />
            </Form.Item>
            <Form.Item name="accumulatedEcoPoints" label="Điểm eco" initialValue={0}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </>
        )
      case "banks":
        return (
          <>
            <Form.Item name="bankId" label="Mã ngân hàng" rules={[{ required: true, message: "Vui lòng nhập mã ngân hàng" }]}>
              <Input placeholder="VD: VCB" />
            </Form.Item>
            <Form.Item name="bankShortName" label="Tên viết tắt" rules={[{ required: true, message: "Vui lòng nhập tên viết tắt" }]}>
              <Input placeholder="VD: Vietcombank" />
            </Form.Item>
            <Form.Item name="bankName" label="Tên đầy đủ">
              <Input placeholder="Tên đầy đủ ngân hàng" />
            </Form.Item>
          </>
        )
      case "categories":
        return (
          <Form.Item name="categoryName" label="Tên danh mục" rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}>
            <Input placeholder="Tên danh mục sản phẩm" />
          </Form.Item>
        )
      case "cities":
        return (
          <>
            <Form.Item name="cityId" label="Mã tỉnh/thành" rules={[{ required: true, message: "Vui lòng nhập mã" }]}>
              <InputNumber className="w-full" placeholder="Mã tỉnh/thành" />
            </Form.Item>
            <Form.Item name="cityName" label="Tên tỉnh/thành phố" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Input placeholder="Tên tỉnh/thành phố" />
            </Form.Item>
            <Form.Item name="cityLevel" label="Cấp" rules={[{ required: true, message: "Vui lòng nhập cấp" }]}>
              <Input placeholder="VD: Tỉnh, Thành phố trực thuộc TW" />
            </Form.Item>
          </>
        )
      case "villages":
        return (
          <>
            <Form.Item name="villageId" label="Mã xã" rules={[{ required: true, message: "Vui lòng nhập mã" }]}>
              <InputNumber className="w-full" placeholder="Mã xã" />
            </Form.Item>
            <Form.Item name="villageName" label="Tên xã/phường/thị trấn" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Input placeholder="Tên xã/phường/thị trấn" />
            </Form.Item>
            <Form.Item name="villageLevel" label="Cấp" rules={[{ required: true, message: "Vui lòng nhập cấp" }]}>
              <Input placeholder="VD: Xã, Phường, Thị trấn" />
            </Form.Item>
            <Form.Item name="cityId" label="Tỉnh/Thành phố" rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}>
              <Select placeholder="Chọn tỉnh/thành phố" showSearch optionFilterProp="label">
                {allCities.map((c) => (
                  <Select.Option key={c.cityId} value={c.cityId} label={c.cityName}>
                    {c.cityName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )
      case "materials":
        return (
          <>
            <Form.Item name="materialName" label="Tên nguyên liệu" rules={[{ required: true, message: "Vui lòng nhập tên nguyên liệu" }]}>
              <Input placeholder="Tên nguyên liệu" />
            </Form.Item>
            <Form.Item name="emissionIndex" label="Hệ số phát thải" rules={[{ required: true, message: "Vui lòng nhập hệ số phát thải" }]}>
              <InputNumber min={0} step={0.1} className="w-full" placeholder="0.0" />
            </Form.Item>
          </>
        )
      case "orderStatuses":
        return (
          <Form.Item name="orderStatusName" label="Tên trạng thái" rules={[{ required: true, message: "Vui lòng nhập tên trạng thái" }]}>
            <Input placeholder="VD: PENDING, CONFIRMED, SHIPPING..." />
          </Form.Item>
        )
      case "paymentStatuses":
        return (
          <Form.Item name="paymentStatusName" label="Tên trạng thái" rules={[{ required: true, message: "Vui lòng nhập tên trạng thái" }]}>
            <Input placeholder="VD: PAID, UNPAID, FAILED" />
          </Form.Item>
        )
      case "paymentMethods":
        return (
          <>
            <Form.Item name="paymentMethodName" label="Tên phương thức" rules={[{ required: true, message: "Vui lòng nhập tên phương thức" }]}>
              <Input placeholder="VD: COD, Banking, MOMO..." />
            </Form.Item>
            <Form.Item name="online" label="Thanh toán online" valuePropName="checked" initialValue={false}>
              <Switch />
            </Form.Item>
          </>
        )
      default:
        return null
    }
  }

  // ─── Table columns per tab ─────────────────────────────

  const getIdKey = (item: Record<string, unknown>): string | number => {
    switch (activeTab) {
      case "customers": return item.userId as number
      case "banks": return item.bankId as string
      case "categories": return item.categoryId as number
      case "cities": return item.cityId as number
      case "villages": return item.villageId as number
      case "materials": return item.materialId as number
      case "orderStatuses": return item.orderStatusId as number
      case "paymentStatuses": return item.paymentStatusId as number
      case "paymentMethods": return item.paymentMethodId as number
      default: return 0
    }
  }

  const renderTableHeader = () => {
    switch (activeTab) {
      case "customers":
        return <><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Username</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">SĐT</th><th className="px-4 py-3">Điểm eco</th><th className="px-4 py-3 text-center">Thao tác</th></>
      case "banks":
        return <><th className="px-4 py-3">Mã NH</th><th className="px-4 py-3">Tên viết tắt</th><th className="px-4 py-3">Tên đầy đủ</th><th className="px-4 py-3 text-center">Thao tác</th></>
      case "categories":
        return <><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Tên danh mục</th><th className="px-4 py-3 text-center">Thao tác</th></>
      case "cities":
        return <><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Tên tỉnh/thành phố</th><th className="px-4 py-3">Cấp</th><th className="px-4 py-3 text-center">Thao tác</th></>
      case "villages":
        return <><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Tên xã/phường</th><th className="px-4 py-3">Cấp</th><th className="px-4 py-3">Tỉnh/TP</th><th className="px-4 py-3 text-center">Thao tác</th></>
      case "materials":
        return <><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Tên nguyên liệu</th><th className="px-4 py-3">Hệ số phát thải</th><th className="px-4 py-3 text-center">Thao tác</th></>
      case "orderStatuses":
        return <><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Tên trạng thái</th><th className="px-4 py-3 text-center">Thao tác</th></>
      case "paymentStatuses":
        return <><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Tên trạng thái</th><th className="px-4 py-3 text-center">Thao tác</th></>
      case "paymentMethods":
        return <><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Tên phương thức</th><th className="px-4 py-3">Online</th><th className="px-4 py-3 text-center">Thao tác</th></>
      default:
        return null
    }
  }

  const renderTableBody = () => {
    if (paginatedData.length === 0) {
      const colCount = activeTab === "villages" ? 5 : activeTab === "customers" ? 6 : activeTab === "banks" || activeTab === "cities" || activeTab === "paymentMethods" ? 4 : activeTab === "materials" ? 4 : 3
      return <tr><td colSpan={colCount} className="px-4 py-8 text-center text-gray-400">Không tìm thấy dữ liệu</td></tr>
    }

    return paginatedData.map((item) => {
      const id = getIdKey(item)
      return (
        <tr key={id} className="border-b hover:bg-green-50/50">
          {activeTab === "customers" && (
            <>
              <td className="px-4 py-3">{item.userId as number}</td>
              <td className="px-4 py-3 font-medium">{item.username as string}</td>
              <td className="px-4 py-3">{item.email as string}</td>
              <td className="px-4 py-3">{item.numberPhone as string}</td>
              <td className="px-4 py-3">{item.accumulatedEcoPoints as number}</td>
            </>
          )}
          {activeTab === "banks" && (
            <>
              <td className="px-4 py-3">{item.bankId as string}</td>
              <td className="px-4 py-3 font-medium">{item.bankShortName as string}</td>
              <td className="px-4 py-3">{item.bankName as string}</td>
            </>
          )}
          {activeTab === "categories" && (
            <>
              <td className="px-4 py-3">{item.categoryId as number}</td>
              <td className="px-4 py-3 font-medium">{item.categoryName as string}</td>
            </>
          )}
          {activeTab === "cities" && (
            <>
              <td className="px-4 py-3">{item.cityId as number}</td>
              <td className="px-4 py-3 font-medium">{item.cityName as string}</td>
              <td className="px-4 py-3">{item.cityLevel as string}</td>
            </>
          )}
          {activeTab === "villages" && (
            <>
              <td className="px-4 py-3">{item.villageId as number}</td>
              <td className="px-4 py-3 font-medium">{item.villageName as string}</td>
              <td className="px-4 py-3">{item.villageLevel as string}</td>
              <td className="px-4 py-3">{item.cityName as string}</td>
            </>
          )}
          {activeTab === "materials" && (
            <>
              <td className="px-4 py-3">{item.materialId as number}</td>
              <td className="px-4 py-3 font-medium">{item.materialName as string}</td>
              <td className="px-4 py-3">{item.emissionIndex as number}</td>
            </>
          )}
          {activeTab === "orderStatuses" && (
            <>
              <td className="px-4 py-3">{item.orderStatusId as number}</td>
              <td className="px-4 py-3 font-medium">{item.orderStatusName as string}</td>
            </>
          )}
          {activeTab === "paymentStatuses" && (
            <>
              <td className="px-4 py-3">{item.paymentStatusId as number}</td>
              <td className="px-4 py-3 font-medium">{item.paymentStatusName as string}</td>
            </>
          )}
          {activeTab === "paymentMethods" && (
            <>
              <td className="px-4 py-3">{item.paymentMethodId as number}</td>
              <td className="px-4 py-3 font-medium">{item.paymentMethodName as string}</td>
              <td className="px-4 py-3">{item.online ? "✓" : "✗"}</td>
            </>
          )}
          <td className="px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => openEditModal(id, item)}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                title="Chỉnh sửa"
              >
                <Pencil size={15} />
              </button>
              <Popconfirm
                title="Xác nhận xóa?"
                onConfirm={() => handleDelete(id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <button
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Xóa"
                >
                  <Trash2 size={15} />
                </button>
              </Popconfirm>
            </div>
          </td>
        </tr>
      )
    })
  }

  // ─── RENDER ────────────────────────────────────────────

  return (
    <div className="admin_system-categories mt-20">
      {/* HEADER SEARCH */}
      <header className="adm_system--search p-4 rounded-2xl shadow-md bg-white">
        <div className="search_group relative flex items-center gap-2 w-full">
          <Search className="text-green-800 absolute top-1/2 left-1 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder[activeTab]}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search_input w-full px-4 py-2 pl-8 rounded-lg border border-green-200 focus:outline-none focus:ring-1"
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mt-4">
        {/* TABS + ADD BUTTON */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-green-700 text-white"
                    : "bg-white text-green-700 border border-green-300 hover:bg-green-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>

        {/* TABLE */}
        <Spin spinning={loading}>
          <div className="bg-white p-4 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              Danh sách {TABS.find((t) => t.key === activeTab)?.label}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-green-800 uppercase bg-green-50">
                  <tr>{renderTableHeader()}</tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalElements > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-t border-emerald-100/60 mt-4">
                <span className="text-sm text-gray-500">
                  Hiển thị <b>{paginationInfo.from}</b> - <b>{paginationInfo.to}</b> / <b>{paginationInfo.total}</b> bản ghi
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    size="small"
                  >
                    Trước
                  </Button>
                  <Pagination
                    current={currentPage}
                    total={totalElements}
                    pageSize={PAGE_SIZE}
                    showSizeChanger={false}
                    size="small"
                    onChange={(page) => setCurrentPage(page)}
                  />
                  <Button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    size="small"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Spin>
      </main>

      {/* ADD / EDIT MODAL */}
      <Modal
        title={`${modalTitle} ${TABS.find((t) => t.key === activeTab)?.label}`}
        open={modalOpen}
        onCancel={handleModalClose}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editingId ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          {renderFormFields()}
        </Form>
      </Modal>
    </div>
  )
}
