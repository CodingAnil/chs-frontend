import React from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { MapPin, Phone, Mail, Clock, Award, Users, Truck } from "react-feather";

import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { toastMessage } from "../../config/toast";

function AmbulanceProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useGetMountData(
    userId ? `/ambulance/viewprofile/${userId}` : null
  );

  const userProfileId = getLocalStorage(STORAGE.USER_KEY);

  if (!data) {
    return (
      <>
        <Header />
        <Breadcrumb />
        <div className="content">
          <Container>
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  const ambulanceProfile = data?.data?.profile || {};

  return (
    <>
      <style jsx>{`
        .profile-container {
          padding: 40px 0;
        }
        .profile-header {
          background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
          color: white;
          padding: 40px 0;
          border-radius: 15px;
          margin-bottom: 30px;
        }
        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid white;
          object-fit: cover;
          margin-bottom: 20px;
        }
        .availability-status {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 10px;
        }
        .availability-status.available {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .availability-status.unavailable {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>

      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <div className="profile-container">
            <div className="profile-header text-center">
              {/* ✅ Show Image OR Truck Icon */}
              {ambulanceProfile?.coverImage ? (
                <img
                  src={ambulanceProfile.coverImage}
                  alt={ambulanceProfile?.displayName}
                  className="profile-image"
                />
              ) : (
                <div
                  className="profile-icon mb-3 d-flex justify-content-center align-items-center"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "#f0f8ff",
                    border: "4px solid white",
                    margin: "0 auto 20px auto",
                  }}
                >
                  <Truck size={60} color="#007bff" />
                </div>
              )}

              <h1 className="profile-name">
                {ambulanceProfile?.displayName || "Ambulance Service"}
              </h1>

              <p className="profile-designation">
                {ambulanceProfile?.designation || "Ambulance Driver"}
              </p>

              {ambulanceProfile?.address && (
                <div className="profile-location">
                  <MapPin size={16} className="icon" /> {ambulanceProfile.address}
                </div>
              )}

              <div
                className={`availability-status ${
                  ambulanceProfile?.availability ? "available" : "unavailable"
                }`}
              >
                {ambulanceProfile?.availability
                  ? "Available"
                  : "Currently Unavailable"}
              </div>
            </div>

            <Row>
              <Col lg="6">
                <Card className="info-card p-3 mb-3">
                  <h5>Contact Information</h5>

                  {ambulanceProfile?.phoneNumber && (
                    <div className="info-item mb-2">
                      <Phone size={18} className="icon" />{" "}
                      <strong>Phone:</strong> {ambulanceProfile.phoneNumber}
                    </div>
                  )}

                  {ambulanceProfile?.email && (
                    <div className="info-item mb-2">
                      <Mail size={18} className="icon" />{" "}
                      <strong>Email:</strong> {ambulanceProfile.email}
                    </div>
                  )}

                  {ambulanceProfile?.address && (
                    <div className="info-item mb-2">
                      <MapPin size={18} className="icon" />{" "}
                      <strong>Address:</strong> {ambulanceProfile.address}
                    </div>
                  )}
                </Card>
              </Col>

              <Col lg="6">
                <Card className="info-card p-3 mb-3">
                  <h5>Ambulance Details</h5>

                  {ambulanceProfile?.ambulanceDetails?.vehicleNumber && (
                    <div className="info-item mb-2">
                      <Award size={18} className="icon" />{" "}
                      <strong>Vehicle Number:</strong>{" "}
                      {ambulanceProfile.ambulanceDetails.vehicleNumber}
                    </div>
                  )}

                  {ambulanceProfile?.ambulanceDetails?.ambulanceType && (
                    <div className="info-item mb-2">
                      <Award size={18} className="icon" />{" "}
                      <strong>Type:</strong>{" "}
                      {ambulanceProfile.ambulanceDetails.ambulanceType}
                    </div>
                  )}

                  <div className="info-item mb-2">
                    <Clock size={18} className="icon" />{" "}
                    <strong>Working Hours:</strong>{" "}
                    {ambulanceProfile?.workingHours?.start || "09:00"} -{" "}
                    {ambulanceProfile?.workingHours?.end || "18:00"}
                  </div>
                </Card>
              </Col>
            </Row>

            {ambulanceProfile?.specializations?.length > 0 && (
              <Card className="info-card p-3 mb-3">
                <h5>Specializations</h5>
                <div className="d-flex flex-wrap gap-2">
                  {ambulanceProfile.specializations.map((item, idx) => (
                    <span
                      key={idx}
                      className="badge bg-primary-subtle text-primary border"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {ambulanceProfile?.serviceAreas?.length > 0 && (
              <Card className="info-card p-3 mb-3">
                <h5>Service Areas</h5>
                <div className="d-flex flex-wrap gap-2">
                  {ambulanceProfile.serviceAreas.map((item, idx) => (
                    <span
                      key={idx}
                      className="badge bg-info-subtle text-info border"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            <div className="text-center mt-4">
              <Button variant="outline-primary" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default AmbulanceProfile;
