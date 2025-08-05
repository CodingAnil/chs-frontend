import React, { useState, useEffect } from "react";
import { Card, Table, Button, Badge, Row, Col, Form, Modal, Pagination } from "react-bootstrap";

import useGetMountData from "../../helpers/getDataHook";
import { callPutApi, callPostApi } from "../../_service";
import { toast } from "react-toastify";
import NotFound from "../../components/common/notFound";
import {
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";

import drProfileImg from "../../assets/img/dr_profile.jpg";

const Appointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  // Add this state at the top of your component
const [showAmountModal, setShowAmountModal] = useState(false);
const [newAmount, setNewAmount] = useState("");


  // New Admission modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmission, setNewAdmission] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    department: "General",
    serviceType: "Consultation",
    admissionDate: "",
    priority: "normal",
  });

  const {
    data: appointments,
    loading,
    getAllData,
    setQuery,
    pagination,
  } = useGetMountData(`/hospital/appointments`);

  const statusFilters = [
    { key: "all", label: "All Admissions", count: appointments?.length || 0 },
    { key: "pending", label: "Pending", count: appointments?.filter(a => a.status === "Pending")?.length || 0 },
    { key: "confirmed", label: "Confirmed", count: appointments?.filter(a => a.status === "Confirmed")?.length || 0 },
    { key: "in-progress", label: "In Progress", count: appointments?.filter(a => a.status === "In Progress")?.length || 0 },
    { key: "completed", label: "Completed", count: appointments?.filter(a => a.status === "Completed")?.length || 0 },
    { key: "cancelled", label: "Cancelled", count: appointments?.filter(a => a.status === "Cancelled")?.length || 0 },
  ];

  useEffect(() => {
    handleFilterChange("all");
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    const filterQuery = filter === "all" ? {} : { status: filter };
    setQuery(prev => ({ ...prev, ...filterQuery, search: searchTerm }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setQuery(prev => ({ 
      ...prev, 
      search: value,
      ...(activeFilter !== "all" && { status: activeFilter })
    }));
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await callPutApi(`/hospital/appointments/${appointmentId}/status`, {
        status: newStatus,
      });

      if (response?.success || response?.status) {
        toast.success(`Admission ${newStatus.toLowerCase()} successfully`);
        getAllData();
        setShowDetailModal(false);
      } else {
        toast.error("Failed to update admission status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update admission status");
    }
  };

  // Add this function near your other functions
// Replace the current function with this corrected version:
const updateAppointmentAmount = async (appointmentId, newAmount) => {
  try {
    // Remove setLoading(true); - you don't have setLoading in scope
    
    const response = await callPutApi(`/hospital/appointments/${appointmentId}/amout`, {
      amount: newAmount
    });
    
    if (response?.success) {
      toast.success("Amount updated successfully"); // Changed from toastMessage
      // Update the local state
      setSelectedAppointment(prev => ({
        ...prev,
        amount: newAmount
      }));
      // Refresh the appointments list
      getAllData();
    } else {
      throw new Error(response?.message || "Failed to update amount");
    }
  } catch (error) {
    console.error("Error updating amount:", error);
    toast.error(error.message || "Failed to update amount"); 
  }
  // Remove finally block with setLoading
};

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "warning";
      case "confirmed": return "info";
      case "in-progress": return "primary";
      case "completed": return "success";
      case "cancelled": return "danger";
      default: return "secondary";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "emergency": return "danger";
      case "urgent": return "warning";
      case "normal": return "success";
      default: return "secondary";
    }
  };

  const filteredAppointments = appointments?.filter(appointment => {
    const matchesFilter = activeFilter === "all" || 
      appointment.status?.toLowerCase() === activeFilter;
    const matchesSearch = !searchTerm || 
      appointment.patientDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }) || [];

  return (
    <div className="hospital-appointments">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-0">
            <i className="fas fa-bed me-2"></i>
            Hospital Admissions Management
          </h4>
          <p className="text-muted">Manage patient admissions and hospital services</p>
        </Col>
      </Row>

      {/* Filter Buttons */}
      <Row className="mb-4">
        <Col>
          <div className="filter-buttons">
            {statusFilters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "primary" : "outline-primary"}
                className={`filter-btn ${activeFilter === filter.key ? "active" : ""}`}
                onClick={() => handleFilterChange(filter.key)}
              >
                {filter.label}
                <Badge bg="light" text="dark" className="ms-2">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="search"
              placeholder="Search by patient name, department, or service..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </Form.Group>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" className="me-2" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus me-1"></i>
            New Admission
          </Button>
          <Button variant="outline-primary">
            <i className="fas fa-download me-1"></i>
            Export
          </Button>
        </Col>
      </Row>

      {/* Appointments Table */}
      <Card className="appointments-table">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Admissions List
              </h5>
            </Col>
            <Col xs="auto">
              <Form.Select size="sm" defaultValue="10">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading admissions...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Patient Details</th>
                    <th>Department</th>
                    <th>Service Type</th>
                    <th>Admission Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment, index) => (
                    <tr key={appointment._id || index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={appointment.patientDetails?.profileImage || drProfileImg}
                            alt="Patient"
                            className="rounded-circle me-3"
                            width="45"
                            height="45"
                          />
                          <div>
                            <h6 className="mb-1">{appointment.patientId?.firstName || "N/A"}</h6>
                            <small className="text-muted">
                              ID: #{getIdLastDigits(appointment._id)}
                            </small>
                            <br />
                            <small className="text-muted">
                              {appointment.patientDetails?.age ? `${appointment.patientDetails.age}y` : ""} 
                              {appointment.patientDetails?.gender ? ` • ${appointment.patientDetails.gender}` : ""}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="department-badge">
                          {appointment.department || "General"}
                        </Badge>
                      </td>
                      <td>
                        <span className="service-type">
                          {appointment.serviceType || "Consultation"}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">
                            {getDateFormate(appointment.date)}
                          </div>
                          <small className="text-muted">
                            {appointment.time || "All Day"}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getPriorityBadge(appointment.priority)}>
                          {appointment.priority || "Normal"}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          bg={getStatusVariant(appointment.status)}
                          className="status-badge"
                        >
                          {appointment.status || "Pending"}
                        </Badge>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="action-btn me-1"
                            onClick={() => handleViewDetails(appointment)}
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          
                          {appointment.status === "Pending" && (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="action-btn me-1"
                                onClick={() => updateAppointmentStatus(appointment._id, "Confirmed")}
                              >
                                <i className="fas fa-check"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="action-btn"
                                onClick={() => updateAppointmentStatus(appointment._id, "Cancelled")}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            </>
                          )}
                          
                          {appointment.status === "Confirmed" && (
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="action-btn"
                              onClick={() => updateAppointmentStatus(appointment._id, "In Progress")}
                            >
                              <i className="fas fa-play"></i>
                            </Button>
                          )}
                          
                          {appointment.status === "In Progress" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="action-btn"
                              onClick={() => updateAppointmentStatus(appointment._id, "Completed")}
                            >
                              <i className="fas fa-check-circle"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <NotFound 
                message={
                  searchTerm 
                    ? `No admissions found matching "${searchTerm}"` 
                    : activeFilter === "all" 
                      ? "No admissions found" 
                      : `No ${activeFilter} admissions found`
                } 
              />
            </div>
          )}
        </Card.Body>
        
        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <Card.Footer>
            <Row className="align-items-center">
              <Col>
                <small className="text-muted">
                  Showing {pagination.page} of {pagination.pages} pages 
                  ({pagination.total} total admissions)
                </small>
              </Col>
              <Col xs="auto">
                <Pagination size="sm" className="mb-0">
                  <Pagination.Prev disabled={pagination.page === 1} />
                  {[...Array(pagination.pages)].map((_, i) => (
                    <Pagination.Item 
                      key={i + 1} 
                      active={i + 1 === pagination.page}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next disabled={pagination.page === pagination.pages} />
                </Pagination>
              </Col>
            </Row>
          </Card.Footer>
        )}
      </Card>

      {/* Appointment Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)} 
        size="xl"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-info-circle me-2"></i>
            Admission Details - #{getIdLastDigits(selectedAppointment?._id)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
  {selectedAppointment && (
    <Row>
      {/* Patient Information */}
      <Col md={6}>
        <Card className="mb-3">
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-user me-2"></i>
              Patient Information
            </h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <img
                src={selectedAppointment.patientId?.coverImage || drProfileImg}
                alt="Patient"
                className="rounded-circle me-3"
                width="60"
                height="60"
              />
              <div>
                <h6 className="mb-0">
                  {selectedAppointment.patientId?.firstName} {selectedAppointment.patientId?.lastName || ''}
                </h6>
                <small className="text-muted">Patient ID: {selectedAppointment.patientId?._id}</small>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-6">
                <strong>Age:</strong> {selectedAppointment.patientId?.age || "N/A"}
              </div>
              <div className="col-6">
                <strong>Gender:</strong> {selectedAppointment.patientId?.gender || "N/A"}
              </div>
              <div className="col-12 mt-2">
                <strong>Contact:</strong> {selectedAppointment.patientId?.phoneNumber || "N/A"}
              </div>
              <div className="col-12 mt-2">
                <strong>Email:</strong> {selectedAppointment.patientId?.email || "N/A"}
              </div>
              <div className="col-12 mt-2">
                <strong>Blood Group:</strong> {selectedAppointment.patientId?.bloodGroup || "N/A"}
              </div>
              <div className="col-12 mt-2">
                <strong>Address:</strong> {selectedAppointment.patientId?.address || "N/A"}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={6}>
        <Card className="mb-3">
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-calendar-check me-2"></i>
              Appointment Information
            </h6>
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-12 mb-2">
                <strong>Department:</strong>
                <Badge bg="light" text="dark" className="ms-2">
                  {selectedAppointment.department || "General"}
                </Badge>
              </div>
              <div className="col-12 mb-2">
                <strong>Service Type:</strong> 
                <Badge bg="info" className="ms-2">
                  {selectedAppointment.serviceType || selectedAppointment.appointmentType || "N/A"}
                </Badge>
              </div>
              <div className="col-6 mb-2">
                <strong>Date:</strong> {selectedAppointment.date ? getDateFormate(selectedAppointment.date) : "N/A"}
              </div>
              <div className="col-6 mb-2">
                <strong>Time:</strong> {selectedAppointment.time || "All Day"}
              </div>
              <div className="col-6 mb-2">
                <strong>Urgency Level:</strong>
                <Badge bg={getPriorityBadge(selectedAppointment.urgencyLevel)} className="ms-2">
                  {selectedAppointment.urgencyLevel || "Normal"}
                </Badge>
              </div>
              <div className="col-6 mb-2">
                <strong>Status:</strong>
                <Badge bg={getStatusVariant(selectedAppointment.status)} className="ms-2">
                  {selectedAppointment.status || "Pending"}
                </Badge>
              </div>
              <div className="col-12 mb-2">
                <strong>Appointment For:</strong> {selectedAppointment.appointmentFor || "Self"}
              </div>
              <div className="col-12 mb-2">
                <strong>Preferred Doctor:</strong> {selectedAppointment.preferredDoctor || "No Preference"}
              </div>
            </div>
            
            {selectedAppointment.reason && (
              <div className="mt-3">
                <strong>Reason for Visit:</strong>
                <p className="mt-1 text-muted">{selectedAppointment.reason}</p>
              </div>
            )}

            {selectedAppointment.symptoms && (
              <div className="mt-3">
                <strong>Symptoms/Notes:</strong>
                <p className="mt-1 text-muted">{selectedAppointment.symptoms}</p>
              </div>
            )}

            {selectedAppointment.medicalCondition && (
              <div className="mt-3">
                <strong>Medical Condition:</strong>
                <p className="mt-1 text-muted">{selectedAppointment.medicalCondition}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Additional Information */}
      <Col md={12}>
        <Card className="mb-3">
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-info-circle me-2"></i>
              Additional Details
            </h6>
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-md-4 mb-2">
                <strong>Booking Type:</strong> 
                <Badge bg="secondary" className="ms-2">
                  {selectedAppointment.bookingType || "Single"}
                </Badge>
              </div>
              <div className="col-md-4 mb-2">
                <strong>Duration:</strong> {selectedAppointment.duration || 1} day(s)
              </div>
              <div className="col-md-4 mb-2">
                <strong>Priority Booking:</strong> 
                {selectedAppointment.priorityBooking ? (
                  <Badge bg="warning" className="ms-2">Yes</Badge>
                ) : (
                  <Badge bg="light" text="dark" className="ms-2">No</Badge>
                )}
              </div>
              <div className="col-md-4 mb-2">
                <strong>Insurance:</strong> 
                {selectedAppointment.isInsurance ? (
                  <Badge bg="success" className="ms-2">Covered</Badge>
                ) : (
                  <Badge bg="light" text="dark" className="ms-2">Not Covered</Badge>
                )}
              </div>
              <div className="col-md-4 mb-2">
                <strong>Payment Status:</strong> 
                <Badge bg={selectedAppointment.paymentDetails?.paymentStatus === 'completed' ? 'success' : 'warning'} className="ms-2">
                  {selectedAppointment.paymentDetails?.paymentStatus || "Pending"}
                </Badge>
              </div>
              <div className="col-md-4 mb-2">
                <strong>Amount:</strong> ₹{selectedAppointment.amount || "0"}
              </div>
            </div>

            {selectedAppointment.emergencyContact && (
              <div className="mt-3">
                <strong>Emergency Contact:</strong>
                <p className="mt-1 text-muted">{selectedAppointment.emergencyContact}</p>
              </div>
            )}

            {selectedAppointment.comments && (
              <div className="mt-3">
                <strong>Additional Comments:</strong>
                <p className="mt-1 text-muted">{selectedAppointment.comments}</p>
              </div>
            )}

            {selectedAppointment.attachment && (
              <div className="mt-3">
                <strong>Attachment:</strong>
                <a href={selectedAppointment.attachment} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary ms-2">
                  <i className="fas fa-paperclip me-1"></i>
                  View Attachment
                </a>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )}
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
    Close
  </Button>
  
  <Button 
    variant="warning" 
    onClick={() => {
      setNewAmount(selectedAppointment?.amount || "0");
      setShowAmountModal(true);
    }}
  >
    <i className="fas fa-rupee-sign me-1"></i>
    Update Amount
  </Button>

  {selectedAppointment?.status === "Pending" && (
    <>
      <Button 
        variant="success" 
        onClick={() => updateAppointmentStatus(selectedAppointment._id, "Confirmed")}
      >
        <i className="fas fa-check me-1"></i>
        Confirm Admission
      </Button>
      <Button 
        variant="danger" 
        onClick={() => updateAppointmentStatus(selectedAppointment._id, "Cancelled")}
      >
        <i className="fas fa-times me-1"></i>
        Cancel
      </Button>
    </>
  )}
  
  {selectedAppointment?.status === "Confirmed" && (
    <Button 
      variant="primary" 
      onClick={() => updateAppointmentStatus(selectedAppointment._id, "In Progress")}
    >
      <i className="fas fa-play me-1"></i>
      Start Treatment
    </Button>
  )}
  
  {selectedAppointment?.status === "In Progress" && (
    <Button 
      variant="success" 
      onClick={() => updateAppointmentStatus(selectedAppointment._id, "Completed")}
    >
      <i className="fas fa-check-circle me-1"></i>
      Mark Complete
    </Button>
  )}
</Modal.Footer>
      </Modal>

      {/* Amount Update Modal */}
<Modal show={showAmountModal} onHide={() => setShowAmountModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Update Amount</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group>
      <Form.Label>Enter New Amount (₹)</Form.Label>
      <Form.Control
        type="number"
        value={newAmount}
        onChange={(e) => setNewAmount(e.target.value)}
        placeholder="Enter amount"
        min="0"
        step="0.01"
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAmountModal(false)}>
      Cancel
    </Button>
    <Button 
      variant="primary" 
      onClick={() => {
        if (newAmount && !isNaN(newAmount)) {
          updateAppointmentAmount(selectedAppointment._id, parseFloat(newAmount));
          setShowAmountModal(false);
        }
      }}
    >
      Update Amount
    </Button>
  </Modal.Footer>
</Modal>

      {/* Add Admission Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>New Admission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="patientName">
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAdmission.patientName}
                    onChange={(e) => setNewAdmission({ ...newAdmission, patientName: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="patientAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    value={newAdmission.patientAge}
                    onChange={(e) => setNewAdmission({ ...newAdmission, patientAge: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="patientGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={newAdmission.patientGender}
                    onChange={(e) => setNewAdmission({ ...newAdmission, patientGender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="department">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAdmission.department}
                    onChange={(e) => setNewAdmission({ ...newAdmission, department: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="serviceType">
                  <Form.Label>Service Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAdmission.serviceType}
                    onChange={(e) => setNewAdmission({ ...newAdmission, serviceType: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="admissionDate">
                  <Form.Label>Admission Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newAdmission.admissionDate}
                    onChange={(e) => setNewAdmission({ ...newAdmission, admissionDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newAdmission.priority}
                    onChange={(e) => setNewAdmission({ ...newAdmission, priority: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={async () => {
            try {
              const response = await callPostApi('/hospital/appointments', newAdmission);
              if (response?.success || response?.status) {
                toast.success('Admission created successfully');
                setShowAddModal(false);
                // refresh list
                getAllData();
              } else {
                toast.error(response?.message || 'Failed to create admission');
              }
            } catch (err) {
              console.error(err);
              toast.error('Failed to create admission');
            }
          }}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Appointments; 