import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Container, Card, CardBody, Spinner } from "react-bootstrap";
import BookingSummary from "../../components/doctorBooking/BookingSummary";
import { ArrowDownRight } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointment,
  updateAppointment,
} from "../../redux/slices/patientApi";
import DatePicker from "react-datepicker";
import { toastMessage } from "../../config/toast";
import PatientDetails from "./PatientDetails";
import ServiceType from "./ServiceType";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { uploadFile } from "../../redux/slices/userApi";
import "react-datepicker/dist/react-datepicker.css";

const formatDate = (date) => date.toISOString().split("T")[0];

export default function AmbulanceBooking({ type }) {
  const { id } = useParams(); // Appointment ID
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    time: null,
    isMySelf: true,
    attachment: null,
    dependent: "",
    reason: "",
    symptoms: "",
    appointmentType: "Emergency", // "Emergency" or "Transport"
    isInsurance: false,
    pickupLocation: "",
    dropLocation: "",
    patientCondition: "",
    urgencyLevel: "Medium",
    specialInstructions: "",
    ambulanceType: "Basic",
    contactPerson: "",
    contactNumber: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const data = useSelector(
    (state) =>
      state.PATIENT.data?.user?.getAppointmentResult ||
      state.PATIENT.data?.user?.createAppointmentResult
  );

  useEffect(() => {
    dispatch(getAppointment(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Pre-populate form if data is loaded
    if (data) {
      setFormData((prev) => ({
        ...prev,
        date: data.date ? formatDate(new Date(data.date)) : prev.date,
        time: data.time || prev.time,
        reason: data.reason || prev.reason,
        symptoms: data.symptoms || prev.symptoms,
        appointmentType: data.appointmentType || prev.appointmentType,
        isInsurance: data.isInsurance || prev.isInsurance,
        isMySelf: data.appointmentFor !== "Dependent",
        dependent: data.appointmentFor === "Dependent" ? data.appointmentPersonName : "",
      }));
    }
  }, [data]);

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date: formatDate(date) }));
  };

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time: time }));
  };

  const handleAppointmentChange = (e) => {
    setFormData((prev) => ({ ...prev, isMySelf: e.target.value === "myself" }));
  };

  const handleInsuranceChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isInsurance: e.target.value === "yes",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (allowedTypes.includes(file.type)) {
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        setFormData((prev) => ({ ...prev, attachment: formDataObj }));
      } else {
        alert("Please upload a valid PDF or image file (JPG, JPEG, PNG).");
      }
    }
  };

  const handleReasonChange = (e) => {
    setFormData((prev) => ({ ...prev, reason: e.target.value }));
  };

  const handleSymptomsChange = (e) => {
    setFormData((prev) => ({ ...prev, symptoms: e.target.value }));
  };

  const handleServiceTypeChange = (typeVal) => {
    setFormData((prev) => ({ ...prev, appointmentType: typeVal }));
  };

  const handleSpecialInstructionsChange = (e) => {
    setFormData((prev) => ({ ...prev, specialInstructions: e.target.value }));
  };

  const validateStep1 = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const selectedDateOnly = new Date(formData.date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    const isPastDate = selectedDateOnly < currentDate;

    if (isPastDate) {
      toastMessage("error", "Selected date cannot be in the past.");
      return false;
    }

    if (!formData.time) {
      toastMessage("error", "Please select a time slot.");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.reason) {
      toastMessage("error", "Please provide the reason for ambulance service.");
      return false;
    }
    if (!formData.pickupLocation) {
      toastMessage("error", "Please provide pickup location.");
      return false;
    }
    if (!formData.dropLocation) {
      toastMessage("error", "Please provide drop location.");
      return false;
    }
    if (!formData.contactNumber) {
      toastMessage("error", "Please provide contact number.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.appointmentType) {
      toastMessage("error", "Please select a service type.");
      return false;
    }
    return true;
  };

  const getAppointmentId = getLocalStorage(STORAGE.APPOINTMENT_KEY);

  const handleSubmit = () => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        break;
    }

    if (isValid) {
      if (step === 3) {
        setLoading(true);
        toastMessage("success", "Processing ambulance booking...");

        if (formData?.attachment) {
          toastMessage("success", "Medical document uploading...");
          dispatch(uploadFile(formData.attachment)).then((res) => {
            if (res?.meta?.requestStatus === "fulfilled") {
              handleUpdateAppointment(res.payload);
            } else {
              setLoading(false);
              toastMessage("error", "File upload failed. Please try again.");
            }
          });
        } else {
          handleUpdateAppointment(null);
        }
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleUpdateAppointment = (uploadedFile) => {
    const user = getLocalStorage(STORAGE.USER_KEY);
    // Extract ambulance profile ID correctly - profile is an object, not a string
    const ambulanceProfileId = user?.profile?._id;
    
    if (!ambulanceProfileId) {
      alert('Ambulance profile not found. Please contact support.');
      return;
    }
    
    const formattedData = {
      ...formData,
      id: getAppointmentId?.appointment_id,
      appointmentFor: formData?.isMySelf ? "Self" : formData?.dependent,
      attachment: uploadedFile?.location || null,
      fileKey: uploadedFile?.key || null,
      // Ambulance specific fields
      pickupLocation: formData.pickupLocation,
      dropLocation: formData.dropLocation,
      patientCondition: formData.patientCondition,
      urgencyLevel: formData.urgencyLevel,
      contactPerson: formData.contactPerson,
      contactNumber: formData.contactNumber,
      specialInstructions: formData.specialInstructions,
      ambulanceType: formData.ambulanceType,
      // Set refAmbulance to the ambulance profile ID
    };

    dispatch(updateAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setLoading(false);
        navigate("/BookingSuccess", { state: { type: "ambulance" } });
      } else {
        setLoading(false);
        toastMessage("error", "Ambulance booking failed.");
      }
    });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Get the correct summary data
  const summaryData = data?.refAmbulance;

  return (
    <>
      <style jsx>{`
        .booking-card {
          min-height: auto !important;
          height: auto !important;
          border: 1px solid #e3e6f0;
          border-radius: 0.35rem;
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
        }
        .time-slot-card-body {
          min-height: auto !important;
          height: auto !important;
          overflow: visible !important;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          font-weight: 600;
          color: #5a5c69;
          margin-bottom: 8px;
        }
        .form-control, .form-select {
          border: 1px solid #d1d3e2;
          border-radius: 0.35rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
        }
        .form-control:focus, .form-select:focus {
          border-color: #4e73df;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
        }
        .urgency-high {
          color: #dc3545;
          font-weight: bold;
        }
        .urgency-medium {
          color: #ffc107;
          font-weight: bold;
        }
        .urgency-low {
          color: #28a745;
          font-weight: bold;
        }
      `}</style>
      <Header />
      <Breadcrumb type="apId" />
      <div className="content">
        <Container>
          <Row>
            {step > 1 && (
              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="back-link">
                    <button 
                      onClick={handleBack}
                      className="btn btn-outline-primary"
                      style={{ marginBottom: '20px' }}
                    >
                      <i className="fa-solid fa-arrow-left-long"></i> Back
                    </button>
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <>
                <Col lg="8" md="12">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <button 
                      onClick={() => navigate(-1)}
                      className="btn btn-outline-secondary"
                    >
                      <i className="fa-solid fa-arrow-left-long"></i> Back to Ambulance List
                    </button>
                  </div>
                  <div className="booking-header">
                    <h4 className="booking-title">Select Date & Time</h4>
                  </div>
                  <Card className="booking-card">
                    <CardBody className="time-slot-card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Choose Date</label>
                            <DatePicker
                              selected={new Date(formData.date)}
                              onChange={handleDateChange}
                              dateFormat="MMMM d, yyyy"
                              className="form-control"
                              minDate={new Date()}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Select Time Slot</label>
                            <select
                              className="form-control form-select"
                              value={formData.time || ""}
                              onChange={(e) => handleTimeSelect(e.target.value)}
                            >
                              <option value="">Select a time slot</option>
                              <option value="ASAP">ASAP (Emergency)</option>
                              <option value="09:00">9:00 AM</option>
                              <option value="10:00">10:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="12:00">12:00 PM</option>
                              <option value="14:00">2:00 PM</option>
                              <option value="15:00">3:00 PM</option>
                              <option value="16:00">4:00 PM</option>
                              <option value="17:00">5:00 PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary justify-content-center align-items-center"
                    >
                      Next <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={summaryData} type={"ambulance"} />
              </>
            )}
            {step === 2 && (
              <>
                <Col lg="8" md="12">
                  <Card className="booking-card">
                    <CardBody className="time-slot-card-body">
                      <PatientDetails
                        formData={formData}
                        setFormData={setFormData}
                        onAppointmentChange={handleAppointmentChange}
                        onInsuranceChange={handleInsuranceChange}
                        onFileChange={handleFileChange}
                        onReasonChange={handleReasonChange}
                        onSymptomsChange={handleSymptomsChange}
                        onSpecialInstructionsChange={handleSpecialInstructionsChange}
                      />
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary justify-content-center align-items-center"
                    >
                      Next <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={summaryData} type={"ambulance"} />
              </>
            )}
            {step === 3 && (
              <>
                <Col lg="8" md="12">
                  <Card className="booking-card">
                    <CardBody className="time-slot-card-body">
                      <ServiceType
                        formData={formData}
                        onServiceTypeChange={handleServiceTypeChange}
                      />
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn btn-primary justify-content-center align-items-center"
                    >
                      {loading ? <Spinner size="sm" /> : "Book Ambulance"}{" "}
                      <ArrowDownRight />
                    </button>
                  </div>
                </Col>
                <BookingSummary data={summaryData} type={"ambulance"} />
              </>
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
} 