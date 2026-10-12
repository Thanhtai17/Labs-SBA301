import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="shadow-sm py-2 mb-2 sticky-top" style={{ backgroundColor: "#141e30" }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2 text-warning fs-4">
          <span>🌸</span>
          <span>Orchid Management</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link
              as={Link}
              to="/"
              className={`px-3 py-2 rounded-3 ${location.pathname === "/" ? "active fw-bold text-white bg-primary bg-opacity-75" : "text-light"}`}
            >
              🌺 Bộ sưu tập & Quản lý
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/orchids/new"
              className={`btn btn-warning text-dark fw-bold px-3 py-2 ms-lg-2`}
              style={{ textDecoration: "none" }}
            >
              + Thêm Hoa Lan Mới
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
