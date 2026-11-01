# FUNews Management System (FUNMS)
> **Môn học**: SBA301 – Integrate Single Page Application with Spring Boot  
> **Bài tập**: Assignment 01 – Working with ReactJS Application  
> **Sinh viên**: Trần Đoàn Thanh Tài (CE190084)  
> **Kiến trúc**: ReactJS (SPA) + Vite • Quản lý State tập trung • Đồng bộ LocalStorage  

---

# BẢN TÓM TẮT PHỤC VỤ VẤN ĐÁP BẢO VỆ CODE (INTERVIEW SUMMARY)
*(Sinh viên trình bày theo đúng 4 phần chuẩn rubric bên dưới để đạt điểm tuyệt đối)*

---

## PHẦN 1: BÀI TOÁN & YÊU CẦU NGHIỆP VỤ (Problem Statement)

* **Bối cảnh**: Tòa soạn trường Đại học FPT cần một hệ thống quản trị tin tức nội bộ **FUNews Management System** dạng Single Page Application (SPA) mượt mà, trực quan, không bị tải lại trang.
* **Đối tượng sử dụng (Actors)**:
  1. **Quản trị viên (Admin - Role 1)**: Toàn quyền quản trị Dashboard thống kê, Chuyên mục, Tin bài, Người dùng và Cài đặt hệ thống.
  2. **Biên tập viên (Staff - Role 2)**: Quản lý tin bài và chuyên mục.
* **Các yêu cầu nghiệp vụ cốt lõi**:
  - Xác thực tài khoản đăng nhập và phân quyền truy cập.
  - Quản lý Chuyên mục (Categories): Thêm, Sửa, Xóa, Tìm kiếm.
  - Quản lý Tin bài (News): Thêm, Sửa, Xóa, Tìm kiếm, Đọc chi tiết bài viết (Popup Detail), liên kết khóa ngoại với Chuyên mục (`categoryId`).
  - Quản lý Người dùng (Users): Phân quyền Role 1/Role 2, Trạng thái Hoạt động/Khóa (Status 1/0).
  - Đảm bảo dữ liệu lưu trữ bền vững (F5 reload không mất dữ liệu).

---

## PHẦN 2: CÁC CÁCH GIẢI QUYẾT KỸ THUẬT (Solution Approaches)

1. **Kiến trúc State Lifting (Đưa State lên Component cha)**:
   - Toàn bộ dữ liệu nguồn (`categories`, `news`, `users`, `currentUser`) được đặt tập trung tại `App.jsx` làm **Single Source of Truth**.
   - Dữ liệu truyền xuống các trang con qua **Props**; hành động nghiệp vụ gửi ngược lên cha qua **Callback Functions** (`onAdd`, `onUpdate`, `onDelete`). Code phân tách rõ ràng, không phụ thuộc thư viện ngoài cồng kềnh.
2. **Lưu trữ dữ liệu bền vững (Persistence via LocalStorage)**:
   - Sử dụng React Hook `useEffect` lắng nghe mọi biến động của State để tự động đồng bộ vào `localStorage` của trình duyệt. F5 không bao giờ mất dữ liệu.
3. **Cập nhật State Bất biến (Immutable Updates)**:
   - Thêm mới: Dùng Spread Operator `[{ id: nextId, ...newItem }, ...list]`.
   - Chỉnh sửa: Dùng hàm `list.map(item => item.id === id ? { ...item, ...data } : item)`.
   - Xóa: Dùng hàm `list.filter(item => item.id !== id)`.
   - Giúp React nhận biết thay đổi tham chiếu bộ nhớ để re-render giao diện tức thì.
4. **Tái sử dụng Component linh hoạt (`Modal.jsx`)**:
   - Sử dụng kỹ thuật **Component Composition** qua prop `children` và `e.stopPropagation()`. Chỉ một component `Modal.jsx` (26 dòng) nhưng được tái sử dụng tới **7 lần** trên 3 trang cho: Form Thêm/Sửa, Hộp thoại Xác nhận Xóa và Popup Xem chi tiết.
5. **Tìm kiếm dữ liệu không phá hủy (Derived State)**:
   - Sử dụng biến dẫn xuất `filteredList = list.filter(...)` dựa trên từ khóa tìm kiếm. Mảng dữ liệu gốc luôn được bảo toàn nguyên vẹn.

---

## PHẦN 3: LUỒNG CHẠY CỦA HỆ THỐNG (Step-by-Step Runtime Flow)

```text
[1. Khởi động Web] ──> [App.jsx đọc LocalStorage / Nạp initialData.js]
                             │
                             ▼
                   [Kiểm tra currentUser?]
                    ├── Chưa có ──> [Hiển thị LoginPage.jsx] ──> [Nhập Admin/Staff] ──> [onLogin]
                    │                                                                      │
                    └── Đã có ◄────────────────────────────────────────────────────────────┘
                         │
                         ▼
             [Hiển thị Master Layout]
             ├── Header.jsx (Hiện tên, Role badge, nút Đăng xuất)
             ├── Sidebar.jsx (Menu chọn Tab, huy hiệu số lượng)
             └── Khu vực trang chính (renderCurrentPage theo activeTab)
                         │
                         ▼
             [Thao tác Nghiệp vụ CRUD (Ví dụ: Tin bài)]
             ├── Trang con nhận dữ liệu qua Props (news, categories)
             ├── Tìm kiếm: filter tại chỗ cập nhật bảng
             ├── Xem chi tiết: Gán viewTarget -> Mở Modal chi tiết
             ├── Thêm / Sửa: Gán formData -> Mở Modal Form -> Validate -> Gửi onAdd / onUpdate lên App.jsx
             ├── Xóa: Gán deleteTarget -> Mở Modal xác nhận -> Bấm Đồng ý -> Gửi onDelete lên App.jsx
             └── App.jsx cập nhật State bất biến ──> useEffect tự động ghi vào LocalStorage ──> Bảng re-render tức thì
```

---

## PHẦN 4: BẢNG TRUY VẾT MÃ NGUỒN (Code Traceability & Line Mapping)

| Chức năng | File xử lý | Vị trí dòng code | Hàm / Logic cụ thể |
| :--- | :--- | :--- | :--- |
| **Nạp dữ liệu & Đọc LocalStorage** | `src/data/initialData.js`<br>`src/App.jsx` | `initialData.js`: Dòng 68–77<br>`App.jsx`: Dòng 40–42 | Hàm `loadData()` kiểm tra LocalStorage, nếu rỗng thì nạp dữ liệu mẫu ban đầu. |
| **Tự động lưu LocalStorage** | `src/App.jsx` | Dòng 45–55 | 3 hook `useEffect` lắng nghe `[categories]`, `[news]`, `[users]` để gọi `saveData()`. |
| **Xác thực Đăng nhập (Mock Auth)** | `src/pages/LoginPage.jsx` | Dòng 16–45 | Hàm `handleSubmit`: Validate rỗng, so khớp `Admin`/`Admin` (Role 1), `Staff`/`Staff` (Role 2) và gọi `onLogin()`. |
| **Cổng chặn Auth & Lưu Session** | `src/App.jsx` | Dòng 58–62<br>Dòng 122–124 | `if (!currentUser) return <LoginPage />`; hàm `handleLogin` lưu user vào State và `localStorage`. |
| **Đăng xuất tài khoản** | `src/components/Header.jsx`<br>`src/App.jsx` | `Header.jsx`: Dòng 26–28<br>`App.jsx`: Dòng 64–67 | Nút "Đăng xuất" gọi `onLogout` $\rightarrow$ `handleLogout` xóa `currentUser` và LocalStorage. |
| **Điều hướng trang (Navigation)** | `src/components/Sidebar.jsx`<br>`src/App.jsx` | `Sidebar.jsx`: Dòng 28<br>`App.jsx`: Dòng 127–186 | `onSelectTab(key)` đổi state `activeTab` $\rightarrow$ `renderCurrentPage()` chuyển component tương ứng. |
| **Tìm kiếm thời gian thực** | `src/pages/NewsManagement.jsx` | Dòng 39–42 | `const filteredList = news.filter(...)` dựa trên từ khóa `searchTerm`. |
| **Popup Xem chi tiết Tin bài** | `src/pages/NewsManagement.jsx` | Dòng 27, 160, 181<br>Dòng 310–361 | State `viewTarget`, hiển thị `<Modal isOpen={!!viewTarget}>`, tra cứu tên danh mục qua `getCategoryName`. |
| **Thêm mới (Create)** | `src/pages/NewsManagement.jsx`<br>`src/App.jsx` | `NewsManagement.jsx`: Dòng 72–97<br>`App.jsx`: Dòng 94–97 | `handleSave` gọi `onAdd(formData)` $\rightarrow$ `handleAddNews`: `setNews([{ id: nextId, ...newArticle }, ...news])`. |
| **Chỉnh sửa (Update)** | `src/pages/NewsManagement.jsx`<br>`src/App.jsx` | `NewsManagement.jsx`: Dòng 72–97<br>`App.jsx`: Dòng 99–101 | `handleSave` gọi `onUpdate(id, data)` $\rightarrow$ `handleUpdateNews`: `setNews(news.map(...))`. |
| **Xóa có xác nhận (Delete)** | `src/pages/NewsManagement.jsx`<br>`src/App.jsx` | `NewsManagement.jsx`: Dòng 30, 283–307<br>`App.jsx`: Dòng 103–105 | State `deleteTarget` mở Modal xác nhận $\rightarrow$ Bấm Đồng ý gọi `onDelete(id)` $\rightarrow$ `setNews(news.filter(...))`. |
| **Component Tái sử dụng (Popup Modal)** | `src/components/Modal.jsx` | Dòng 10–25 | Component nhận `isOpen`, `title`, `onClose`, `children` và chặn nổi bọt sự kiện `e.stopPropagation()`. |

---

## 5. THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP (Credentials)

| Tài khoản | Username | Password | Role | Quyền hạn |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên** | `Admin` | `Admin` | Role 1 | Toàn quyền Dashboard, Categories, News, Users, Settings |
| **Biên tập viên** | `Staff` | `Staff` | Role 2 | Quản lý Chuyên mục và Tin bài |

*(Màn hình Đăng nhập có sẵn 2 nút **"Điền nhanh Admin"** và **"Điền nhanh Staff"** để test nhanh).*

---

## 6. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY (Setup & Run)

```bash
# 1. Cài đặt thư viện phụ thuộc
npm install

# 2. Chạy môi trường phát triển (Dev Server)
npm run dev
# Mở trình duyệt tại: http://localhost:5173/

# 3. Kiểm tra build bản đóng gói (Production Build)
npm run build
```

---

## 7. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
src/
├── assets/logo.jpg            # Logo thương hiệu FUNews
├── components/
│   ├── Header.jsx             # Thanh điều hướng trên cùng (User info + Đăng xuất)
│   ├── Sidebar.jsx            # Menu điều hướng các tab nghiệp vụ
│   └── Modal.jsx              # Component Modal Popup tái sử dụng cho Thêm/Sửa/Xóa/Xem chi tiết
├── data/
│   └── initialData.js         # Dữ liệu mẫu ban đầu & hàm đọc/ghi LocalStorage
├── pages/
│   ├── LoginPage.jsx          # Màn hình đăng nhập (Admin/Admin, Staff/Staff)
│   ├── DashboardPage.jsx      # Tổng quan thống kê hệ thống
│   ├── CategoryManagement.jsx # Quản lý Chuyên mục (CRUD + Tìm kiếm + Modal)
│   ├── NewsManagement.jsx     # Quản lý Tin bài (CRUD + Xem chi tiết + Modal)
│   ├── UserManagement.jsx     # Quản lý Người dùng & Phân quyền Role 1 / Role 2
│   └── SettingsPage.jsx       # Cài đặt phiên làm việc & Khôi phục dữ liệu gốc
├── App.jsx                    # Root Component: Nắm giữ State, Navigation & Controller CRUD
├── index.css                  # Toàn bộ CSS giao diện đồng bộ, chuẩn responsive
└── main.jsx                   # Entry point khởi tạo React
```
