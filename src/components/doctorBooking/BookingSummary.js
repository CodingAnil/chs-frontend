import React from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import message from "../../assets/img/icons/device-message.svg";
import { Card, CardBody, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BookingSummary({ data, type }) {
  console.log("BookingSummary - type:", type);
  console.log("BookingSummary - data:", data);

  const getTitlePrefix = () => {
    if (["nurse", "pathology", "biomedical", "hospital", "ambulance"].includes(type)) {
      return "";
    }
    if (data?.designation?.toLowerCase().includes("nurse")) {
      return "";
    }
    return "Dr. ";
  };

  const getProfileImageBlock = () => {
    let imgSrc = null;
    let icon = null;
    let color = "#007bff";

    if (type === "ambulance") {
      imgSrc = data?.coverImage;
      icon = "fas fa-ambulance";
    } else if (type === "doctor") {
      imgSrc = data?.profileImage;
      icon = "fas fa-user-md";
      color = "#28a745";
    } else if (type === "nurse") {
      imgSrc = data?.profileImage;
      icon = "fas fa-user-nurse";
      color = "#17a2b8";
    } else if (type === "pathology") {
      imgSrc = data?.profileImage;
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
          style={{ width: 50, height: 50, objectFit: "cover", background: "#f1f3f5" }}
        />
      );
    }

    return (
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "#f1f3f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color,
        }}
      >
        <i className={icon}></i>
      </div>
    );
  };

  const getFullName = () => {
    if (data?.displayName) return data.displayName;
    if (data?.firstName && data?.lastName) return `${data.firstName} ${data.lastName}`;
    if (data?.firstName) return data.firstName;
    if (data?.name) return data.name;
    if (data?.hospitalName) return data.hospitalName;
    if (data?.companyName) return data.companyName;
    return getDefaultName();
  };

  const getDefaultName = () => {
    switch (type) {
      case "biomedical":
        return "Biomedical Service";
      case "hospital":
        return "Hospital Service";
      case "ambulance":
        return "Ambulance Service";
      case "pathology":
        return "Pathology Lab";
      case "nurse":
        return "Nursing Service";
      default:
        return "Healthcare Provider";
    }
  };

  const getDefaultDesignation = () => {
    switch (type) {
      case "biomedical":
        return "Biomedical Engineer";
      case "hospital":
        return "Hospital Service";
      case "ambulance":
        return "Emergency Service";
      case "pathology":
        return "Pathology Lab";
      case "nurse":
        return "Registered Nurse";
      default:
        return "Doctor";
    }
  };

  return (
    <>
      <Col lg="4" md="12">
        <div className="booking-header">
          <h4 className="booking-title">Booking Summary</h4>
        </div>

        {/* ✅ Main Profile Card */}
        <Card className="booking-card">
          <CardBody className="booking-card-body">
            <div className="booking-doctor-details">
              <div className="booking-doctor-left">
                <div className="booking-doctor-img">
                  <Link to="#">{getProfileImageBlock()}</Link>
                </div>
                <div className="booking-doctor-info">
                  <h4>
                    <Link to="#">
                      {getTitlePrefix()}
                      {getFullName()}
                    </Link>
                  </h4>
                  <p>{data?.designation || getDefaultDesignation()}</p>
                  <p>{data?.languages && data?.languages?.join(",")}</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

          {/* ✅ Ambulance Details Card */}
          {type === "ambulance" && (
          <Card className="booking-card mt-3">
            <CardBody>
              <h5 className="mb-3">🚑 Ambulance Details</h5>

              <p>
                <strong>Vehicle Number:</strong>{" "}
                {data?.ambulanceDetails?.vehicleNumber || "N/A"}
              </p>
              <p>
                <strong>Ambulance Type:</strong>{" "}
                {data?.ambulanceDetails?.ambulanceType || "N/A"}
              </p>
              <p>
                <strong>Base Location:</strong>{" "}
                {data?.availabilityDetails?.baseLocation || "N/A"}
              </p>
              <p>
                <strong>Service Areas:</strong>{" "}
                {data?.serviceAreas?.length ? data.serviceAreas.join(", ") : "Not specified"}
              </p>
              <p>
                <strong>City Rate:</strong> ₹{data?.availabilityDetails?.cityRate || 0}
              </p>
              <p>
                <strong>Out of City Rate:</strong> ₹
                {data?.availabilityDetails?.outOfCityRate || 0}
              </p>
              <p>
                <strong>Service Radius:</strong>{" "}
                {data?.availabilityDetails?.serviceRadius || 0} Km
              </p>
              <p>
                <strong>24x7 Available:</strong>{" "}
                {data?.availabilityDetails?.twentyFourHour ? "✅ Yes" : "❌ No"}
              </p>
            </CardBody>
          </Card>
        )}

        {/* ✅ Help Card */}
        <Card className="booking-card">
          <CardBody className="booking-card-body">
            <div className="booking-device">
              <div className="booking-device-img">
                <img src={message} alt="device-message" />
              </div>
              <div className="booking-doctor-info">
                <h3>We can help you</h3>
                <p className="device-text">
                  Contact us at <b>info@chshealthcare.in</b> or chat with our support team.
                </p>
                <Link to="/contact" className="btn">
                  Contact us
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>

      
      </Col>
    </>
  );
}
