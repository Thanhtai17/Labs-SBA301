# FUNewsManagementSystem - Assignment 02 SBA301

> **Môn học**: SBA301 - Integrate Single Page Application with Spring Boot  
> **Bài tập**: Assignment 02 - Implement CRUD Application with RESTful Web Service and ReactJS  
> **Sinh viên**: Tran Doan Thanh Tai (CE190084 / SE1910)  
> **Database**: `A2Trandoanthanhtai_SE1910` (MS SQL Server)  
> **Backend**: `A2Trandoanthanhtai_SE1910_BE` (Spring Boot 3 - Java 21/22, Spring Data JPA, RESTful API, 3-Layer Architecture)  
> **Frontend**: `A2Trandoanthanhtai_SE1910_FE` (ReactJS, Vite, Axios, Pop-up Modal, Confirmation Dialog)  

---

## 1. Cấu hình kết nối Cơ sở dữ liệu (Database Configuration)

- **Hệ quản trị CSDL**: Microsoft SQL Server
- **Tên Database**: `A2Trandoanthanhtai_SE1910`
- **Tài khoản**: `sa`
- **Mật khẩu**: `123456`
- **Port**: `1433`
- **Chuỗi kết nối (JDBC URL)**:
  ```properties
  spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=A2Trandoanthanhtai_SE1910;encrypt=true;trustServerCertificate=true
  spring.datasource.username=sa
  spring.datasource.password=123456
  spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
  ```

---

## 2. Thông tin tài khoản đăng nhập kiểm thử (Credentials)

Hệ thống có sẵn các tài khoản thực tế từ Database:

| Vai trò | Họ tên | Email đăng nhập | Mật khẩu | Quyền hạn theo đề bài |
| :--- | :--- | :--- | :---: | :--- |
| **Admin** (Role 1) | Steve Paris | `SteveParis@FUNewsManagement.org` | `@1` | Quản lý tài khoản (Account CRUD + Search, ngăn xóa tài khoản đã tạo tin bài) |
| **Staff** (Role 2) | Emma William | `EmmaWilliam@FUNewsManagement.org` | `@1` | Quản lý chuyên mục (Category CRUD + Search), Tin bài (News CRUD + Tags + Search), Lịch sử tin cá nhân, Hồ sơ cá nhân |
| **Staff** (Role 2) | Olivia James | `OliviaJames@FUNewsManagement.org` | `@1` | Như trên |
| **Khách (Guest)** | Không cần đăng nhập | — | — | Xem toàn bộ bản tin công khai có trạng thái `NewsStatus = 1 (Active)`, lọc theo chuyên mục và thẻ |

---

## 3. Kiến trúc hệ thống (System Architecture)

### 3.1 Backend (3-Layer Architecture with Spring Data JPA)
1. **Controller Layer** (`com.fpt.sba301.a2.controller`):
   - `AuthController`: API Đăng nhập (`/api/auth/login`)
   - `SystemAccountController`: REST API CRUD & Search tài khoản (`/api/accounts`)
   - `CategoryController`: REST API CRUD & Search chuyên mục (`/api/categories`)
   - `NewsArticleController`: REST API CRUD, Search, lọc tin bài theo danh mục, thẻ, trạng thái (`/api/news`)
   - `TagController`: API danh sách thẻ gắn kèm (`/api/tags`)
   - `ProfileController`: API xem và cập nhật hồ sơ cá nhân (`/api/profile`)
2. **Service Layer** (`com.fpt.sba301.a2.service` & `impl`):
   - Xử lý toàn bộ logic nghiệp vụ, ràng buộc khóa ngoại, validate email duy nhất.
   - **Ràng buộc xóa tài khoản**: Nếu tài khoản đã từng tạo bài viết tin tức (`createdBy`), chặn thao tác xóa và trả về thông báo lỗi 409 Conflict.
   - **Ràng buộc xóa danh mục**: Nếu chuyên mục đang chứa bài viết tin tức, chặn thao tác xóa và trả về lỗi 409 Conflict.
3. **Repository Layer** (`com.fpt.sba301.a2.repository`):
   - `SystemAccountRepository`, `CategoryRepository`, `NewsArticleRepository`, `TagRepository` kế thừa `JpaRepository`.
4. **Entity & DTO Layer**:
   - `SystemAccount`, `Category`, `NewsArticle`, `Tag` với quan hệ Many-to-Many (`NewsTag`) và Many-to-One.
   - Validation annotations (`@NotBlank`, `@Email`, `@Size`, `@NotNull`).
   - `ApiExceptionHandler` xử lý tập trung lỗi xác thực và nghiệp vụ.

### 3.2 Frontend (ReactJS SPA with Axios)
- Toàn bộ giao tiếp mạng sử dụng **`axios`** (`src/services/api.js`).
- Sử dụng **Popup Dialog Modal** (`Modal.jsx`) cho tất cả chức năng Thêm mới và Chỉnh sửa theo đúng yêu cầu đề.
- Chức năng Xóa luôn đi kèm **Hộp thoại xác nhận (Confirmation Dialog)**.
- Giao diện trực quan, hỗ trợ Responsive, phân quyền hiển thị theo Role (Admin / Staff / Guest).

---

## 4. Hướng dẫn khởi chạy (How to Run)

### Cách 1: Khởi chạy nhanh bằng file Batch (Khuyên dùng)
Nhấp đúp chuột vào file:
```text
START_SYSTEM.bat
```
Hệ thống sẽ tự động mở 2 cửa sổ chạy song song Backend (cổng 8080) và Frontend (cổng 5173).

---

### Cách 2: Khởi chạy thủ công từng phần

#### 1. Khởi chạy Backend (Spring Boot 3):
```powershell
cd f:\SBA301\labs\Assigment2\A2Trandoanthanhtai_SE1910_BE
.\mvnw.cmd spring-boot:run
```
Máy chủ API sẽ chạy tại: `http://localhost:8080/api`

#### 2. Khởi chạy Frontend (ReactJS):
```powershell
cd f:\SBA301\labs\Assigment2\A2Trandoanthanhtai_SE1910_FE
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:5173/`

---

## 5. Bảng đối chiếu yêu cầu đề bài (Compliance Checklist)

| Yêu cầu đề bài | Hiện thực | Trạng thái |
| :--- | :--- | :---: |
| Không cần đăng nhập để xem tin tức (`NewsStatus = 1`) | Trang `PublicNewsPage.jsx` công khai kèm bộ lọc danh mục và thẻ | Đạt 100% |
| Đăng nhập tài khoản bằng Email và Password | `AuthController`, `LoginPage.jsx` có nút điền nhanh test | Đạt 100% |
| Spring Boot 3 + MS SQL Server + Spring Data JPA | Hoàn chỉnh cấu hình `application.properties` | Đạt 100% |
| 3-Layer Architecture (Controller, Service, Repository) | Đầy đủ Interfaces và Implementations chuẩn mực | Đạt 100% |
| Admin: Quản lý tài khoản (CRUD + Search) | `AccountManagementPage.jsx`, chặn xóa nếu có tin bài đã tạo | Đạt 100% |
| Staff: Quản lý chuyên mục (CRUD + Search) | `CategoryManagementPage.jsx`, chặn xóa nếu có tin bài dùng | Đạt 100% |
| Staff: Quản lý tin bài (CRUD + Tags + Search) | `NewsManagementPage.jsx` chọn nhiều thẻ, phân quyền đầy đủ | Đạt 100% |
| Staff: Quản lý hồ sơ cá nhân | `ProfilePage.jsx` xem và cập nhật tên, email, password | Đạt 100% |
| Staff: Xem lịch sử tin đã đăng | `NewsHistoryPage.jsx` lọc theo `createdById` của Staff đăng nhập | Đạt 100% |
| Thao tác Thêm/Sửa qua Popup Dialog Modal | Dùng chung `Modal.jsx` với validation trực tiếp | Đạt 100% |
| Thao tác Xóa luôn có Popup xác nhận (Confirm) | Modal xác nhận hiển thị cảnh báo nghiệp vụ rõ ràng | Đạt 100% |
| Đặt tên Database và Projects theo cú pháp đề bài | `A2Trandoanthanhtai_SE1910` | Đạt 100% |

