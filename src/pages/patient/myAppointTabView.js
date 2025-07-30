import React, { useState } from "react";
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
    ap.paymentStatus === "Completed" ||
    ap.paymentStatus === "Paid";
  if (ap.calculatedFare > 0 || ap.kilometersDriven > 0) {
    return (
      <div>
        {showLabel && <b>Fare:</b>} ₹{ap.calculatedFare?.toFixed(2) || "0.00"}{" "}
        <span style={{ color: paid ? "green" : "red", fontWeight: 600 }}>
          {paid ? "Paid" : "Pending"}
        </span>
        {ap.kilometersDriven > 0 && (
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
  if (!paid && ap.calculatedFare === 0 && ap.status === "Completed") {
    // Mark pending if completed but never paid
    return (
      <span style={{ color: "red", fontWeight: 600 }}>
        Pending Payment
      </span>
    );
  }
  return null;
}

const MyAppointTabView = ({ appointmentData }) => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;
  const [modalType, setModalType] = useState(""); // "details" or "delete"
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const dispatch = useDispatch();

  const isUpcoming = (ap) => ["Pending", "Accepted"].includes(ap.status);
  const isCancel = (ap) => ap.status === "Cancelled";
  const isComplete = (ap) => ap.status === "Completed";
  const upcomingAppointments = appointmentData.filter(isUpcoming);
  const canceledAppointments = appointmentData.filter(isCancel);
  const completedAppointments = appointmentData.filter(isComplete);

  const openModal = (type, appointment = null) => {
    setModalType(type);
    setSelectedAppointment(appointment);
  };
  const closeModal = () => {
    setModalType("");
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
  const renderAppointmentRow = (ap, canCancel = false) => (
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
          </div>
          {getAmbulanceDetails(ap)}
          {getPaymentDetails(ap)}
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
  const renderTabAppointments = (appts, emptyMsg, canCancel = false) =>
    appts.length === 0
      ? <NotFound message={emptyMsg} />
      : appts.map(ap => renderAppointmentRow(ap, canCancel));

  return (
    <>
      <div className="dashboard-header"><h3>Appointments</h3></div>
      <div className="appointment-tab-head mb-2">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="pills-upcoming-tab"
                data-bs-toggle="pill" data-bs-target="#pills-upcoming" type="button" role="tab">
                Upcoming <span>{upcomingAppointments.length}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-cancel-tab"
                data-bs-toggle="pill" data-bs-target="#pills-cancel" type="button" role="tab">
                Cancelled <span>{canceledAppointments.length}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-complete-tab"
                data-bs-toggle="pill" data-bs-target="#pills-complete" type="button" role="tab">
                Completed <span>{completedAppointments.length}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content appointment-tab-content p-2">
        <div className="tab-pane fade show active" id="pills-upcoming" role="tabpanel">
          {renderTabAppointments(upcomingAppointments, "No upcoming appointments found.", true)}
        </div>
        <div className="tab-pane fade" id="pills-cancel" role="tabpanel">
          {renderTabAppointments(canceledAppointments, "No cancelled appointments found.")}
        </div>
        <div className="tab-pane fade" id="pills-complete" role="tabpanel">
          {renderTabAppointments(completedAppointments, "No completed appointments found.")}
        </div>
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
              </div>
              {getPaymentDetails(ap)}
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
