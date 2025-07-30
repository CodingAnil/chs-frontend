import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Image, Alert, Spinner } from "react-bootstrap";
import { getDateFormate, getIdLastDigits } from "../../helpers/utils";
import { callPostApi } from "../../_service";
import user_img from "../../assets/img/doctor-profile-img.jpg";

const getProviderName = (appt) => {
  if (appt.refAmbulance)
    return (
      appt.refAmbulance.displayName ||
      `${appt.refAmbulance.firstName || ""} ${appt.refAmbulance.lastName || ""}`.trim() ||
      appt.refAmbulance.vehicleNumber ||
      "Ambulance"
    );
  if (appt.refDoctor)
    return `Dr ${appt.refDoctor.displayName || appt.refDoctor.firstName || "Unknown"}`;
  if (appt.refNurse)
    return (
      appt.refNurse.displayName ||
      `Nurse ${appt.refNurse.firstName || ""} ${appt.refNurse.lastName || ""}`.trim()
    );
  if (appt.refPathology)
    return (
      appt.refPathology.labName ||
      `${appt.refPathology.firstName || ""} ${appt.refPathology.lastName || ""}`.trim()
    );
  return "Unknown Provider";
};

const AppointmentDetails = ({
  showModal,
  handleModalClose,
  selectedAppointment,
  user,
  onPaymentSuccess,
  onAppointmentUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(selectedAppointment);

  useEffect(() => {
    setCurrentAppointment(selectedAppointment);
    setError(null);
    setPaymentStatus(null);
  }, [selectedAppointment]);

  if (!currentAppointment) return null;

  const paid =
    currentAppointment.isPaid === true ||
    currentAppointment.paymentStatus?.toLowerCase() === "completed" ||
    currentAppointment.paymentStatus?.toLowerCase() === "paid";

  const canPay = currentAppointment.calculatedFare > 0 && !paid;

  const loadRazorpaySDK = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(window.Razorpay);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(script);
    });

  const refreshAppointmentData = async () => {
    try {
      const response = await callPostApi("/appointments/get-details", {
        appointmentId: currentAppointment._id,
        userId: getUserId(),
      });

      if (response.status && response.data) {
        setCurrentAppointment(response.data);
        if (onAppointmentUpdate) onAppointmentUpdate(response.data);
      }
    } catch (err) {
      console.error("Error refreshing appointment:", err);
    }
  };

  const getUserInfo = () => {
    if (user && user._id) return user;
    try {
      const stored = JSON.parse(localStorage.getItem("user-data"));
      return stored || null;
    } catch {
      return null;
    }
  };

  const getUserId = () => {
    const u = getUserInfo();
    return u?._id || null;
  };

  const getProfileImageBlock = (appt) => {
    let imgSrc = null;
    let icon = null;
    let color = "#007bff";
  
    if (appt.refAmbulance) {
      imgSrc = appt.refAmbulance.coverImage;
      icon = "fas fa-ambulance";
      color = "#007bff";
    } else if (appt.refDoctor) {
      imgSrc = appt.refDoctor.profileImage;
      icon = "fas fa-user-md";
      color = "#28a745";
    } else if (appt.refNurse) {
      imgSrc = appt.refNurse.profileImage;
      icon = "fas fa-user-nurse";
      color = "#17a2b8";
    } else if (appt.refPathology) {
      imgSrc = appt.refPathology.profileImage;
      icon = "fas fa-flask";
      color = "#ffc107";
    } else {
      imgSrc = user_img;
    }
  
    if (imgSrc) {
      return (
        <Image
          src={imgSrc}
          alt="Provider"
          roundedCircle
          fluid
          style={{ width: 90, height: 90, objectFit: "cover", background: "#f1f3f5" }}
        />
      );
    }
  
    return (
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "#f1f3f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 46,
          color,
        }}
      >
        <i className={icon}></i>
      </div>
    );
  };
  

  const handlePayNow = async () => {
    const u = getUserInfo();
    if (!currentAppointment || !u?._id) {
      setError("Missing appointment or user information");
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStatus("Initiating payment...");

    try {
      await loadRazorpaySDK();

      setPaymentStatus("Creating payment order...");

      const orderResponse = await callPostApi("/payment/create-order", {
        amount: currentAppointment.calculatedFare,
        currency: "INR",
      });

      if (!orderResponse.status) throw new Error(orderResponse.message || "Failed to create order");

      setPaymentStatus("Opening payment gateway...");

      const options = {
        key: "rzp_test_m7Sk7RENHjMHdW",
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency || "INR",
        name: "CHS Healthcare App",
        description: `Payment for appointment #${getIdLastDigits(currentAppointment._id, "AP")}`,
        order_id: orderResponse.data.id,
        handler: async (response) => {
          try {
            setPaymentStatus("Processing payment...");

            const updateResponse = await callPostApi("/payment/verify-appointment-payment", {
              appointmentId: currentAppointment._id,
              userId: u._id,
              amount: currentAppointment.calculatedFare,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!updateResponse.status)
              throw new Error(updateResponse.message || "Failed to update payment");

            setPaymentStatus("Payment successful!");
            await refreshAppointmentData();

            setLoading(false);

            if (onPaymentSuccess) onPaymentSuccess(updateResponse.data);

            setTimeout(() => setPaymentStatus(null), 2000);
          } catch (err) {
            console.error("Payment update error:", err);
            setError("Payment processing failed: " + err.message);
            setLoading(false);
            setPaymentStatus(null);
          }
        },
        prefill: {
          name: u?.name || u?.profile?.firstName || "",
          email: u?.email || "",
          contact: u?.phoneNumber || "",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentStatus(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setLoading(false);
      setPaymentStatus(null);
      setError("Payment failed to initiate: " + err.message);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await callPostApi(
        `/payment/appointment-payment-status/${currentAppointment._id}`,
        { userId: getUserId() }
      );
      if (response.status && response.data) {
        await refreshAppointmentData();
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
    }
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Appointment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {paymentStatus && (
          <Alert variant="info">
            <Spinner animation="border" size="sm" className="me-2" />
            {paymentStatus}
          </Alert>
        )}

        {/* Provider Info */}
        <Row className="mb-3 align-items-center">
  <Col md={4} className="text-center mb-3 mb-md-0">
    {getProfileImageBlock(currentAppointment)}
  </Col>
  <Col md={8}>
    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
      {getProviderName(currentAppointment)}
    </div>
  </Col>
</Row>
        <hr />

        <div className="mb-2">
          <b>Appointment ID:</b> #{getIdLastDigits(currentAppointment._id, "AP")} <br />
          <b>Status:</b>{" "}
          <span
            className={`ms-2 badge ${
              currentAppointment.status === "Accepted"
                ? "bg-success"
                : currentAppointment.status === "Pending"
                ? "bg-warning"
                : currentAppointment.status === "Completed"
                ? "bg-primary"
                : "bg-secondary"
            }`}
          >
            {currentAppointment.status}
          </span>{" "}
          <br />
          <b>Type:</b> {currentAppointment.appointmentType || "General Visit"} <br />
          <b>Reason:</b> {currentAppointment.reason || "N/A"} <br />
          <b>Date:</b>{" "}
          {currentAppointment.date ? getDateFormate(currentAppointment.date) : "N/A"} <br />
          <b>Time:</b> {currentAppointment.time || "N/A"} <br />
        </div>

        {/* Payment Section */}
        {currentAppointment.calculatedFare > 0 && (
          <div
            style={{
              marginBottom: 8,
              padding: 12,
              backgroundColor: paid ? "#f8f9fa" : "#fff3cd",
              borderRadius: 6,
              border: paid ? "1px solid #dee2e6" : "1px solid #ffeaa7",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <b>Fare:</b> ₹{currentAppointment.calculatedFare?.toFixed(2)}
              </div>
              <div>
                <span
                  style={{
                    color: paid ? "green" : "#856404",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {paid ? (
                    <>
                      <i className="fas fa-check-circle me-1"></i> Paid
                    </>
                  ) : (
                    <>
                      <i className="fas fa-exclamation-circle me-1"></i> Pending Payment
                    </>
                  )}
                </span>
              </div>
            </div>

            {canPay && (
              <div className="mt-2 d-flex gap-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={handlePayNow}
                  disabled={loading}
                  className="flex-grow-1"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card me-2"></i> Pay Now ₹
                      {currentAppointment.calculatedFare?.toFixed(2)}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={checkPaymentStatus}
                  disabled={loading}
                >
                  <i className="fas fa-sync-alt"></i>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Payment Details */}
        {currentAppointment.paymentDetails && paid && (
          <div
            style={{
              marginBottom: 8,
              fontSize: 12,
              color: "#666",
              backgroundColor: "#f8f9fa",
              padding: 8,
              borderRadius: 4,
            }}
          >
            <div className="row">
              <div className="col-6">
                <b>Payment ID:</b>
                <br />
                <small>
                  {currentAppointment.paymentDetails.razorpayPaymentId || "N/A"}
                </small>
              </div>
              <div className="col-6">
                <b>Payment Date:</b>
                <br />
                <small>
                  {currentAppointment.paymentDetails.paymentDate
                    ? new Date(currentAppointment.paymentDetails.paymentDate).toLocaleString()
                    : "N/A"}
                </small>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
            {currentAppointment.updatedAt && (
              <small className="text-muted">
                Last updated: {new Date(currentAppointment.updatedAt).toLocaleString()}
              </small>
            )}
          </div>
          <Button variant="secondary" onClick={handleModalClose} disabled={loading}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentDetails;
