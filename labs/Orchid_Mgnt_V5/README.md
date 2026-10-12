# SBA301 - LAB 05: Orchid Management (Single Page Application with Spring Boot RESTful API)

## 1. Cấu trúc thư mục dự án

```text
Orchid_Mgnt_V5/
├── chapter15api/                           # Spring Boot 3 Backend
│   ├── pom.xml
│   └── src/main/
│       ├── java/fu/se/chapter15api/
│       │   ├── Chapter15apiApplication.java
│       │   ├── configs/
│       │   │   └── CorsConfig.java         # Cấu hình CORS cho React (http://localhost:5173)
│       │   ├── controllers/
│       │   │   └── OrchidController.java   # REST Controller CRUD (/orchids)
│       │   ├── pojos/
│       │   │   └── Orchid.java             # Entity JPA map với bảng Orchid trong DB
│       │   ├── repositories/
│       │   │   └── IOrchidRepository.java  # Spring Data JPA Repository
│       │   └── services/
│       │       ├── IOrchidService.java     # Service interface
│       │       └── OrchidService.java      # Service implementation
│       └── resources/
│           └── application.properties      # Cấu hình kết nối MS SQL Server OrchidManagementDB
└── chapter15reactjs/                       # ReactJS + Vite Frontend
    ├── .env                                # VITE_API_URL=http://localhost:8080/orchids
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx                        # Entry point với BrowserRouter & Bootstrap
        ├── App.jsx                         # Routing SPA (List, Create, Edit)
        ├── services/
        │   └── orchidApi.js                # Axios client gọi REST API Backend
        └── components/
            ├── NavBar.jsx                  # Thanh điều hướng React-Bootstrap
            ├── ListOfOrchids.jsx           # Component hiển thị danh sách Orchid & Xóa
            └── EditOrchid.jsx              # Form Thêm mới / Cập nhật Orchid
```

---

## 2. Thông tin kết nối Database
- **DBMS:** Microsoft SQL Server (Local, Port 1433)
- **Database Name:** `OrchidManagementDB`
- **Table Name:** `Orchid`
  - `OrchidID` (int, IDENTITY, PK)
  - `OrchidName` (nvarchar(100))
  - `IsNatural` (bit)
  - `OrchidDescription` (nvarchar(500))
  - `OrchidCategory` (nvarchar(100))
  - `IsAttractive` (bit)
  - `OrchidURL` (nvarchar(500))
- **Account:** `sa` / `123456`

---

## 3. Hướng dẫn chạy hệ thống

### 3.1. Chạy Backend (Spring Boot)
Mở terminal tại thư mục `chapter15api`:
```powershell
cd chapter15api
mvn spring-boot:run
```
Hoặc chạy trực tiếp file JAR đã build:
```powershell
java -jar target/chapter15api-0.0.1-SNAPSHOT.jar
```
- **Backend URL:** `http://localhost:8080/orchids/`

### 3.2. Chạy Frontend (ReactJS / Vite)
Mở terminal tại thư mục `chapter15reactjs`:
```powershell
cd chapter15reactjs
npm run dev
```
- **Frontend URL:** `http://localhost:5173/`

---

## 4. Danh sách REST Endpoints
| HTTP Method | URL | Chức năng | Response Status |
|:---|:---|:---|:---|
| **GET** | `/orchids/` | Lấy danh sách tất cả hoa Lan | `200 OK` |
| **GET** | `/orchids/{id}` | Lấy chi tiết hoa Lan theo ID | `200 OK` hoặc `404 Not Found` |
| **POST** | `/orchids/` | Thêm mới hoa Lan | `201 Created` |
| **PUT** | `/orchids/{id}` | Cập nhật hoa Lan theo ID | `200 OK` hoặc `404 Not Found` |
| **DELETE**| `/orchids/{id}` | Xóa hoa Lan theo ID | `204 No Content` hoặc `404 Not Found` |
