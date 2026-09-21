import { Button, Card, Col, Container, Row } from 'react-bootstrap';

function OrchidGallery() {
  return (
    <section id="gallery" className="py-5">
      <Container>
        <div className="mb-4">
          <p className="text-uppercase text-secondary fw-semibold mb-1">Gallery</p>
          <h2 className="fw-bold">Featured Orchids</h2>
          <p className="text-secondary mb-0">
            Static cards today; data-driven reusable cards arrive with Props in Slot 04.
          </p>
        </div>
        <Row className="g-4">
          <Col xs={12} sm={6} lg={4}>
            <Card className="h-100 orchid-card shadow-sm">
              <Card.Img variant="top" src="/images/PhucSensei.jpg" alt="Purple orchid" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>Thay Phuc</Card.Title>
                <Card.Text>Phalaenopsis - soft light and moderate watering.</Card.Text>
                <Button variant="outline-primary" className="mt-auto">View Orchid</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="h-100 orchid-card shadow-sm">
              <Card.Img variant="top" src="/labs/SBA301-slot3/public/images/orchid-01.svg" alt="Pink orchid" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>Thay Phuc</Card.Title>
                <Card.Text>Dendrobium - bright indirect light and airy roots.</Card.Text>
                <Button variant="outline-primary" className="mt-auto">View Orchid</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="h-100 orchid-card shadow-sm">
              <Card.Img variant="top" src="/images/PhucSensei.jpg" alt="White orchid" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>Thay Phuc</Card.Title>
                <Card.Text>Vanda - warm conditions and strong filtered light.</Card.Text>
                <Button variant="outline-primary" className="mt-auto">View Orchid</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="h-100 orchid-card shadow-sm">
              <Card.Img variant="top" src="/images/PhucSensei.jpg" alt="Yellow orchid" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>Thay Phuc</Card.Title>
                <Card.Text>Oncidium - good airflow and careful moisture control.</Card.Text>
                <Button variant="outline-primary" className="mt-auto">View Orchid</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="h-100 orchid-card shadow-sm">
              <Card.Img variant="top" src="/images/PhucSensei.jpg" alt="Orange orchid" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>Thay Phuc</Card.Title>
                <Card.Text>Cattleya - bright light and a drying period between watering.</Card.Text>
                <Button variant="outline-primary" className="mt-auto">View Orchid</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="h-100 orchid-card shadow-sm">
              <Card.Img variant="top" src="/images/PhucSensei.jpg" alt="Blue orchid illustration" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>Thay Phuc</Card.Title>
                <Card.Text>Practice sample - use this card to discuss reuse and Props next slot.</Card.Text>
                <Button variant="outline-primary" className="mt-auto">View Orchid</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default OrchidGallery;
