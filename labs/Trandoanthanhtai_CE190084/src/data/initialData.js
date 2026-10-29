/**
 * @author Thanhtai17
 * Author: Thanhtai17 (nhantai0317@gmail.com)
 * Student ID: CE190084 - Trần Đoàn Thanh Tài
 * Project: FUNews Management System
 * File: initialData.js - Dữ liệu mẫu ban đầu và LocalStorage helper
 */

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
    title: 'Google DeepMind công bố thế hệ AI mới hỗ trợ phát triển phần mềm',
    content: 'Mô hình tác tử AI thế hệ mới có khả năng giải quyết các tác vụ lập trình phức tạp, tự động phân tích mã nguồn, tối ưu hóa hiệu năng và hỗ trợ các kỹ sư phát triển phần mềm nâng cao năng suất làm việc vượt bậc. Hệ thống tích hợp khả năng suy luận đa tầng giúp phát hiện lỗi tiềm ẩn và đề xuất giải pháp tối ưu theo thời gian thực.',
    categoryId: 1,
    createdBy: 'Admin',
    status: 1,
  },
  {
    id: 2,
    title: 'FPT University phát động cuộc thi sáng tạo AI 2026',
    content: 'Cuộc thi thu hút hàng trăm sinh viên tham gia với các dự án ứng dụng trí tuệ nhân tạo và học máy hiện đại phục vụ đời sống xã hội.',
    categoryId: 1,
    createdBy: 'Admin',
    status: 1,
  },
  {
    id: 3,
    title: 'Diễn đàn Khởi nghiệp Đổi mới sáng tạo trẻ',
    content: 'Chia sẻ kinh nghiệm gọi vốn và xây dựng sản phẩm công nghệ từ các chuyên gia hàng đầu và các nhà sáng lập startup kỳ lân.',
    categoryId: 2,
    createdBy: 'Staff',
    status: 1,
  },
  {
    id: 4,
    title: 'Chương trình Trao đổi Sinh viên Quốc tế kỳ Fall',
    content: 'Cơ hội học tập trải nghiệm một học kỳ tại các trường đại học danh tiếng đối tác nước ngoài dành cho sinh viên có thành tích học tập xuất sắc.',
    categoryId: 3,
    createdBy: 'Admin',
    status: 1,
  },
  {
    id: 5,
    title: 'Giải bóng đá Sinh viên FPT Cup khởi tranh',
    content: 'Hơn 32 đội bóng tranh tài sôi nổi tại sân vận động trường với tinh thần thể thao nhiệt huyết, đoàn kết và trung thực.',
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
