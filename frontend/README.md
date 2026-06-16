# 🛒 Sustainable Products System — Frontend

Mã nguồn phía Client (Frontend) của hệ thống Quản lý Sản phẩm Bền vững (**Sustainable Products System**). Dự án được xây dựng dựa trên các tiêu chuẩn phát triển phần mềm doanh nghiệp, sử dụng cấu trúc chia theo thành phần kỹ thuật (**Technical/Component-Based Architecture**), kiểm soát chất lượng mã nguồn tự động và tối ưu hóa kết nối bất đồng bộ với hệ thống **Java Spring Boot API**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

* **Core Framework:** ReactJS (v18+) & TypeScript (v5+)
* **Build Tool:** Vite (Siêu tốc độ, cấu hình tối ưu)
* **Quản lý State API:** TanStack Query v5 (React Query) — Caching, Tự động Refetch, Giảm tải Server.
* **HTTP Client:** Axios (Cấu hình luồng Interceptors, Tự động gài JWT Bearer Token, Xử lý Refresh Token).
* **Định dạng & Linting:** ESLint (Flat Config) + Prettier + Husky + Lint-staged (Chặn commit code bẩn).
* **Kiểm soát Form:** React Hook Form + Zod Schema Validation.
* **Styling:** Tailwind CSS.

---

## 📁 Kiến Trúc Thư Mục (Component-Based Architecture)

Mã nguồn được tổ chức theo vai trò kỹ thuật (Folders by Technical Role). Toàn bộ các file cùng loại (như giao diện, logic gọi api, định nghĩa kiểu) sẽ được gom chung về một thư mục tổng:

```text
src/
├── apis/               # Nơi chứa tất cả các file gọi API tới Spring Boot (productApi.ts, userApi.ts...)
├── assets/             # Hình ảnh, icons, fonts, svg tĩnh
├── components/         # Giao diện (UI Components) chia theo mức độ tái sử dụng
│   ├── common/         # Các nút bấm, ô nhập liệu dùng chung toàn sàn (Button, Input, Modal...)
│   ├── products/       # Các component liên quan tới sản phẩm (ProductCard, ProductGrid...)
│   └── users/          # Các component liên quan tới người dùng (UserTable, UserAvatar...)
├── config/             # Biến môi trường, cấu hình SDK bên thứ 3
├── hooks/              # Custom hooks toàn cục xử lý logic (useAuth, useDebounce, useLocalStorage...)
├── layouts/            # Các khung bọc giao diện (MainLayout, AuthLayout, AdminLayout)
├── lib/                # Cấu hình khởi tạo thư viện bên thứ 3 (axios.ts, queryClient.ts)
├── pages/              # Các màn hình lớn/trang hoàn chỉnh (HomePage, ProductDetailPage, LoginPage...)
├── routes/             # Cấu hình định tuyến, phân quyền URL (React Router Dom)
├── types/              # Định nghĩa các Interface/Type TypeScript (product.ts, user.ts...)
└── utils/              # Các hàm bổ trợ helper (format tiền tệ, xử lý date-time...)