const DEFAULT_IMG = "https://images.unsplash.com/photo-1566958769312-82cef41d19ef?auto=format&fit=crop&w=900&q=85";

export default function ListOfOrchids({ orchids, onView, onEdit, onDelete }) {
  if (orchids.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">🌸</span>
        <h2>Chưa tìm thấy hoa lan</h2>
        <p>Thử thay đổi từ khóa tìm kiếm hoặc thêm một cây lan mới vào cơ sở dữ liệu.</p>
      </div>
    );
  }

  return (
    <div className="management-card">
      <div className="management-table-wrapper">
        <table className="management-table">
          <thead>
            <tr>
              <th style={{ width: "60px", textAlign: "center" }}>ID</th>
              <th style={{ width: "80px", textAlign: "center" }}>Hình ảnh</th>
              <th style={{ minWidth: "160px" }}>Tên hoa lan</th>
              <th style={{ width: "130px" }}>Danh mục</th>
              <th style={{ minWidth: "220px" }}>Mô tả chi tiết</th>
              <th style={{ width: "150px" }}>Đặc tính</th>
              <th style={{ width: "160px", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orchids.map((orchid) => {
              const isNatural = orchid.natural !== undefined ? orchid.natural : orchid.isNatural;
              const isAttractive = orchid.attractive !== undefined ? orchid.attractive : orchid.isAttractive;
              const imgUrl = orchid.orchidURL || orchid.orchidUrl || DEFAULT_IMG;

              return (
                <tr key={orchid.orchidId}>
                  <td style={{ textAlign: "center", fontWeight: "700", color: "#6b7280" }}>
                    #{orchid.orchidId}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <img
                      className="orchid-thumb"
                      src={imgUrl}
                      alt={orchid.orchidName}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onClick={() => onView(orchid)}
                      title={`Xem chi tiết ${orchid.orchidName}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMG;
                      }}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onView(orchid)}
                      style={{
                        background: "none",
                        border: "0",
                        padding: "0",
                        color: "#234229",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#3b82f6")}
                      onMouseLeave={(e) => (e.target.style.color = "#234229")}
                    >
                      {orchid.orchidName}
                    </button>
                  </td>
                  <td>
                    <span className="badge-tag badge-category">
                      {orchid.orchidCategory || "Chưa phân loại"}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: "#6b7280",
                        fontSize: "12px",
                        lineHeight: "1.6",
                      }}
                      title={orchid.orchidDescription}
                    >
                      {orchid.orchidDescription || "—"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                      <span className={`badge-tag ${isNatural ? "badge-natural" : "badge-hybrid"}`}>
                        {isNatural ? "🌿 Tự nhiên" : "🔬 Nhân giống"}
                      </span>
                      {isAttractive && (
                        <span className="badge-tag badge-attractive">
                          ⭐ Nổi bật
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: "center" }}>
                      <button
                        type="button"
                        className="btn-action btn-action-view"
                        onClick={() => onView(orchid)}
                        title="Xem chi tiết"
                      >
                        👁️ Xem
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-action-edit"
                        onClick={() => onEdit(orchid)}
                        title="Chỉnh sửa thông tin"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-action-delete"
                        onClick={() => onDelete(orchid)}
                        title="Xóa khỏi hệ thống"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        style={{
          padding: "12px 18px",
          background: "#fafbf9",
          borderTop: "1px solid #edf1eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        <span>
          Đang hiển thị <strong>{orchids.length}</strong> giống hoa lan
        </span>
        <span style={{ fontSize: "11px", color: "#9ca3af" }}>
          💡 Click vào tên hoặc ảnh để xem chi tiết
        </span>
      </div>
    </div>
  );
}
