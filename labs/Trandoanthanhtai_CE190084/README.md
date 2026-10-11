# FUNews Management System (FUNMS)
> **Học phần**: SBA301 – Integrate Single Page Application with Spring Boot  
> **Bài tập**: Assignment 01 – Working with ReactJS Application  
> **Chuẩn đầu ra**: CLO1 (React SPA Frontend), CLO2 (State Management & Data CRUD)  

---

## 1. Giới thiệu tổng quan
**FUNews Management System** là ứng dụng Single Page Application (SPA) xây dựng bằng **ReactJS** và **Vite**, phục vụ công tác quản trị biên tập tin bài, phân loại chuyên mục và phân quyền người dùng tại môi trường đào tạo FPT University.

Ứng dụng được thiết kế theo cấu trúc **gọn gàng, trực quan và đúng chuẩn môn học**:
- Quản lý trạng thái bằng **React State** tập trung tại `App.jsx`.
- Lưu trữ và đồng bộ dữ liệu qua **LocalStorage API** (F5/Reload không mất dữ liệu).
- Sử dụng popup dialog đơn giản (`Modal.jsx`) cho cả thao tác Thêm, Sửa và Xác nhận Xóa.
- Tìm kiếm không phá hủy mảng dữ liệu gốc.
- Dễ dàng giải thích luồng thực thi trong buổi đánh giá vấn đáp.

---

## 2. Thông tin tài khoản kiểm thử (Credentials)

| Tài khoản | Username | Password | Role | Phạm vi quyền hạn |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên** | `Admin` | `Admin` | Role 1 (Admin) | Toàn quyền quản trị Dashboard, Category, News, Users, Settings |
| **Biên tập viên** | `Staff` | `Staff` | Role 2 (Staff) | Quản lý tin bài, danh mục |

> **Tiện ích kiểm thử**: Trang Đăng nhập có sẵn 2 nút **"Điền nhanh Admin"** và **"Điền nhanh Staff"** để test nhanh chóng chỉ với 1 click.

---

## 3. Hướng dẫn cài đặt & Khởi chạy dự án

### Các bước thực hiện
1. **Cài đặt các gói phụ thuộc (Dependencies)**:
   ```bash
   npm install
   ```

2. **Khởi chạy máy chủ phát triển (Development Server)**:
   ```bash
   npm run dev
   ```

3. **Truy cập ứng dụng**:
   Mở trình duyệt: [http://localhost:5173/](http://localhost:5173/)

4. **Kiểm tra build production**:
   ```bash
   npm run build
   ```

---

## 4. Bảng tính năng cốt lõi (Traceability Matrix)

| Mã Yêu Cầu | Tên Yêu Cầu | Trạng thái | Vị trí hiện thực |
| :--- | :--- | :---: | :--- |
| **R01** | ReactJS + Vite chuẩn cấu trúc | **Đạt** | `package.json`, `vite.config.js` |
| **R02** | Login page (Controlled inputs, validate rỗng/sai) | **Đạt** | `src/pages/LoginPage.jsx` |
| **R03** | Auth state + Điều hướng sau khi đăng nhập | **Đạt** | `src/App.jsx` |
| **R04** | Logo FUNews tạo bằng AI | **Đạt** | `src/assets/logo.jpg`, `Header.jsx` |
| **R05** | Master Layout (Header + User Info + Logout) | **Đạt** | `src/components/Header.jsx` |
| **R06** | Sidebar Navigation (5 mục theo yêu cầu đề) | **Đạt** | `src/components/Sidebar.jsx` |
| **R07** | Category CRUD + Search (Create/Edit modal, Delete confirm) | **Đạt** | `src/pages/CategoryManagement.jsx` |
| **R08** | News CRUD + Search (Liên kết dropdown Category) | **Đạt** | `src/pages/NewsManagement.jsx` |
| **R09** | User CRUD + Search (Phân quyền Role 1 / Role 2) | **Đạt** | `src/pages/UserManagement.jsx` |
| **R10** | Create / Update thao tác bằng Popup Modal Dialog | **Đạt** | `src/components/Modal.jsx` |
| **R11** | Confirmation Modal khi xóa dữ liệu | **Đạt** | `src/components/Modal.jsx` |
| **R12** | Mô hình dữ liệu chuẩn (categoryId, Role 1/2, Status 0/1) | **Đạt** | `src/data/initialData.js` |

---

## 5. Cấu trúc thư mục tinh gọn

```text
src/
├── assets/
│   └── logo.jpg               # Logo AI thương hiệu FUNews
├── components/
│   ├── Header.jsx             # Thanh tiêu đề, thông tin user, nút Đăng xuất
│   ├── Sidebar.jsx            # Menu điều hướng 5 khu vực quản lý
│   └── Modal.jsx              # Popup Modal dùng chung cho form và confirm xóa
├── data/
│   └── initialData.js         # Dữ liệu mẫu ban đầu & hàm đọc/ghi LocalStorage
├── pages/
│   ├── LoginPage.jsx          # Màn hình đăng nhập (Admin/Admin, Staff/Staff)
│   ├── DashboardPage.jsx      # Tổng quan thống kê (Categories, News, Users)
│   ├── CategoryManagement.jsx # Quản lý Chuyên mục (CRUD + Tìm kiếm + Modal)
│   ├── NewsManagement.jsx     # Quản lý Tin bài (CRUD + Tìm kiếm + Dropdown Category)
│   ├── UserManagement.jsx     # Quản lý Người dùng & Phân quyền Role 1/2
│   └── SettingsPage.jsx       # Xem phiên đăng nhập, Khôi phục dữ liệu gốc
├── App.jsx                    # Root: Quản lý Auth State, Navigation và CRUD
├── index.css                  # CSS hệ thống gọn gàng, trực quan, chuyên nghiệp
└── main.jsx                   # Khởi tạo React
```

---

## 6. Thiết kế giải pháp kỹ thuật (Solution Design & Reasoning)

1. **State Ownership**:
   - Dữ liệu `categories`, `news`, `users` và phiên đăng nhập `currentUser` được đặt tại `App.jsx` và truyền xuống các trang. Cách này trực quan, không dùng thư viện ngoài phức tạp, chuẩn kiến thức React cơ bản.
   - Form state (`formData`), từ khóa tìm kiếm (`searchTerm`), trạng thái mở modal (`isFormOpen`) đặt là **Local State** trong từng trang.

2. **Tính bất biến (Immutable State Updates)**:
   - Thêm mới: `[newItem, ...prevList]` (Spread operator).
   - Sửa: `list.map(item => item.id === id ? { ...item, ...data } : item)`.
   - Xóa: `list.filter(item => item.id !== id)`.

3. **Tìm kiếm không làm mất dữ liệu gốc**:
   - Sử dụng `filter()` dựa trên mảng gốc và từ khóa tìm kiếm, không bao giờ ghi đè lên mảng gốc. Khi xóa ô tìm kiếm, toàn bộ danh sách hiển thị trở lại bình thường.

4. **Lưu trữ dữ liệu (Persistence)**:
   - Dữ liệu tự động đồng bộ vào `localStorage` qua `useEffect` trong `App.jsx`, giúp F5 không bị mất dữ liệu vừa thêm/sửa/xóa.

---

## 7. Nhật ký sử dụng AI có kiểm soát (AI Usage Log)
- **Công cụ hỗ trợ**: Google DeepMind Agentic Assistant
- **Phần áp dụng**:
  1. Tạo hình ảnh logo thương hiệu `FUNews Management System` (`src/assets/logo.jpg`).
  2. Tinh gọn cấu trúc thư mục từ phức tạp sang chuẩn bài tập sinh viên thực tế.
  3. Lập bảng ma trận kiểm thử 35 test cases (`TEST_MATRIX.md`).
- **Cách kiểm chứng**: Kiểm tra trực tiếp trên trình duyệt, chạy `npm run build` xác nhận không có lỗi cảnh báo.
