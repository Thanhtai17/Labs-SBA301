import { useEffect, useState, useMemo, useCallback } from 'react';
import ListOfOrchids from './components/ListOfOrchids';
import EditOrchid from './components/EditOrchid';
import { getOrchids, getOrchid, createOrchid, updateOrchid, deleteOrchid } from './services/orchidApi';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1566958769312-82cef41d19ef?auto=format&fit=crop&w=1000&q=85';

export default function App() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedOrchid, setSelectedOrchid] = useState(null);
  const [editor, setEditor] = useState(null); // null | { orchid: null (new) | orchid (edit) }
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getOrchids();
      setOrchids(response.data || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    return Array.from(new Set(orchids.map((o) => o.orchidCategory).filter(Boolean)));
  }, [orchids]);

  const visibleOrchids = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    return orchids.filter((orchid) => {
      const matchesCategory =
        activeCategory === 'all' || orchid.orchidCategory === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${orchid.orchidName} ${orchid.orchidCategory} ${orchid.orchidDescription || ''}`
          .toLocaleLowerCase('vi')
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [orchids, query, activeCategory]);

  async function saveOrchid(form) {
    setSaving(true);
    setError('');
    try {
      if (editor.orchid) {
        await updateOrchid(editor.orchid.orchidId, form);
      } else {
        await createOrchid(form);
      }
      setEditor(null);
      await loadData();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  }

  async function removeOrchid(orchid) {
    if (!window.confirm(`Bạn có chắc muốn xóa "${orchid.orchidName}" khỏi bộ sưu tập?`)) return;
    setError('');
    try {
      await deleteOrchid(orchid.orchidId);
      setOrchids((current) => current.filter((item) => item.orchidId !== orchid.orchidId));
      if (selectedOrchid?.orchidId === orchid.orchidId) setSelectedOrchid(null);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Xóa thất bại.');
    }
  }

  async function viewOrchid(orchid) {
    setSelectedOrchid(orchid);
    try {
      const res = await getOrchid(orchid.orchidId);
      setSelectedOrchid(res.data);
    } catch (requestError) {
      // Keep selected orchid from list if error
    }
  }

  const naturalCount = orchids.filter((orchid) => orchid.natural !== undefined ? orchid.natural : orchid.isNatural).length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Orchid House trang chủ">
          <span className="brand__mark" aria-hidden="true">🌸</span>
          <span>orchid<span className="brand__light">house</span></span>
        </a>
        <div className="topbar__right">
          <span className="connection-indicator"><i /> Bộ sưu tập của tôi</span>
          <span className="avatar" aria-label="Tài khoản">O</span>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero__copy">
            <div className="eyebrow"><span /> KHÔNG GIAN XANH CỦA BẠN</div>
            <h1>Vẻ đẹp nở rộ<br /><em>trong tầm tay.</em></h1>
            <p>Quản lý và lưu giữ những giống lan yêu thích trong bộ sưu tập riêng của bạn.</p>
            <button className="button button--primary hero__button" onClick={() => { setError(''); setEditor({ orchid: null }); }}>
              <span aria-hidden="true">+</span> Thêm hoa lan
            </button>
          </div>
          <div className="hero__art" role="img" aria-label="Hoa lan đẹp" />
          <div className="hero__note"><span>01</span> YOUR PRIVATE GARDEN</div>
        </section>

        <section className="collection">
          <div className="collection__heading">
            <div>
              <div className="eyebrow">TỪ KHU VƯỜN CỦA BẠN</div>
              <h2>Bộ sưu tập <span>hoa lan</span></h2>
            </div>
            <div className="collection-stats">
              <div><strong>{orchids.length.toString().padStart(2, '0')}</strong><span>Giống lan</span></div>
              <div><strong>{naturalCount.toString().padStart(2, '0')}</strong><span>Tự nhiên</span></div>
            </div>
          </div>

          <div className="toolbar">
            <div className="category-tabs" aria-label="Lọc theo danh mục">
              <button
                className={activeCategory === 'all' ? 'category-tab is-active' : 'category-tab'}
                onClick={() => setActiveCategory('all')}
              >
                Tất cả <span>{orchids.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={activeCategory === cat ? 'category-tab is-active' : 'category-tab'}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <label className="search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm hoa lan..."
                aria-label="Tìm hoa lan"
              />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm">×</button>}
            </label>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button className="button button--quiet" onClick={loadData}>Thử lại</button>
              <button className="error-banner__close" onClick={() => setError('')} aria-label="Đóng thông báo">×</button>
            </div>
          )}

          {loading ? (
            <div className="loading-state" role="status"><span className="spinner" /> Đang tải bộ sưu tập...</div>
          ) : (
            <ListOfOrchids
              orchids={visibleOrchids}
              onView={viewOrchid}
              onEdit={(orchid) => { setError(''); setEditor({ orchid }); }}
              onDelete={removeOrchid}
            />
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="brand brand--footer" href="/">
          <span className="brand__mark">🌸</span>
          <span>orchid<span className="brand__light">house</span></span>
        </a>
        <span>Nuôi dưỡng vẻ đẹp, từng cánh hoa một.</span>
        <span className="footer__status"><i /> ĐÃ ĐỒNG BỘ</span>
      </footer>

      {editor && (
        <EditOrchid
          orchid={editor.orchid}
          categories={categories}
          onClose={() => setEditor(null)}
          onSave={saveOrchid}
          saving={saving}
          apiError={error}
        />
      )}

      {selectedOrchid && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedOrchid(null)}>
          <section className="dialog detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="icon-button detail-dialog__close" onClick={() => setSelectedOrchid(null)} aria-label="Đóng">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <img
              src={selectedOrchid.orchidURL || selectedOrchid.orchidUrl || DEFAULT_IMG}
              alt={selectedOrchid.orchidName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMG;
              }}
            />
            <div className="detail-dialog__content">
              <div className="eyebrow">
                {selectedOrchid.orchidCategory || 'LAN'} • {(selectedOrchid.natural !== undefined ? selectedOrchid.natural : selectedOrchid.isNatural) ? 'TỰ NHIÊN' : 'LAI TẠO'}
                {(selectedOrchid.attractive !== undefined ? selectedOrchid.attractive : selectedOrchid.isAttractive) ? ' • ⭐ NỔI BẬT' : ''}
              </div>
              <h2 id="detail-title">{selectedOrchid.orchidName}</h2>
              <p>{selectedOrchid.orchidDescription || 'Một vẻ đẹp tinh tế trong bộ sưu tập của bạn.'}</p>
              <strong style={{ color: '#526d55' }}>
                {(selectedOrchid.attractive !== undefined ? selectedOrchid.attractive : selectedOrchid.isAttractive) ? 'Giống hoa lan tiêu biểu ⭐' : (selectedOrchid.orchidCategory || 'Phong lan quý')}
              </strong>
              <button className="button button--primary" onClick={() => { setEditor({ orchid: selectedOrchid }); setSelectedOrchid(null); }}>
                Chỉnh sửa thông tin
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
