// FUNewsManagementSystem - Mock Data & LocalStorage Helper
// Quản lý dữ liệu mẫu ban đầu và đọc/ghi LocalStorage đơn giản

export const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Công nghệ', description: 'Tin tức công nghệ, AI và đổi mới số', status: 1 },
  { id: 2, name: 'Kinh doanh', description: 'Thị trường tài chính và khởi nghiệp', status: 1 },
  { id: 3, name: 'Giáo dục', description: 'Đào tạo đại học và học bổng', status: 1 },
  { id: 4, name: 'Đời sống', description: 'Văn hóa sinh viên và sức khỏe', status: 1 },
  { id: 5, name: 'Sự kiện', description: 'Hoạt động ngoại khóa và hội thảo', status: 0 },
];

export const DEFAULT_NEWS = [
  {
    id: 1,
    title: 'FPT University phát động cuộc thi sáng tạo AI 2026',
    content: 'Cuộc thi thu hút hàng trăm sinh viên tham gia với các dự án ứng dụng trí tuệ nhân tạo.',
    categoryId: 1,
    createdBy: 'Admin',
    status: 1,
  },
  {
    id: 2,
    title: 'Diễn đàn Khởi nghiệp Đổi mới sáng tạo trẻ',
    content: 'Chia sẻ kinh nghiệm gọi vốn và xây dựng sản phẩm từ các chuyên gia hàng đầu.',
    categoryId: 2,
    createdBy: 'Staff',
    status: 1,
  },
  {
    id: 3,
    title: 'Chương trình Trao đổi Sinh viên Quốc tế kỳ Fall',
    content: 'Cơ hội học tập trải nghiệm 1 học kỳ tại các trường đại học đối tác nước ngoài.',
    categoryId: 3,
    createdBy: 'Admin',
    status: 1,
  },
  {
    id: 4,
    title: 'Giải bóng đá Sinh viên FPT Cup khởi tranh',
    content: 'Hơn 32 đội bóng tranh tài sôi nổi tại sân vận động trường.',
    categoryId: 4,
    createdBy: 'Staff',
    status: 0,
  },
];

export const DEFAULT_USERS = [
  { id: 1, username: 'Admin', fullName: 'Quản trị viên hệ thống', email: 'admin@funews.edu.vn', role: 1, status: 1 },
  { id: 2, username: 'Staff', fullName: 'Biên tập viên Nguyễn Văn B', email: 'staff@funews.edu.vn', role: 2, status: 1 },
  { id: 3, username: 'editor1', fullName: 'Trần Thị Thu Thảo', email: 'thao.tt@funews.edu.vn', role: 2, status: 1 },
  { id: 4, username: 'guest_staff', fullName: 'Lê Hoàng Nam', email: 'nam.lh@funews.edu.vn', role: 2, status: 0 },
];

// Hàm đọc dữ liệu từ LocalStorage (nếu chưa có thì nạp dữ liệu mẫu ban đầu)
export const loadData = (key, defaultData) => {
  try {
    const saved = localStorage.getItem(`funews_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Lỗi đọc LocalStorage:', e);
  }
  localStorage.setItem(`funews_${key}`, JSON.stringify(defaultData));
  return defaultData;
};

// Hàm lưu dữ liệu vào LocalStorage
export const saveData = (key, data) => {
  try {
    localStorage.setItem(`funews_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Lỗi ghi LocalStorage:', e);
  }
};
