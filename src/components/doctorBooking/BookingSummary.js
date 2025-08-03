import React from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import message from "../../assets/img/icons/device-message.svg";
import { Card, CardBody, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "react-feather";

export default function BookingSummary({ data, type, price, formData }) {
  console.log("BookingSummary - type:", type);
  console.log("BookingSummary - data:", data);

  const getTitlePrefix = () => {
    if (["pathology", "biomedical", "hospital", "ambulance"].includes(type)) {
      return "";
    }
    if (data?.designation?.toLowerCase().includes("nurse")) {
      return "";
    }
    return "Dr. ";
  };

  const getProfileImageBlock = () => {
    let imgSrc = null;
    let icon = "fas fa-user-nurse";
    let color = "#17a2b8";

    if (type === "ambulance") {
      imgSrc = data?.coverImage;
      icon = "fas fa-ambulance";
      color = "#007bff";
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
                  {data?.languages && <p>{data.languages.join(", ")}</p>}
                  {type === "nurse" && data?.qualifications?.qualification && (
                    <p><strong>Qualification:</strong> {data.qualifications.qualification}</p>
                  )}
                  {type === "nurse" && data?.skills?.length > 0 && (
                    <p><strong>Skills:</strong> {data.skills.join(", ")}</p>
                  )}
                  {type === "nurse" && (
                    <>
                      <p><strong>Per Hour Rate:</strong> ₹{price || 0}</p>
                      {formData?.hourlyDuration && (
                        <p><strong>Total Cost:</strong> ₹{(price || 0) * (formData.hourlyDuration || 1)}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="booking-card mt-3">
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