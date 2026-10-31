# FUMiniHotelSystem - Assignment 03 SBA301

> **Môn học**: SBA301 - Integrate Single Page Application with Spring Boot  
> **Bài tập**: Assignment 03 - Securing REST Services with Spring Boot  
> **Sinh viên**: Tran Doan Thanh Tai (SE1910)  
> **Database**: `A3Trandoanthanhtai_SE1910` (MS SQL Server)  
> **Backend**: `A3Trandoanthanhtai_SE1910_BE` (Spring Boot 3 - Java 21/22, Spring Data JPA, Spring Security, JWT, 3-Layer Architecture)  
> **Frontend**: `A3Trandoanthanhtai_SE1910_FE` (ReactJS, Vite, Axios, JWT Authentication, Modern Dashboard UI)  

---

## 🎯 HƯỚNG DẪN TRẢ LỜI VẤN ĐÁP / INTERVIEW (TÓM TẮT DÀNH CHO SINH VIÊN)

### 1. Bài toán yêu cầu làm gì? (Problem Statement)
Hệ thống **FUMiniHotelSystem** là ứng dụng quản lý khách sạn mini Full-stack phân tách (Spring Boot 3 + ReactJS + MS SQL Server) giải quyết bài toán đặt phòng và quản lý cho 3 nhóm đối tượng:
1. **Khách vãng lai (Guest - Public):** Xem danh sách và tìm kiếm phòng **hoàn toàn tự do không cần đăng nhập** (tiêu chí bắt buộc của đề bài); Đăng ký tài khoản khách hàng mới.
2. **Khách hàng (Customer):** Đăng nhập xác thực bằng JWT, quản lý hồ sơ cá nhân, **thực hiện đặt phòng trực tuyến (Online Booking cho 1 hoặc nhiều phòng cùng lúc)**, và xem **lịch sử đặt phòng** của chính mình.
3. **Nhân viên (Staff):** Tài khoản quản trị **được cấu hình trực tiếp từ file `application.properties`** (không nằm trong DB Customer); có quyền quản lý khách hàng (CRUD), quản lý đơn đặt phòng và **quản lý phòng kèm quy tắc nghiệp vụ xóa đặc biệt**.

---

### 2. Cách giải quyết bài toán như thế nào? (Technical Solutions & Architecture)
1. **Kiến trúc 3-Layer Architecture:**
   * **Controller**: Tiếp nhận request RESTful, validate dữ liệu đầu vào (`@Valid`), trả về DTO và HTTP Status chuẩn (`200 OK`, `201 Created`, `400 Bad Request`, `403 Forbidden`).
   * **Service**: Xử lý toàn bộ logic nghiệp vụ (tính tiền phòng, kiểm tra ràng buộc xóa, phân quyền).
   * **Repository**: Giao tiếp CSDL thông qua Spring Data JPA với Hibernate ORM kết nối MS SQL Server `A3Trandoanthanhtai_SE1910`.
2. **Bảo mật & Phân quyền Stateless với Spring Security + JWT:**
   * [`JwtAuthenticationFilter`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/config/JwtAuthenticationFilter.java) chặn mọi request để kiểm tra Bearer token trong header `Authorization`.
   * [`JwtTokenProvider`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/config/JwtTokenProvider.java) mã hóa token HMAC-SHA384 kèm claims: `role` (`STAFF` / `CUSTOMER`), `customerId`, `email`.
   * Cơ chế đăng nhập tách biệt: Khi gọi `POST /api/auth/login`, hệ thống so sánh email/password với tài khoản trong `application.properties` trước. Nếu khớp $\rightarrow$ cấp role `STAFF`. Nếu không $\rightarrow$ truy vấn bảng `Customer` trong SQL Server để cấp role `CUSTOMER`.
3. **Frontend ReactJS + Axios Interceptor:**
   * React (Vite) quản lý trạng thái qua [`AuthContext`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_FE/src/context/AuthContext.jsx) và lưu token vào `localStorage`.
   * [`axiosClient`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_FE/src/api/axiosClient.js) tự động chèn header `Authorization: Bearer <token>` vào mọi API calls.

---

### 3. Luồng chạy chi tiết & Đoạn Code xử lý từng chức năng cốt lõi (Execution Flow & Code References)

#### 🔹 Chức năng 1: Khách xem danh sách phòng công khai (Public Room Catalog)
* **Luồng chạy:** Client gọi `GET /api/rooms` $\rightarrow$ Request đi qua `SecurityConfig` được cấu hình `.permitAll()` $\rightarrow$ Controller gọi `RoomService.getAllRooms()` $\rightarrow$ `RoomInformationRepository` truy vấn danh sách phòng từ bảng `RoomInformation`.
* **Vị trí Code xử lý:**
  * Cấu hình PermitAll: [`SecurityConfig.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/config/SecurityConfig.java#L39)
  * Controller: [`RoomInformationController.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/controller/RoomInformationController.java#L27-L36)
  * Service: [`RoomService.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/service/RoomService.java#L28-L32)

#### 🔹 Chức năng 2: Đăng nhập & Xác thực JWT (Staff từ properties vs Customer từ DB)
* **Luồng chạy:**
  * Client gửi `{email, password}` đến `POST /api/auth/login`.
  * `AuthService.login()` kiểm tra `staffEmail.equalsIgnoreCase(email)` từ `application.properties`. Nếu đúng $\rightarrow$ cấp token role `STAFF`.
  * Nếu không, tìm trong `CustomerRepository.findByEmailAddress(email)`. Kiểm tra mật khẩu và trạng thái `customerStatus == 1` $\rightarrow$ cấp token role `CUSTOMER`.
* **Vị trí Code xử lý:**
  * Controller: [`AuthController.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/controller/AuthController.java#L20-L30)
  * Logic xác thực Staff & Customer: [`AuthService.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/service/AuthService.java#L32-L58)
  * Sinh Token: [`JwtTokenProvider.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/config/JwtTokenProvider.java#L35-L48)

#### 🔹 Chức năng 3: Quy tắc Xóa phòng (Staff - Hard Delete vs Soft Delete)
* **Yêu cầu đề bài:** *"The delete action will delete room information in the case this information is not belong to any renting transaction. If the room information is already stored in a booking detail, just change the status."*
* **Luồng chạy:**
  * Staff bấm Xóa $\rightarrow$ gọi `DELETE /api/rooms/{id}`.
  * `RoomService.deleteRoom()` gọi `bookingDetailRepository.existsById_RoomId(id)`:
    * **Nếu TRUE (đã từng có người đặt phòng):** Chỉ đổi trạng thái `room.setRoomStatus((byte) 0)` (Soft Delete) để giữ nguyên lịch sử đơn đặt phòng cũ.
    * **Nếu FALSE (chưa từng có giao dịch):** Thực hiện `roomRepository.delete(room)` (Hard Delete xóa hẳn khỏi DB).
* **Vị trí Code xử lý:**
  * Kiểm tra ràng buộc và xử lý xóa: [`RoomService.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/service/RoomService.java#L87-L110)
  * Controller tiếp nhận: [`RoomInformationController.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/controller/RoomInformationController.java#L70-L81)

#### 🔹 Chức năng 4: Đặt phòng trực tuyến (Online Booking cho 1 hoặc nhiều phòng)
* **Luồng chạy:**
  * Khách hàng chọn nhiều phòng, chọn ngày nhận phòng (`StartDate`) và ngày trả phòng (`EndDate`).
  * Gửi `POST /api/bookings` kèm danh sách phòng `roomDetails`.
  * `BookingService.createBooking()`:
    1. Lấy thông tin khách hàng từ JWT qua `Authentication.getName()`.
    2. Tự sinh mã đơn mới: `bookingReservationRepository.findMaxId() + 1`.
    3. Duyệt từng phòng, tính số ngày lưu trú `ChronoUnit.DAYS.between(startDate, endDate)`, tính giá phòng `roomPricePerDay * days`, cộng dồn vào `totalPrice`.
    4. Tạo các bản ghi `BookingDetail` (Composite Key `BookingDetailId(reservationId, roomId)`) và lưu vào DB.
* **Vị trí Code xử lý:**
  * Logic tính tiền và lưu đơn: [`BookingService.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/service/BookingService.java#L52-L118)
  * Controller: [`BookingReservationController.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/controller/BookingReservationController.java#L56-L76)

#### 🔹 Chức năng 5: Xem lịch sử đặt phòng (Customer Booking Reservation History)
* **Luồng chạy:** Customer gọi `GET /api/bookings/my-history` $\rightarrow$ `BookingService.getMyBookings()` truy vấn `findByCustomerIdOrderByBookingDateDesc()` đảm bảo khách chỉ xem được đơn của chính mình.
* **Vị trí Code xử lý:**
  * Service: [`BookingService.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/service/BookingService.java#L40-L45)
  * Controller: [`BookingReservationController.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/controller/BookingReservationController.java#L36-L45)

#### 🔹 Chức năng 6: Quản lý hồ sơ cá nhân (Customer Manage Profile)
* **Luồng chạy:** Khách xem và chỉnh sửa họ tên, số điện thoại, ngày sinh, đổi mật khẩu qua `GET /api/customer/profile` và `PUT /api/customer/profile`.
* **Vị trí Code xử lý:**
  * Service: [`CustomerService.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/service/CustomerService.java#L34-L62)
  * Controller: [`CustomerController.java`](file:///f:/SBA301/labs/Assignment3/A3Trandoanthanhtai_SE1910_BE/src/main/java/com/fpt/sba301/a3/controller/CustomerController.java#L22-L44)

---

## 1. Cấu hình kết nối Cơ sở dữ liệu (Database Configuration)

- **Hệ quản trị CSDL**: Microsoft SQL Server
- **Tên Database**: `A3Trandoanthanhtai_SE1910` *(Đã kết nối thành công)*
- **Tài khoản DB**: `sa`
- **Mật khẩu DB**: `123456`
- **Port**: `1433`
- **Cấu hình tại `application.properties`**:
  ```properties
  spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=A3Trandoanthanhtai_SE1910;encrypt=true;trustServerCertificate=true
  spring.datasource.username=sa
  spring.datasource.password=123456
  spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
  ```

---

## 2. Thông tin tài khoản đăng nhập kiểm thử (Credentials)

Hệ thống hỗ trợ cả tài khoản **Staff (lấy từ properties)** và **Customer (lưu trong DB)**:

| Vai trò | Họ tên | Email đăng nhập | Mật khẩu | Quyền hạn & Chức năng |
| :--- | :--- | :--- | :---: | :--- |
| **Staff (Admin)** | Hotel Administrator | `admin@fuminhotel.com` | `Admin@123` | **Lấy từ application.properties** theo yêu cầu đề bài. Quản lý phòng (CRUD + Quy tắc xóa phòng), Quản lý khách hàng (CRUD), Quản lý đơn đặt phòng. |
| **Customer 1** | John Doe | `customer@fuminhotel.com` | `Customer@123` | Đặt phòng online (1 hoặc nhiều phòng), Quản lý hồ sơ cá nhân, Xem lịch sử đặt phòng. |
| **Customer 2** | Tran Doan Thanh Tai | `taitt@fuminhotel.com` | `123456` | Tương tự như trên. |
| **Khách (Guest)** | Không đăng nhập | — | — | **Xem thông tin phòng công khai** (không cần đăng nhập theo yêu cầu đề bài), Đăng ký tài khoản mới. |

---

## 3. Kiến trúc hệ thống (System Architecture)

### 3.1 Backend: 3-Layer Architecture with Spring Security & JWT
1. **Controller Layer** (`com.fpt.sba301.a3.controller`):
   - `AuthController`: Đăng nhập & Đăng ký tài khoản (`/api/auth/**`).
   - `RoomInformationController`: Xem phòng công khai, CRUD phòng cho Staff (`/api/rooms/**`).
   - `RoomTypeController`: Lấy danh mục loại phòng (`/api/room-types`).
   - `CustomerController`: Quản lý hồ sơ cá nhân (`/api/customer/profile`) & Quản lý khách hàng cho Staff (`/api/customers/**`).
   - `BookingReservationController`: Đặt phòng online, xem lịch sử cá nhân & Quản lý toàn bộ đơn đặt phòng cho Staff (`/api/bookings/**`).

2. **Service Layer** (`com.fpt.sba301.a3.service`):
   - `AuthService`: Xác thực đăng nhập (so khớp Staff từ `application.properties` hoặc Customer từ database), cấp phát token JWT.
   - `RoomService`: Xử lý CRUD phòng, tìm kiếm lọc phòng, và **thực thi đúng quy tắc nghiệp vụ Xóa phòng**:
     * Kiểm tra `bookingDetailRepository.existsById_RoomId(roomId)`.
     * Nếu **chưa có** giao dịch đặt phòng $\rightarrow$ Xóa hoàn toàn khỏi CSDL (**Hard Delete**).
     * Nếu **đã có** trong `BookingDetail` $\rightarrow$ Chuyển trạng thái sang `RoomStatus = 0` (**Soft Delete**).
   - `BookingService`: Đặt 1 hoặc nhiều phòng cùng lúc, tính số đêm lưu trú, tính tiền tự động, lưu đồng thời `BookingReservation` và `BookingDetail`.
   - `CustomerService`: Quản lý danh sách khách hàng và hồ sơ cá nhân.

3. **Repository Layer** (`com.fpt.sba301.a3.repository`):
   - Kế thừa `JpaRepository` cho cả 5 thực thể: `RoomTypeRepository`, `RoomInformationRepository`, `CustomerRepository`, `BookingReservationRepository`, `BookingDetailRepository`.

4. **Security & JWT** (`com.fpt.sba301.a3.config`):
   - `JwtTokenProvider`: Ký và giải mã token JWT bằng thuật toán HMAC-SHA384 (JJWT 0.12.5).
   - `JwtAuthenticationFilter`: Bộ lọc chặn các request gửi kèm `Authorization: Bearer <token>`, trích xuất email và Role gán vào `SecurityContext`.
   - `SecurityConfig`: Cấu hình phân quyền bảo mật, CORS, vô hiệu hóa session trạng thái (Stateless).

---

## 4. Hướng dẫn khởi chạy hệ thống (How to Run)

### Cách 1: Khởi chạy 1-Click (Khuyên dùng)
* Nhấp đúp vào file **`START_SYSTEM.bat`** (hoặc chạy `./START_SYSTEM.ps1` trong PowerShell).
* Hệ thống sẽ tự động bật 2 cửa sổ cmd riêng biệt chạy cả Backend (port 8080) và Frontend (port 5173).

### Cách 2: Khởi chạy thủ công từng phần

**Khởi chạy Backend (Spring Boot 3):**
```powershell
cd F:\SBA301\labs\Assignment3\A3Trandoanthanhtai_SE1910_BE
.\run-backend.bat
# Hoặc: mvn spring-boot:run
```
*Backend URL*: `http://localhost:8080/api`

**Khởi chạy Frontend (React Vite):**
```powershell
cd F:\SBA301\labs\Assignment3\A3Trandoanthanhtai_SE1910_FE
.\run-frontend.bat
# Hoặc: npm run dev
```
*Frontend URL*: `http://localhost:5173/`

---

## 5. Danh sách RESTful API Endpoints

### 5.1 Public APIs (Không cần đăng nhập)
- `POST /api/auth/login`: Đăng nhập (nhận JWT Token).
- `POST /api/auth/register`: Đăng ký tài khoản Customer mới.
- `GET /api/rooms`: Xem danh sách tất cả phòng đang khả dụng kèm lọc tìm kiếm.
- `GET /api/rooms/{id}`: Xem chi tiết 1 phòng.
- `GET /api/room-types`: Xem danh sách các loại phòng.

### 5.2 Customer APIs (Quyền ROLE_CUSTOMER)
- `POST /api/bookings`: Đặt phòng trực tuyến (chọn 1 hoặc nhiều phòng).
- `GET /api/bookings/my-history`: Xem lịch sử đặt phòng của chính mình.
- `GET /api/customer/profile`: Xem thông tin tài khoản cá nhân.
- `PUT /api/customer/profile`: Cập nhật thông tin cá nhân & đổi mật khẩu.

### 5.3 Staff APIs (Quyền ROLE_STAFF)
- `POST /api/rooms`: Thêm mới phòng.
- `PUT /api/rooms/{id}`: Chỉnh sửa thông tin phòng.
- `DELETE /api/rooms/{id}`: Xóa phòng (áp dụng quy tắc Hard Delete / Soft Delete theo giao dịch).
- `GET /api/customers`: Xem danh sách khách hàng (hỗ trợ tìm kiếm theo tên, email, sđt).
- `POST /api/customers`: Thêm mới khách hàng.
- `PUT /api/customers/{id}`: Chỉnh sửa khách hàng.
- `DELETE /api/customers/{id}`: Khóa tài khoản khách hàng (Status = 0).
- `GET /api/bookings`: Xem toàn bộ đơn đặt phòng của khách sạn.
- `PATCH /api/bookings/{id}/status`: Cập nhật trạng thái đơn đặt phòng (Hoàn thành / Hủy).

