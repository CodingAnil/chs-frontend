import React, { useState, useEffect } from "react"; // Add useEffect
import { Modal } from "react-bootstrap"; // Add this import at top
import user_img from "../../assets/img/dr_profile.jpg";
import { useDispatch } from "react-redux";
import {
  getAllAppointment,
  updateAppointmentStatus,
} from "../../redux/slices/patientApi";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";
import NotFound from "../../components/common/notFound";
import AppointmentDetails from "../../components/modals/appotmentDetails";
import DeleteModal from "../../components/modals/delete-modal";
import Pagination from "../../components/common/pagination";

// Utility to pick the actual provider name, especially for ambulance
function getProviderName(ap) {
  if (ap.refAmbulance)
    return (
      ap.refAmbulance.displayName ||
      `${ap.refAmbulance.firstName || ""} ${ap.refAmbulance.lastName || ""}`.trim() ||
      ap.refAmbulance.vehicleNumber ||
      "Ambulance"
    );
  if (ap.refDoctor)
    return `Dr ${ap.refDoctor.displayName || ap.refDoctor.firstName || "Unknown"}`;
  if (ap.refNurse)
    return ap.refNurse.displayName ||
           `Nurse ${ap.refNurse.firstName || ""} ${ap.refNurse.lastName || ""}`.trim();
  if (ap.refPathology)
    return (
      ap.refPathology.labName ||
      `${ap.refPathology.firstName || ""} ${ap.refPathology.lastName || ""}`.trim()
    );
  if (ap.refBiomedical)
    return (
      ap.refBiomedical.displayName ||
      `${ap.refBiomedical.firstName || ""} ${ap.refBiomedical.lastName || ""}`.trim() ||
      "Biomedical Engineer"
    );
  if (ap.refHospital)
    return (
      ap.refHospital.hospitalName ||
      ap.refHospital.displayName ||
      `${ap.refHospital.firstName || ""} ${ap.refHospital.lastName || ""}`.trim() ||
      "Hospital"
    );
  return "Unknown Provider";
}

// Render provider image or ambulance FontAwesome icon
function renderProviderVisual(ap) {
  // Ambulance logic: FA icon if no image
  if (ap.refAmbulance) {
    if (ap.refAmbulance.coverImage) {
      return (
        <img
          src={ap.refAmbulance.coverImage}
          alt="Ambulance"
          className="rounded-circle"
          style={{ width: 45, height: 45, objectFit: "cover", background: "#eee" }}
        />
      );
    }
    // No coverImage? Show ambulance icon
    return (
      <span
        className="d-flex align-items-center justify-content-center bg-light rounded-circle"
        style={{ width: 45, height: 45, fontSize: 26, color: "#007bff" }}
      >
        <i className="fas fa-ambulance" />
      </span>
    );
  }
  // Other roles fallback
  const img =
    ap.refDoctor?.coverImage ||
    ap.refNurse?.coverImage ||
    ap.refPathology?.coverImage ||
    ap.refHospital?.coverImage ||
    user_img;
  return (
    <img
      src={img}
      alt="Provider"
      className="rounded-circle"
      style={{ width: 45, height: 45, objectFit: "cover", background: "#eee" }}
    />
  );
}

function getAmbulanceDetails(ap) {
  if (!ap.refAmbulance) return null;
  return (
    <div className="text-muted" style={{ fontSize: 13 }}>
      Vehicle: {ap.refAmbulance.vehicleNumber || "N/A"}
      {ap.refAmbulance.vehicleType && ` (${ap.refAmbulance.vehicleType})`}
    </div>
  );
}

function getPaymentDetails(ap, showLabel = true) {
  const paid =
    ap.isPaid === true ||
    ap.paymentStatus?.toLowerCase() === "completed" ||
    ap.paymentStatus?.toLowerCase() === "paid";

  let amount = 0;
  if (ap.refAmbulance) {
    amount = ap.calculatedFare || 0;
  } else if (ap.refNurse || ap.refPathology) {
    amount = ap.amount || 0;
  } else if (ap.refBiomedical) {
    amount = ap.estimatedCost || 0;
  } else if (ap.refHospital) {
    amount = ap.amount || 0;
  }

  if (amount > 0) {
    return (
      <div>
        {showLabel && <b>Amount:</b>} ₹{amount?.toFixed(2) || "0.00"}{" "}
        <span style={{ color: paid ? "green" : "red", fontWeight: 600 }}>
          {paid ? "Paid" : "Pending"}
        </span>
        {ap.refAmbulance && ap.kilometersDriven > 0 && (
          <>
            {(showLabel ? <><br /></> : " ")}
            <span style={{ fontSize: 13, color: "#888" }}>
              Km: {ap.kilometersDriven}
            </span>
          </>
        )}
      </div>
    );
  }

  if (!paid && ap.status === "Completed") {
    return (
      <span style={{ color: "red", fontWeight: 600 }}>
        Pending Payment
      </span>
    );
  }

  return null;
}

function getReportDetails(ap) {
  if (!ap.refPathology || ap.status !== "Completed") return null;
  
  const hasReport = ap.prescriptionFile || ap.reportFile;
  const reportUrl = ap.prescriptionFile || ap.reportFile;
  const testResults = ap.prescriptionText || ap.testResults;
  
  return {
    hasReport,
    reportUrl,
    testResults
  };
}

const MyAppointTabView = ({ appointmentData }) => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;
  const [modalType, setModalType] = useState(""); // "details" or "delete"
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('upcoming'); // Add this state
  const [showReportModal, setShowReportModal] = useState(false); // Add this state
  const itemsPerPage = 10;
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset pagination when tab changes
    setCurrentPage(1);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const isUpcoming = (ap) => {
    if (!ap || !ap.status) return false;
    const status = ap.status.toLowerCase().replace(/\s+/g, '');
    return ["pending", "accepted", "inprogress","confirmed"].includes(status);
  };

  const isCancel = (ap) => {
    if (!ap || !ap.status) return false;
    return ap.status.toLowerCase() === "cancelled";
  };

  const isComplete = (ap) => {
    if (!ap || !ap.status) return false;
    return ap.status.toLowerCase() === "completed";
  };

  const sortAppointments = (appointments) => {
    if (!Array.isArray(appointments)) return [];
    return [...appointments].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  };

  const upcomingAppointments = sortAppointments(appointmentData?.filter(isUpcoming) || []);
  const canceledAppointments = sortAppointments(appointmentData?.filter(isCancel) || []);
  const completedAppointments = sortAppointments(appointmentData?.filter(isComplete) || []);

  const paginateData = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const openModal = (type, appointment = null) => {
    if (type === "report") {
      setShowReportModal(true);
    } else {
      setModalType(type);
    }
    setSelectedAppointment(appointment);
  };

  const closeModal = () => {
    setModalType("");
    setSelectedAppointment(null);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedAppointment(null);
  };

  const handleCancelAppointment = async (id) => {
    await dispatch(
      updateAppointmentStatus({ data: { id: id, status: "Cancelled" } })
    ).then(() => {
      closeModal();
      dispatch(getAllAppointment(userProfileId));
    });
  };

  // List card content
  const renderAppointmentRow = (ap, canCancel = false) => {
    const paid =
      ap.isPaid === true ||
      ap.paymentStatus?.toLowerCase() === "completed" ||
      ap.paymentStatus?.toLowerCase() === "paid";

    // Check if there's any payment amount
    let hasPaymentAmount = false;
    if (ap.refAmbulance && (ap.calculatedFare > 0)) {
      hasPaymentAmount = true;
    } else if ((ap.refNurse || ap.refPathology) && (ap.amount > 0)) {
      hasPaymentAmount = true;
    } else if (ap.refBiomedical && (ap.estimatedCost > 0)) {
      hasPaymentAmount = true;
    } else if (ap.refHospital && (ap.amount > 0)) {
      hasPaymentAmount = true;
    }
    debugger;

    return (
      <div
        key={ap._id}
        className="appointment-wrap my-2 p-3 rounded shadow-sm bg-white d-flex flex-wrap align-items-center justify-content-between"
        style={{ minHeight: 75, border: "1px solid #ececec" }}
      >
        <div className="d-flex align-items-center flex-grow-1">
          {renderProviderVisual(ap)}
          <div className="ms-3">
            <div className="fw-bold" style={{ fontSize: 16 }}>
              {getProviderName(ap)}
            </div>
            <div className="text-muted" style={{ fontSize: 13 }}>
              #{getIdLastDigits(ap._id, "AP")}
              <br />
              <span className="badge bg-info me-1">
                {ap.appointmentType} {ap.refBiomedical && `- ${ap.preferredServiceType}`}
              </span>
              {hasPaymentAmount && (
                <span className={`badge ${paid ? 'bg-success' : 'bg-warning'} ms-1`}>
                  <i className={`fas fa-${paid ? 'check' : 'clock'} me-1`}></i>
                  {paid ? 'Paid' : 'Payment Pending'}
                </span>
              )}
              {getPaymentDetails(ap, false)}
            </div>
            {getAmbulanceDetails(ap)}
          </div>
        </div>
        <div className="d-flex flex-column align-items-end gap-2">
          <div>
            <i className="fa-solid fa-clock me-1 text-secondary"></i>
            {ap.date ? getDateFormate(ap.date) : "--"}
            {ap.time ? `, ${ap.time}` : ""}
          </div>
          <div>
            <span className="badge bg-secondary me-1" style={{ textTransform: "capitalize" }}>
              {ap.appointmentType || "General Visit"}
            </span>
          </div>
          <div>
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => openModal("details", ap)}
            >
              Details
            </button>
            {ap.refPathology && ap.status === "Completed" && (
              <button
                className="btn btn-outline-info btn-sm me-2"
                onClick={() => openModal("report", ap)}
                disabled={!getReportDetails(ap)?.hasReport && !getReportDetails(ap)?.testResults}
              >
                View Report
              </button>
            )}
            {canCancel && (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => openModal("delete", ap)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  const renderTabAppointments = (appts, emptyMsg, canCancel = false) => {
    const paginatedAppts = paginateData(appts);
    return (
      <>
        {paginatedAppts.length === 0 ? (
          <NotFound message={emptyMsg} />
        ) : (
          <>
            {paginatedAppts.map(ap => renderAppointmentRow(ap, canCancel))}
            <Pagination
              currentPage={currentPage}
              totalItems={appts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div className="dashboard-header"><h3>Appointments</h3></div>
      <div className="appointment-tab-head mb-2">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => handleTabChange('upcoming')}
                type="button"
              >
                Upcoming <span>{upcomingAppointments.length}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'cancel' ? 'active' : ''}`}
                onClick={() => handleTabChange('cancel')}
                type="button"
              >
                Cancelled <span>{canceledAppointments.length}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'complete' ? 'active' : ''}`}
                onClick={() => handleTabChange('complete')}
                type="button"
              >
                Completed <span>{completedAppointments.length}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content appointment-tab-content p-2">
        {activeTab === 'upcoming' && (
          <div className="tab-pane fade show active">
            {renderTabAppointments(upcomingAppointments, "No upcoming appointments found.", true)}
          </div>
        )}
        {activeTab === 'cancel' && (
          <div className="tab-pane fade show active">
            {renderTabAppointments(canceledAppointments, "No cancelled appointments found.")}
          </div>
        )}
        {activeTab === 'complete' && (
          <div className="tab-pane fade show active">
            {renderTabAppointments(completedAppointments, "No completed appointments found.")}
          </div>
        )}
      </div>


      {/* Details Modal */}
      <AppointmentDetails
        showModal={modalType === "details"}
        handleModalClose={closeModal}
        selectedAppointment={selectedAppointment}
        type="patient"
        extraDetailsRender={ap =>
          ap ? (
            <>
              <div>
                <strong>Provider:</strong> {getProviderName(ap)}
                {getAmbulanceDetails(ap) && <> <br />{getAmbulanceDetails(ap)}</>}
                <br />
                <strong>Service Type:</strong> {ap.appointmentType}
                {ap.refBiomedical && (
                  <>
                    <br />
                    <strong>Equipment:</strong> {ap.equipmentType}
                    <br /> 
                    <strong>Service:</strong> {ap.preferredServiceType}
                    {ap.estimatedCost > 0 && (
                      <>
                        <br />
                        <strong>Estimated Cost:</strong> ₹{ap.estimatedCost}
                      </>
                    )}
                    {ap.issueDescription && (
                      <>
                        <br />
                        <strong>Issue:</strong> {ap.issueDescription}
                      </>
                    )}
                  </>
                )}
              </div>
              {getPaymentDetails(ap)}
              {ap.refPathology && ap.status === "Completed" && (
                <div className="mt-3">
                  <strong>Test Report:</strong>
                  {getReportDetails(ap)?.testResults && (
                    <div className="mt-2 p-3 bg-light rounded">
                      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                        {getReportDetails(ap).testResults}
                      </pre>
                    </div>
                  )}
                  {getReportDetails(ap)?.hasReport && (
                    <div className="mt-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => window.open(getReportDetails(ap).reportUrl, '_blank')}
                      >
                        <i className="fa-solid fa-file-medical me-2"></i>
                        Download Report
                      </button>
                    </div>
                  )}
                  {!getReportDetails(ap)?.hasReport && !getReportDetails(ap)?.testResults && (
                    <div className="text-muted mt-2">
                      Report not available yet
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null
        }
      />
      <DeleteModal
        type="appointment"
        isOpen={modalType === "delete"}
        onClose={closeModal}
        title="Are you sure you want to cancel this appointment?"
        onConfirm={() => handleCancelAppointment(selectedAppointment?._id)}
      />

      {/* Add Report Modal */}
      <Modal show={showReportModal} onHide={closeReportModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Test Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <div className="mb-3">
                <strong>Patient:</strong> {selectedAppointment.name || 'Patient'}
                <br />
                <strong>Test:</strong> {selectedAppointment.testName || 'General Test'}
                <br />
                <strong>Date:</strong> {getDateFormate(selectedAppointment.date)}
              </div>

              {getReportDetails(selectedAppointment)?.testResults && (
                <div className="mb-3">
                  <h6>Test Results:</h6>
                  <div className="p-3 bg-light rounded">
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                      {getReportDetails(selectedAppointment).testResults}
                    </pre>
                  </div>
                </div>
              )}

              {getReportDetails(selectedAppointment)?.hasReport && (
                <div className="mt-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => window.open(getReportDetails(selectedAppointment).reportUrl, '_blank')}
                  >
                    <i className="fa-solid fa-file-medical me-2"></i>
                    Download Report
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={closeReportModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .appointment-wrap { border: 1px solid #ececec; margin-bottom: 14px; background: #fff; }
        .dashboard-header { margin-bottom: 10px;}
        .appointment-tab-head { margin-bottom: 10px;}
        .fw-bold { font-weight: 600;}
      `}</style>
    </>
  );
};

export default MyAppointTabView;
