import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import biomedical_img from "../../assets/img/dr_profile.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import NotFound from "../../components/common/notFound";
import { getDateFormate, getIdLastDigits, formatName } from "../../helpers/utils";
import { putDataAPI } from "../../helpers/axiosInstance";
import { toastMessage } from "../../config/toast";

const Appointments = ({ biomedicalDetails }) => {
  const [tab, setTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 5;

  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const {
    data: appointments,
    loading,
    getAllData,
    setQuery,
    query,
  } = useGetMountData(userProfileId ? `/biomedical/appointments` : null);

  const getByFilter = async (filter) => {
    setTab(filter);
    if (filter === "all") {
      setQuery((pre) => ({ ...pre, status: undefined }));
    } else {
      // Convert filter to match the API status format
      const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Accepted',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      };
      setQuery((pre) => ({ ...pre, status: statusMap[filter] }));
    }
  };

  const handleModelShow = (appointment = null) => {
    setSelectedAppointment(appointment);
    setServiceNotes(appointment?.serviceNotes || "");
    setEstimatedCost(appointment?.estimatedCost || "");
    setShowModal(true);
  };

  const handleModelClose = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setStatusUpdate("");
    setServiceNotes("");
    setEstimatedCost("");
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      // Don't allow completion if payment is pending
      if (newStatus.toLowerCase() === 'completed') {
        const appointment = appointments.find(app => app._id === appointmentId);
        if (!appointment.isPaid && appointment.paymentStatus !== 'Completed') {
          toastMessage("error", "Cannot complete service before payment is done");
          return;
        }
      }

      const statusMap = {
        'confirmed': 'Accepted',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'pending': 'Pending'
      };

      const response = await putDataAPI(`/biomedical/appointments/${appointmentId}`, {
        status: statusMap[newStatus] || newStatus
      });
      
      if (response.success) {
        toastMessage("success", `Service request ${newStatus} successfully`);
        getAllData(); // Refresh appointments
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      toastMessage("error", error.message || "Failed to update service request status");
    }
  };

  const handleServiceUpdate = async () => {
    try {
      if (!selectedAppointment) return;

      const updateData = {
        serviceNotes,
        estimatedCost: parseFloat(estimatedCost) || 0,
        isPaid: false, // Reset payment status when cost is updated
      };

      const response = await putDataAPI(`/biomedical/appointments/${selectedAppointment._id}`, updateData);
      
      if (response.success) {
        toastMessage("success", "Service details and cost updated successfully");
        getAllData();
        handleModelClose();
      } else {
        throw new Error(response.message || "Failed to update service details");
      }
    } catch (error) {
      toastMessage("error", error.message || "Failed to update service details");
    }
  };

  useEffect(() => {
    if (userProfileId) {
      getAllData();
    }
  }, [userProfileId]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "badge-warning";
      case "confirmed":
        return "badge-primary";
      case "completed":
        return "badge-success";
      case "cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const getServiceTypeIcon = (serviceType) => {
    switch (serviceType?.toLowerCase()) {
      case "maintenance":
        return "fa-wrench";
      case "repair":
        return "fa-screwdriver";
      case "installation":
        return "fa-plug";
      case "calibration":
        return "fa-sliders-h";
      case "inspection":
        return "fa-search";
      case "emergency":
        return "fa-exclamation-triangle";
      default:
        return "fa-tools";
    }
  };

  const getUrgencyBadgeClass = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "badge-danger";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-info";
      default:
        return "badge-secondary";
    }
  };

  // Add pagination and search filter
  const filteredAppointments = appointments?.filter((appointment) => {
    const matchesSearch = (
      appointment.patientId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesTab = tab === "all" || 
      appointment.status?.toLowerCase() === (tab === "confirmed" ? "accepted" : tab).toLowerCase();
    return matchesSearch && matchesTab;
  }) || [];

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="service-dashboard">
      <div className="dashboard-header">
        <h3>Biomedical Service Requests</h3>
        
        {/* Add Search Input */}
        <div className="search-container mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by email or service ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="service-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="filter-buttons">
            <Button
              className={`me-2 ${tab === "all" ? "btn-primary" : "btn-light"}`}
              onClick={() => getByFilter("all")}
            >
              All Requests
            </Button>
            <Button
              className={`me-2 ${tab === "pending" ? "btn-warning" : "btn-light"}`}
              onClick={() => getByFilter("pending")}
            >
              Pending
            </Button>
            <Button
              className={`me-2 ${tab === "confirmed" ? "btn-primary" : "btn-light"}`}
              onClick={() => getByFilter("confirmed")}
            >
              Confirmed
            </Button>
            <Button
              className={`me-2 ${tab === "completed" ? "btn-success" : "btn-light"}`}
              onClick={() => getByFilter("completed")}
            >
              Completed
            </Button>
            <Button
              className={`${tab === "cancelled" ? "btn-danger" : "btn-light"}`}
              onClick={() => getByFilter("cancelled")}
            >
              Cancelled
            </Button>
          </div>
        </div>

        <div className="table-container mt-4">
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : appointments?.length > 0 ? (
            <div className="card">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ minWidth: "100px" }}>Service ID</th>
                      <th style={{ minWidth: "200px" }}>Patient</th>
                      <th style={{ minWidth: "180px" }}>Equipment</th>
                      <th style={{ minWidth: "140px" }}>Service Type</th>
                      <th style={{ minWidth: "160px" }}>Date & Time</th>
                      <th style={{ minWidth: "100px" }}>Priority</th>
                      <th style={{ minWidth: "100px" }}>Status</th>
                      <th style={{ minWidth: "120px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAppointments.map((appointment) => (
                      <tr key={appointment._id} className="border-bottom">
                        <td>
                          <div className="fw-semibold text-primary">
                            #{getIdLastDigits(appointment._id, "SR-")}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="patient-avatar rounded-circle bg-light text-primary d-flex align-items-center justify-content-center" 
                                 style={{ width: "40px", height: "40px", fontSize: "18px" }}>
                              {appointment.patientId?.firstName?.[0] || "U"}
                            </div>
                            <div>
                              <div className="fw-semibold mb-1">{appointment.patientId?.firstName}</div>
                              <small className="text-muted">{appointment.patientId?.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold mb-1">{appointment.equipmentType || "N/A"}</span>
                            <small className="text-muted text-truncate" style={{ maxWidth: "150px" }}>
                              {appointment.issueDescription || "No description"}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className={`fa-solid ${getServiceTypeIcon(appointment.preferredServiceType)} me-2`}></i>
                            <span className="badge bg-info-subtle text-info">
                              {appointment.preferredServiceType || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{getDateFormate(appointment.date)}</span>
                            <small className="text-muted">{appointment.time || "N/A"}</small>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getUrgencyBadgeClass(appointment.urgencyLevel)} rounded-pill`}>
                            {appointment.urgencyLevel || "Normal"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(appointment.status)} rounded-pill`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => handleModelShow(appointment)}
                              title="View Details"
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            {appointment.status === "Pending" && (
                              <>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
                                  title="Accept Request"
                                >
                                  <i className="fa-solid fa-check"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
                                  title="Cancel Request"
                                >
                                  <i className="fa-solid fa-times"></i>
                                </button>
                              </>
                            )}
                            {appointment.status === "Accepted" && (
                              <>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleStatusUpdate(appointment._id, "completed")}
                                  disabled={!appointment.isPaid && appointment.paymentStatus !== 'Completed'}
                                  title={!appointment.isPaid ? "Cannot complete before payment" : "Mark as completed"}
                                >
                                  <i className="fa-solid fa-check-double"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleModelShow(appointment)}
                                  title="Update Cost"
                                >
                                  <i className="fa-solid fa-dollar-sign"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <NotFound message="No service requests found" />
          )}
        </div>

        {/* Add Pagination */}
        <div className="pagination-container mt-3 d-flex justify-content-center">
          <Button
            variant="light"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <span className="mx-3">
            Page {currentPage} of {Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)}
          </span>
          <Button
            variant="light"
            disabled={currentPage >= Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Service Request Details Modal */}
      <Modal
        show={showModal}
        onHide={handleModelClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        className="service-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Service Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="service-request-details">
              <div className="row">
                <div className="col-md-6">
                  <div className="detail-section">
                    <h6>Patient Information</h6>
                    <div className="detail-item">
                      <label>Name:</label>
                      <p>{formatName(selectedAppointment.patientId?.firstName, selectedAppointment.patientId?.lastName)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <p>{selectedAppointment.patientId?.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <p>{selectedAppointment.patientId?.phoneNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-section">
                    <h6>Service Information</h6>
                    <div className="detail-item">
                      <label>Service Type:</label>
                      <p>
                        <i className={`fa-solid ${getServiceTypeIcon(selectedAppointment.serviceType)} me-2`}></i>
                        {selectedAppointment.serviceType}
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Equipment Type:</label>
                      <p>{selectedAppointment.patientDetails?.equipmentType}</p>
                    </div>
                    <div className="detail-item">
                      <label>Equipment Model:</label>
                      <p>{selectedAppointment.patientDetails?.equipmentModel || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="detail-section">
                    <h6>Appointment Details</h6>
                    <div className="detail-item">
                      <label>Date:</label>
                      <p>{getDateFormate(selectedAppointment.appointmentDate)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Time:</label>
                      <p>{selectedAppointment.appointmentTime}</p>
                    </div>
                    <div className="detail-item">
                      <label>Priority:</label>
                      <p>
                        <span className={`badge ${
                          selectedAppointment.priority === "emergency" ? "badge-danger" :
                          selectedAppointment.priority === "urgent" ? "badge-warning" :
                          "badge-info"
                        }`}>
                          {selectedAppointment.priority || "normal"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-section">
                    <h6>Status & Cost</h6>
                    <div className="detail-item">
                      <label>Status:</label>
                      <p>
                        <span className={`badge ${getStatusBadgeClass(selectedAppointment.status)}`}>
                          {selectedAppointment.status}
                        </span>
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Estimated Cost:</label>
                      <p>₹{selectedAppointment.estimatedCost || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6>Problem Description</h6>
                <div className="detail-item">
                  <p>{selectedAppointment.patientDetails?.description || "No description provided"}</p>
                </div>
              </div>

              <div className="detail-section">
                <h6>Service Notes</h6>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add service notes, observations, or recommendations..."
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="detail-section">
                <h6>Estimated Cost</h6>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="number"
                    placeholder="Enter estimated cost"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="detail-section">
                <h6>Payment Information</h6>
                <div className="detail-item">
                  <label>Payment Status:</label>
                  <p>
                    <span className={`badge ${selectedAppointment.isPaid || selectedAppointment.paymentStatus === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                      {selectedAppointment.isPaid || selectedAppointment.paymentStatus === 'Completed' ? 'Paid' : 'Pending'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModelClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleServiceUpdate}>
            Update Service Details
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Appointments;