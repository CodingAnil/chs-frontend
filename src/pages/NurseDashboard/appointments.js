import React, { useEffect, useState } from "react";
import user_img from "../../assets/img/dr_profile.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import NotFound from "../../components/common/notFound";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";
import { callPutApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import AppointmentDetails from "../../components/modals/appotmentDetails";
import AppointmentReports from "../../components/modals/patientReports";
import { Modal, Button, Form, Badge } from "react-bootstrap";

const Appointments = ({ activeKey }) => {
  const [tab, setTab] = useState("Accepted");
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const { data: AppointmentsCount, getAllData: getCounts } = useGetMountData(
    `/nurse/appointment-count/${userProfileId}`
  );

  const {
    data: Appointments,
    loading,
    getAllData,
    setData,
    customData,
    isOpen,
    setQuery,
    query,
    openModelWithItem,
  } = useGetMountData(`/nurse/appointment/${userProfileId}`);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const getByFilter = async (filter) => {
    setTab(filter);
    setQuery((pre) => ({ ...pre, status: filter }));
  };

  const handleUpdate = async (id, status, docId) => {
    try {
      const verifyResponse = await callPutApi(`/patient/appointment/${id}`, {
        status,
      });
      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      toastMessage(
        "success",
        status == "Rejected"
          ? "The appointment has been rejected."
          : "The appointment has been completed."
      );
      const updatedData = Appointments?.filter((item) => item?._id !== id);
      getCounts(`/nurse/appointment-count/${userProfileId}`);
      setData(updatedData || []);
    } catch (error) {
      toastMessage("error", "Appointment update process failed!");
    }
  };

  const handlePaymentUpdate = async (id, status) => {
    try {
      setUploading(true);
      const verifyResponse = await callPutApi(`/patient/appointment/${id}`, {
        paymentDetails: { paymentStatus: status },
      });

      if (!verifyResponse.status) throw new Error(verifyResponse.message);

      toastMessage("success", "Payment status updated successfully");
      getAllData(`/nurse/appointment/${userProfileId}`);
      setShowPaymentModal(false);
    } catch (error) {
      toastMessage("error", "Failed to update payment status!");
    } finally {
      setUploading(false);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      setUploading(true);
      const verifyResponse = await callPutApi(`/patient/appointment/${id}`, {
        status: "Completed",
      });

      if (!verifyResponse.status) throw new Error(verifyResponse.message);

      toastMessage("success", "Appointment marked as completed");
      getAllData(`/nurse/appointment/${userProfileId}`);
      getCounts(`/nurse/appointment-count/${userProfileId}`);
      setShowDetailsModal(false);
    } catch (error) {
      toastMessage("error", "Failed to complete appointment!");
    } finally {
      setUploading(false);
    }
  };

  const handleShowDetails = (appointment) => {
    setSelectedDetails(appointment);
    setShowDetailsModal(true);
  };

  const sortAppointments = (appointments) => {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA; // Always sort descending
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedAppointments = Appointments ? 
    sortAppointments(Appointments).slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil((Appointments?.length || 0) / itemsPerPage);

  const handleViewDetails = (appointment) => {
    setSelectedDetails(appointment);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    setQuery((pre) => ({ ...pre, status: "Accepted" }));
  }, []);

  useEffect(() => {
    if (activeKey && userProfileId) {
      getAllData(`/nurse/appointment/${userProfileId}`);
      getCounts(`/nurse/appointment-count/${userProfileId}`);
    }
  }, [activeKey, userProfileId]);

  return (
    <div>
      <div className="dashboard-header">
        <h3>Appointments</h3>
      </div>
      <div className="appointment-tab-head">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === "Accepted" ? "active" : ""}`}
                onClick={() => getByFilter("Accepted")}
              >
                Upcoming<span>{AppointmentsCount?.Accepted || 0}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === "Cancelled" ? "active" : ""}`}
                onClick={() => getByFilter("Cancelled")}
              >
                Cancelled<span>{AppointmentsCount?.Cancelled || 0}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${tab === "Completed" ? "active" : ""}`}
                onClick={() => getByFilter("Completed")}
              >
                Completed<span>{AppointmentsCount?.Completed || 0}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content appointment-tab-content">
        <NotFound
          loading={loading}
          isData={Appointments?.length > 0}
          message="No Appointments Found."
        />

        {!loading &&
          paginatedAppointments.map((it, index) => {
            return (
              <div className="appointment-wrap" key={index}>
                <ul>
                  <li>
                    <div className="patinet-information">
                      <img
                        src={it?.patientId?.coverImage || user_img}
                        alt="User Image"
                      />
                      <div className="patient-info">
                        <p>{getIdLastDigits(it?._id, "Ap")}</p>
                        <h6>
                          <a href="#">
                            {it?.appointmentPersonName ||
                              it?.patientId?.firstName}
                          </a>
                        </h6>
                      </div>
                    </div>
                  </li>
                  <li className="appointment-info">
                    <p>
                      <i className="fa-solid fa-clock"></i>{" "}
                      {`${getDateFormate(it?.date)} ${it?.time}`}
                    </p>
                    <ul className="d-flex apponitment-types">
                      {it?.appointmentType || "General Visit"}
                    </ul>
                  </li>
                  <li className="mail-info-patient">
                    <ul>
                      <li>
                        <i className="fa-solid fa-envelope"></i>
                        {it?.patientId?.email || "N/A"}
                      </li>
                    </ul>
                  </li>
                  {tab === "Accepted" ? (
                    <li className="appointment-action">
                      <ul>
                        <li>
                          <a onClick={() => handleShowDetails(it)}>
                            <i className="fa-solid fa-eye"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => {
                              setSelectedPayment(it);
                              setShowPaymentModal(true);
                            }}
                          >
                            <i className="fa-solid fa-money-bill"></i>
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleMarkComplete(it?._id)}>
                            <i className="fa-solid fa-check-circle"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => handleUpdate(it?._id, "Cancelled")}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </a>
                        </li>
                      </ul>
                    </li>
                  ) : (
                    <li className="appointment-detail-btn">
                      <a
                        onClick={() => handleViewDetails(it)}
                        className="start-link"
                        style={{ cursor: 'pointer' }}
                      >
                        View Details
                        <i className="fa-regular fa-circle-right ms-1"></i>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
      </div>

      {!loading && Appointments?.length > itemsPerPage && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(curr => Math.min(curr + 1, totalPages))}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}

      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Payment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div>
              <div className="mb-4">
                <h6>Appointment Details</h6>
                <p>
                  <strong>Patient:</strong>{" "}
                  {selectedPayment?.appointmentPersonName ||
                    selectedPayment?.patientId?.firstName}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {getDateFormate(selectedPayment?.date)} {selectedPayment?.time}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{selectedPayment?.amount || 0}
                </p>
                <p>
                  <strong>Current Status:</strong>
                  <Badge
                    bg={
                      selectedPayment?.paymentDetails?.paymentStatus ===
                      "Completed"
                        ? "success"
                        : selectedPayment?.paymentDetails?.paymentStatus ===
                          "Pending"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {selectedPayment?.paymentDetails?.paymentStatus || "Pending"}
                  </Badge>
                </p>
              </div>
              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  onClick={() =>
                    handlePaymentUpdate(selectedPayment._id, "Completed")
                  }
                  disabled={
                    uploading ||
                    selectedPayment?.paymentDetails?.paymentStatus ===
                      "Completed"
                  }
                >
                  Mark as Paid
                </Button>
                <Button
                  variant="warning"
                  onClick={() =>
                    handlePaymentUpdate(selectedPayment._id, "Pending")
                  }
                  disabled={
                    uploading ||
                    selectedPayment?.paymentDetails?.paymentStatus === "Pending"
                  }
                >
                  Mark as Pending
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDetails && (
            <div className="appointment-details">
              <div className="row">
                <div className="col-md-6">
                  <div className="section mb-4">
                    <h6 className="text-primary">Basic Information</h6>
                    <p>
                      <strong>Appointment ID:</strong>{" "}
                      {getIdLastDigits(selectedDetails._id, "AP")}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {getDateFormate(selectedDetails.date)}
                    </p>
                    <p>
                      <strong>Time:</strong> {selectedDetails.time}
                    </p>
                    <p>
                      <strong>Type:</strong>{" "}
                      {selectedDetails.appointmentType || "General"}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <Badge
                        bg={
                          selectedDetails.status === "Completed"
                            ? "success"
                            : selectedDetails.status === "Accepted"
                            ? "primary"
                            : selectedDetails.status === "Cancelled"
                            ? "danger"
                            : "warning"
                        }
                        className="ms-2"
                      >
                        {selectedDetails.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="section mb-4">
                    <h6 className="text-primary">Patient Information</h6>
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedDetails.appointmentPersonName ||
                        selectedDetails?.patientId?.firstName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedDetails?.patientId?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedDetails?.patientId?.phoneNumber}
                    </p>
                  </div>
                  <div className="section mb-4">
                    <h6 className="text-primary">Payment Information</h6>
                    <p>
                      <strong>Amount:</strong> ₹{selectedDetails.amount || 0}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>
                      <Badge
                        bg={
                          selectedDetails?.paymentDetails?.paymentStatus ==
                          "completed"
                            ? "success"
                            : "warning"
                        }
                      >
                        {selectedDetails?.paymentDetails?.paymentStatus ||
                          "Pending"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedDetails?.status === "Accepted" && (
            <>
              <Button
                variant="success"
                onClick={() => handleMarkComplete(selectedDetails._id)}
                disabled={uploading}
              >
                Mark as Completed
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPayment(selectedDetails);
                  setShowPaymentModal(true);
                }}
              >
                Update Payment
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Appointments;
