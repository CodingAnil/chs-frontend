import React from "react";
import { Home, User } from "react-feather";

export default function ConsultationType({
  formData,
  onConsultationTypeChange,
  type, // Add type prop to determine if it's a nurse
}) {
  return (
    <>
      <div className="row">
        <div className="col-lg-8 col-md-6">
          <div className="paitent-header">
            <h4 className="paitent-title">Type of Consultation</h4>
          </div>
          <div className="consultation-grid">
            <div className="consultation-info">
              <p>In-Person Services</p>
              <div className="consultation-list">
                <ul>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "Home" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("Home")}
                    >
                      <a href="#">
                        <Home /> &nbsp; Home Visit
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div
                      className={`consultation-types ${
                        formData.appointmentType === "Consult" ? "active" : ""
                      }`}
                      onClick={() => onConsultationTypeChange("Consult")}
                    >
                      <a href="#">
                        <User /> &nbsp; In-Person Consult
                      </a>
                      <span>
                        <i className="fas fa-circle-check"></i>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}