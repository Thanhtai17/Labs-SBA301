import { useEffect, useState } from 'react';

const emptyForm = {
  orchidName: '',
  orchidCategory: '',
  orchidDescription: '',
  orchidURL: '',
  isNatural: true,
  isAttractive: false,
};

export default function EditOrchid({ orchid, categories = [], onClose, onSave, saving, apiError }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (orchid) {
      setForm({
        orchidName: orchid.orchidName || '',
        orchidCategory: orchid.orchidCategory || '',
        orchidDescription: orchid.orchidDescription || '',
        orchidURL: orchid.orchidURL || orchid.orchidUrl || '',
        isNatural: Boolean(orchid.natural !== undefined ? orchid.natural : orchid.isNatural),
        isAttractive: Boolean(orchid.attractive !== undefined ? orchid.attractive : orchid.isAttractive),
      });
    } else {
      setForm({
        ...emptyForm,
        orchidCategory: categories[0] || 'Cattleya',
      });
    }
    setValidationError('');
  }, [orchid, categories]);

  function change(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.orchidName.trim()) {
      setValidationError('Vui lòng nhập tên hoa lan.');
      return;
    }
    setValidationError('');
    await onSave({
      orchidName: form.orchidName.trim(),
      orchidCategory: form.orchidCategory.trim(),
      orchidDescription: form.orchidDescription.trim(),
      orchidURL: form.orchidURL.trim(),
      natural: form.isNatural,
      isNatural: form.isNatural,
      attractive: form.isAttractive,
      isAttractive: form.isAttractive,
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog form-dialog" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="dialog__header">
          <div>
            <div className="eyebrow">BỘ SƯU TẬP CỦA BẠN</div>
            <h2 id="form-title">{orchid ? 'Chỉnh sửa hoa lan' : 'Thêm hoa lan mới'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Đóng">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <form className="orchid-form" onSubmit={submit}>
          {validationError && <div className="inline-error" role="alert">{validationError}</div>}
          {apiError && <div className="inline-error" role="alert">{apiError}</div>}
          <label>
            Tên hoa lan <span>*</span>
            <input
              name="orchidName"
              value={form.orchidName}
              onChange={change}
              maxLength={120}
              required
              placeholder="Ví dụ: Hồ điệp trắng, Cattleya..."
            />
          </label>
          <div className="form-row">
            <label>
              Danh mục (Category) <span>*</span>
              <input
                name="orchidCategory"
                list="category-suggestions"
                value={form.orchidCategory}
                onChange={change}
                required
                placeholder="Ví dụ: Cattleya, Dendrobium..."
              />
              <datalist id="category-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <label>
              Đường dẫn hình ảnh
              <input
                name="orchidURL"
                type="text"
                maxLength={500}
                value={form.orchidURL}
                onChange={change}
                placeholder="https://..."
              />
            </label>
          </div>
          <label>
            Mô tả
            <textarea
              name="orchidDescription"
              rows="3"
              maxLength={1000}
              value={form.orchidDescription}
              onChange={change}
              placeholder="Mô tả đặc điểm của cây lan..."
            />
          </label>
          <div className="form-row">
            <label className="checkbox-label">
              <input name="isNatural" type="checkbox" checked={form.isNatural} onChange={change} />
              <span>Đây là giống lan tự nhiên</span>
            </label>
            <label className="checkbox-label">
              <input name="isAttractive" type="checkbox" checked={form.isAttractive} onChange={change} />
              <span>Giống lan nổi bật (Attractive)</span>
            </label>
          </div>
          <div className="dialog__actions">
            <button className="button button--quiet" type="button" onClick={onClose}>Hủy</button>
            <button className="button button--primary" type="submit" disabled={saving}>
              {saving ? 'Đang lưu...' : orchid ? 'Lưu thay đổi' : 'Thêm vào bộ sưu tập'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
