# FUNewsManagementSystem - Assignment 02 SBA301

> **Môn học**: SBA301 - Integrate Single Page Application with Spring Boot  
> **Bài tập**: Assignment 02 - Implement CRUD Application with RESTful Web Service and ReactJS  
> **Sinh viên**: Tran Doan Thanh Tai (CE190084 / SE1910)  
> **Database**: `A2Trandoanthanhtai_SE1910` (MS SQL Server)  
> **Backend**: `A2Trandoanthanhtai_SE1910_BE` (Spring Boot 3 - Java 21/22, Spring Data JPA, RESTful API, 3-Layer Architecture)  
> **Frontend**: `A2Trandoanthanhtai_SE1910_FE` (ReactJS, Vite, Axios, Pop-up Modal, Confirmation Dialog)  

---

## 📌 TÓM TẮT VẤN ĐÁP & HƯỚNG DẪN TRACE CODE (INTERVIEW QUICK GUIDE)
<!-- 
> *Dành riêng cho sinh viên thuyết trình mở đầu trong 1-2 phút và trace code trực tiếp khi giảng viên hỏi.* -->

### 1. Bài toán nghiệp vụ (Problem Statement)
Hệ thống **FUNewsManagementSystem** phục vụ quản lý nội dung và xuất bản tin bài của trường Đại học FPT với 3 nhóm người dùng:
1. **Khách vãng lai (Guest)**: Xem bản tin công khai có trạng thái kích hoạt (`NewsStatus = 1`), tìm kiếm và lọc theo Chuyên mục, Thẻ tag mà **không cần đăng nhập**.
2. **Quản trị viên (Admin - Role 1)**: Quản lý tài khoản người dùng (`SystemAccount`) với ràng buộc: **Chỉ được xóa tài khoản nếu chưa từng tạo bài viết nào** (nếu đã tạo bài viết thì chặn xóa).
3. **Biên tập viên (Staff - Role 2)**:
   - Quản lý Chuyên mục (`Category`): **Chỉ được xóa chuyên mục nếu chưa có bài viết nào liên kết**.
   - Quản lý Tin bài (`NewsArticle`): CRUD bài viết, tự sinh mã tin, liên kết Nhiều-Nhiều với Thẻ (`Tag`).
   - Xem Lịch sử tin đã đăng của bản thân (`createdById`) và Quản lý Hồ sơ cá nhân (Profile).
4. **Quy chuẩn UI**: Toàn bộ thao tác Thêm/Sửa bắt buộc qua **Popup Dialog Modal**; thao tác Xóa luôn đi kèm **Hộp thoại xác nhận (Confirmation)**.

---

### 2. Cách giải quyết kỹ thuật (Solution & Architecture)
- **Backend (Spring Boot 3 - 3-Layer Architecture)**:
  - `Controller`: Định tuyến REST API, CORS (`WebMvcConfig`), validate dữ liệu đầu vào bằng `@Valid` và Jakarta Validation (`@NotBlank`, `@Email`, `@Size`).
  - `Service`: Xử lý nghiệp vụ, kiểm tra ràng buộc khóa ngoại bằng `existsBy...` trước khi xóa, ném `BusinessConflictException` (trả về mã HTTP `409 Conflict` qua `ApiExceptionHandler`) giúp thông báo rõ lý do thay vì văng lỗi 500 của Database.
  - `Repository`: Kế thừa `JpaRepository`, dùng JPQL động để tìm kiếm nhiều điều kiện (keyword, category, tag, status).
  - `DTO Pattern`: Tách biệt Entity và DTO để bảo mật mật khẩu tài khoản và ngăn chặn lỗi vòng lặp tuần hoàn (Infinite Recursion) của quan hệ Many-to-Many giữa News và Tag.
- **Frontend (ReactJS SPA + Axios)**:
  - Giao tiếp Backend qua thư viện `axios` tập trung tại `services/api.js` có response interceptor bắt lỗi đồng bộ.
  - Component `Modal.jsx` tái sử dụng linh hoạt cho cả form Thêm/Sửa và hộp thoại xác nhận Xóa.
  - Quản lý phiên đăng nhập tại `App.jsx` và lưu trữ `localStorage` giúp F5 không bị mất phiên.

---

### 3. Luồng chạy & Vị trí code xử lý từng chức năng (Flow & Code Traceability)

| Chức năng | Luồng chạy (Data Flow) | File & Đoạn code xử lý chính |
| :--- | :--- | :--- |
| **1. Bản tin công khai** | UI Lọc $\rightarrow$ `axios.get('/api/news', {status: true, ...})` $\rightarrow$ Controller $\rightarrow$ Service $\rightarrow$ JPQL Repo $\rightarrow$ Trả về DTOs | • FE: `PublicNewsPage.jsx` (`fetchNews`)<br>• BE: `NewsArticleController.java` (`searchArticles`)<br>• BE: `NewsArticleRepository.java` (`searchArticles` - JPQL query) |
| **2. Đăng nhập & Phân quyền** | Form Login $\rightarrow$ `POST /api/auth/login` $\rightarrow$ Service kiểm tra email/password $\rightarrow$ Trả `LoginResponse` $\rightarrow$ FE lưu `localStorage` & điều hướng theo Role | • FE: `LoginPage.jsx` (`handleSubmit`)<br>• FE: `App.jsx` (`currentUser`, `currentTab`)<br>• BE: `AuthController.java` (`login`)<br>• BE: `SystemAccountServiceImpl.java` (`login`) |
| **3. Chặn xóa Tài khoản có bài viết** | Bấm Xóa $\rightarrow$ Confirm Modal $\rightarrow$ `DELETE /api/accounts/{id}` $\rightarrow$ Service check `existsByCreatedBy_AccountId` $\rightarrow$ Ném `BusinessConflictException` $\rightarrow$ HTTP 409 $\rightarrow$ Alert đỏ | • FE: `AccountManagementPage.jsx` (`handleDeleteConfirm`)<br>• BE: `SystemAccountServiceImpl.java` (hàm `deleteAccount` dòng 165-174)<br>• BE: `ApiExceptionHandler.java` (`handleConflict`) |
| **4. Chặn xóa Chuyên mục có bài viết** | Bấm Xóa $\rightarrow$ Confirm Modal $\rightarrow$ `DELETE /api/categories/{id}` $\rightarrow$ Service check `existsByCategory_CategoryId` $\rightarrow$ Ném `BusinessConflictException` $\rightarrow$ HTTP 409 | • FE: `CategoryManagementPage.jsx` (`handleDeleteConfirm`)<br>• BE: `CategoryServiceImpl.java` (hàm `deleteCategory` dòng 90-99)<br>• BE: `NewsArticleRepository.java` (`existsByCategory_CategoryId`) |
| **5. Thêm/Sửa Tin bài & Gán Tags** | Modal Form $\rightarrow$ Chọn Tags $\rightarrow$ `POST/PUT /api/news` $\rightarrow$ `@Valid` Controller $\rightarrow$ Service tự sinh ID, tìm Tags gán vào `Set<Tag>` $\rightarrow$ Lưu bảng `NewsArticle` và `NewsTag` | • FE: `NewsManagementPage.jsx` (`handleSaveArticle`, `toggleTagSelection`)<br>• BE: `NewsArticleServiceImpl.java` (`createArticle`, `generateNextArticleId`)<br>• BE: `NewsArticle.java` (`@ManyToMany` `@JoinTable NewsTag`) |
| **6. Lịch sử bài viết của Staff** | Staff chọn tab Lịch sử $\rightarrow$ `GET /api/news?createdById={id}` $\rightarrow$ Repo truy vấn theo `CreatedByID` $\rightarrow$ Trả danh sách bài do chính user tạo | • FE: `NewsHistoryPage.jsx` (`fetchHistory`)<br>• BE: `NewsArticleRepository.java` (`findByCreatedBy_AccountIdOrderByCreatedDateDesc`) |
| **7. Quản lý Hồ sơ Staff** | Form Profile $\rightarrow$ `PUT /api/profile/{id}` $\rightarrow$ Validate trùng email $\rightarrow$ Update tên, email, password $\rightarrow$ Cập nhật state hiển thị | • FE: `ProfilePage.jsx` (`handleSubmit`)<br>• BE: `ProfileController.java` (`updateProfile`)<br>• BE: `SystemAccountServiceImpl.java` (`updateProfile`) |

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
*(Hoặc mở Terminal trong VS Code/IDE gõ `.\START_SYSTEM.bat`)*  
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
