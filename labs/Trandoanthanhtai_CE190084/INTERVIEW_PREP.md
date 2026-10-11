# CẨM NANG VẤN ĐÁP & BẢO VỆ CODE (INTERVIEW GUIDE)
> **Dự án**: FUNewsManagementSystem • Assignment 01 • SBA301  
> **Mục tiêu**: Giúp sinh viên hiểu rõ từng dòng code và trả lời tự tin đạt 10.0 điểm.

---

## 1. Khung giải thích code 5 tầng (Chuẩn Rubric)

Khi giảng viên chỉ vào bất kỳ trang nào (ví dụ: `CategoryManagement.jsx` hoặc `App.jsx`):
1. **Tầng 1 - Purpose (Mục đích)**:
   > *"File này quản lý giao diện và các thao tác CRUD của thực thể [Category/News/User], sử dụng popup modal để nhập liệu và bảng để hiển thị dữ liệu."*
2. **Tầng 2 - Input (Đầu vào)**:
   > *"Dữ liệu nhận từ props của `App.jsx` gồm danh sách thực thể và các hàm xử lý `onAdd`, `onUpdate`, `onDelete`."*
3. **Tầng 3 - Trigger (Sự kiện kích hoạt)**:
   > *"Khi người dùng tương tác như gõ phím ô tìm kiếm (`onChange`), nhấn nút Sửa/Xóa (`onClick`) hoặc submit form (`onSubmit`)."*
4. **Tầng 4 - Transform (Xử lý logic)**:
   > *"Hàm xử lý kiểm tra validation (không để trống), chuẩn hóa chuỗi `trim()`, và cập nhật State theo nguyên tắc **bất biến (Immutable Update)**."*
5. **Tầng 5 - Output (Kết quả hiển thị)**:
   > *"React render lại Virtual DOM, hiển thị bản ghi mới trên bảng, tự động đóng modal và đồng bộ vào `localStorage`."*

---

## 2. Checklist "Chỉ đúng vị trí code trong ≤ 30 giây"

| Giảng viên hỏi | Mở file nào? | Vị trí cần chỉ vào |
| :--- | :--- | :--- |
| **Đoạn kiểm tra đăng nhập Admin/Admin** | `src/pages/LoginPage.jsx` | Trong hàm `handleSubmit`: `username.trim() === 'Admin' && password.trim() === 'Admin'` |
| **Nơi lưu Auth State & Logout** | `src/App.jsx` | Dòng `const [currentUser, setCurrentUser] = useState(...)` và hàm `handleLogout` |
| **Nơi lưu và đồng bộ LocalStorage** | `src/App.jsx` | Các hook `useEffect(() => { saveData('categories', categories); }, [categories])` |
| **Logic Thêm/Sửa bất biến (Immutable Update)** | `src/App.jsx` | `setCategories([{ id: nextId, ...newCat }, ...categories])` hoặc `.map()` |
| **Logic Xóa có xác nhận (Confirmation)** | `src/pages/CategoryManagement.jsx` | State `deleteTarget`, hiển thị `<Modal isOpen={!!deleteTarget}>` và hàm `handleConfirmDelete` |
| **Logic Tìm kiếm không mất mảng gốc** | `src/pages/CategoryManagement.jsx` | `const filteredList = categories.filter(c => c.name.toLowerCase().includes(...))` |
| **Mối liên kết giữa News và Category** | `src/pages/NewsManagement.jsx` | Thẻ `<select>` chọn `categoryId` và hàm tra cứu tên: `categories.find(c => c.id === item.categoryId)` |

---

## 3. Câu hỏi lý thuyết phỏng vấn cốt lõi (FAQ)

### Câu 1: Vì sao em không sửa trực tiếp mảng (mutate state) như `categories.push(newItem)`?
- **Trả lời**: Trong React, State phải là bất biến (**Immutable**). Nếu dùng `push` hoặc `splice`, tham chiếu địa chỉ ô nhớ của mảng không thay đổi, React không nhận biết được sự thay đổi để kích hoạt re-render giao diện. Em luôn tạo mảng mới bằng cú pháp Spread `[newItem, ...categories]` hoặc `.filter()` khi xóa.

### Câu 2: Controlled Input là gì trong form Login/CRUD của em?
- **Trả lời**: Controlled Input là các thẻ input mà giá trị được kiểm soát hoàn toàn bởi React State qua 2 thuộc tính: `value={formData.name}` và `onChange={(e) => setFormData({...})}`. Nhờ vậy em có thể validate ngay khi người dùng nhập và reset form dễ dàng.

### Câu 3: Khi người dùng F5 tải lại trang, dữ liệu có bị mất không?
- **Trả lời**: Không bị mất ạ. Em sử dụng `loadData` để nạp dữ liệu từ `localStorage` khi khởi tạo state ban đầu, và dùng `useEffect` trong `App.jsx` để tự động lưu mảng mới vào `localStorage` mỗi khi có thao tác Thêm, Sửa hoặc Xóa.
