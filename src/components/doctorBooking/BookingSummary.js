import React from "react";
import user_img from "../../assets/img/doctor-profile-img.jpg";
import message from "../../assets/img/icons/device-message.svg";
import { Card, CardBody, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "react-feather";

export default function BookingSummary({ data, type, price, formData }) {
  const getServiceTypeDetails = () => {
    const types = {
      doctor: {
        icon: "fas fa-user-md",
        color: "#28a745",
        defaultName: "Healthcare Provider",
        defaultDesignation: "Doctor",
        showTitle: true
      },
      nurse: {
        icon: "fas fa-user-nurse", 
        color: "#17a2b8",
        defaultName: "Nursing Service",
        defaultDesignation: "Registered Nurse",
        showTitle: false
      },
      ambulance: {
        icon: "fas fa-ambulance",
        color: "#007bff", 
        defaultName: "Ambulance Service",
        defaultDesignation: "Emergency Service",
        showTitle: false
      },
      biomedical: {
        icon: "fas fa-wrench",
        color: "#fd7e14",
        defaultName: "Biomedical Service",
        defaultDesignation: "Biomedical Engineer",
        showTitle: false
      },
      pathology: {
        icon: "fas fa-flask",
        color: "#ffc107",
        defaultName: "Pathology Lab",
        defaultDesignation: "Lab Service",
        showTitle: false
      },
      hospital: {
        icon: "fas fa-hospital",
        color: "#6f42c1",
        defaultName: "Hospital Service", 
        defaultDesignation: "Medical Facility",
        showTitle: false
      }
    };

    return types[type] || types.doctor;
  };

  const serviceDetails = getServiceTypeDetails();

  const getProfileImageBlock = () => {
    const imgSrc = data?.profileImage || data?.coverImage;

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
          color: serviceDetails.color,
        }}
      >
        <i className={serviceDetails.icon}></i>
      </div>
    );
  };

  const getDisplayName = () => {
    const name = data?.displayName || 
                `${data?.firstName || ''} ${data?.lastName || ''}`.trim() ||
                data?.name ||
                data?.hospitalName ||
                data?.companyName ||
                serviceDetails.defaultName;
    
    return serviceDetails.showTitle ? `Dr. ${name}` : name;
  };

  const getAdditionalInfo = () => {
    const info = [];

    if (data?.designation) {
      info.push(data.designation);
    } else {
      info.push(serviceDetails.defaultDesignation);
    }

    if (data?.languages?.length) {
      info.push(data.languages.join(", "));
    }

    if (type === "nurse") {
      if (data?.qualifications?.qualification) {
        info.push(`Qualification: ${data.qualifications.qualification}`);
      }
      if (data?.skills?.length) {
        info.push(`Skills: ${data.skills.join(", ")}`);
      }
      if (price) {
        info.push(`Per Hour Rate: ₹${price}`);
        if (formData?.hourlyDuration) {
          info.push(`Total Cost: ₹${price * formData.hourlyDuration}`);
        }
      }
    }

    return info;
  };

  const getServiceSpecificInfo = () => {
    switch (type) {
      case 'ambulance':
        return {
          details: [
            { label: 'Vehicle Type', value: data?.vehicleType || 'Standard Ambulance' },
            { label: 'Equipment', value: data?.equipment?.join(', ') || 'Basic Life Support' },
            { label: 'Response Time', value: data?.responseTime || 'Emergency Response' },
            { label: 'Service Area', value: data?.serviceArea || 'Local Region' }
          ]
        };
      case 'biomedical':
        return {
          details: [
            { label: 'Specialization', value: data?.specialization || 'General Equipment' },
            { label: 'Service Type', value: data?.serviceType || 'Maintenance & Repair' },
            { label: 'Experience', value: data?.experience ? `${data.experience} years` : 'Experienced' },
            { label: 'Certifications', value: data?.certifications?.join(', ') || 'Certified Engineer' }
          ]
        };
      case 'nurse':
        return {
          details: [
            { label: 'Experience', value: data?.experience ? `${data.experience} years` : 'Experienced' },
            { label: 'Shift Preference', value: data?.shiftPreference || 'Flexible' },
            { label: 'Specialization', value: data?.specialization || 'General Care' }
          ]
        };
      default:
        return { details: [] };
    }
  };

  return (
    <Col lg="12" md="12">
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
                  <Link to="#">{getDisplayName()}</Link>
                </h4>
                {getAdditionalInfo().map((info, index) => (
                  <p key={index}>{info}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Add Service Specific Details */}
          {getServiceSpecificInfo().details.length > 0 && (
            <div className="service-specific-details mt-3">
              <hr />
              <h5 className="mb-3">Service Details</h5>
              {getServiceSpecificInfo().details.map((detail, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span className="text-muted">{detail.label}:</span>
                  <span className="fw-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Add Booking Time Slot if available */}
          {formData?.date && formData?.time && (
            <div className="booking-time-details mt-3">
              <hr />
              <h5 className="mb-3">Appointment Details</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Date:</span>
                <span className="fw-medium">
                  {new Date(formData.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Time:</span>
                <span className="fw-medium">{formData.time}</span>
              </div>
            </div>
          )}

          {/* Add Price Summary if applicable */}
          {price && (
            <div className="price-summary mt-3">
              <hr />
              <h5 className="mb-3">Price Details</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Base Rate:</span>
                <span className="fw-medium">₹{price}</span>
              </div>
              {formData?.hourlyDuration && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Duration:</span>
                    <span className="fw-medium">{formData.hourlyDuration} hours</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 total-amount">
                    <span className="fw-bold">Total Amount:</span>
                    <span className="fw-bold text-primary">₹{price * formData.hourlyDuration}</span>
                  </div>
                </>
              )}
            </div>
          )}
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
  );
}