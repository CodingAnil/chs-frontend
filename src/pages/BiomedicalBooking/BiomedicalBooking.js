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

export default function BiomedicalBooking({ type }) {
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
    equipmentType: "",
    issueDescription: "",
    appointmentType: "Maintenance", // "Maintenance", "Repair", "Installation"
    isInsurance: false,
    urgencyLevel: "Low",
    preferredServiceType: "maintenance",
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
    debugger;
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
        equipmentType: data.equipmentType || prev.equipmentType,
        issueDescription: data.issueDescription || prev.issueDescription,
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
      toastMessage("error", "Please provide the reason for the service request.");
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
        toastMessage("success", "Processing biomedical service request...");

        if (formData?.attachment) {
          toastMessage("success", "File uploading...");
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
    const formattedData = {
      ...formData,
      id: getAppointmentId?.appointment_id,
      appointmentFor: formData?.isMySelf ? "" : formData?.dependent,
      attachment: uploadedFile?.location || null,
      fileKey: uploadedFile?.key || null,
      // Biomedical specific fields
      equipmentType: formData.equipmentType,
      issueDescription: formData.issueDescription,
      urgencyLevel: formData.urgencyLevel,
      preferredServiceType: formData.preferredServiceType,
    };

    // Set the correct ref field
    if (type === "biomedical") {
      formattedData.refBiomedical = data?.refBiomedical?._id || data?.biomedical?._id;
    }

    dispatch(updateAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setLoading(false);
        navigate("/BookingSuccess", { state: { type: "biomedical" } });
      } else {
        setLoading(false);
        toastMessage("error", "Biomedical service booking failed.");
      }
    });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Get the correct summary data
  const summaryData = (() => {
    console.log("BiomedicalBooking - type:", type);
    console.log("BiomedicalBooking - data:", data);
    
    if (type === "biomedical") {
      // Try multiple possible data structures for biomedical
      return data.refBiomedical;
      debugger;
      
    }
    return data?.refDoctor ;
  })();

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

  return (
    <>
      <style jsx>{`
        .booking-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 2rem;
          text-align: center;
        }
        .booking-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .booking-subtitle {
          opacity: 0.9;
          font-size: 1.1rem;
        }
        .step-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          overflow: hidden;
        }
        .step-header {
          background: linear-gradient(45deg, #f8f9fa, #e9ecef);
          padding: 1.5rem;
          border-bottom: 3px solid #007bff;
        }
        .step-title {
          color: #343a40;
          font-weight: 600;
          margin: 0;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.5rem;
        }
        .form-control, .form-select {
          border-radius: 8px;
          border: 2px solid #e9ecef;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }
        .form-control:focus, .form-select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        .btn-primary {
          background: linear-gradient(45deg, #007bff, #0056b3);
          border: none;
          border-radius: 8px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        }
        .btn-outline-secondary {
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
        }
        .time-slot {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 0.75rem;
          margin: 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .time-slot:hover {
          border-color: #007bff;
          background: #e7f3ff;
        }
        .time-slot.selected {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }
        .progress-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
        }
        .progress-step {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin: 0 1rem;
          position: relative;
        }
        .progress-step.active {
          background: #007bff;
          color: white;
        }
        .progress-step.completed {
          background: #28a745;
          color: white;
        }
        .progress-step::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 100%;
          width: 2rem;
          height: 2px;
          background: #e9ecef;
          transform: translateY(-50%);
        }
        .progress-step:last-child::after {
          display: none;
        }
        .progress-step.completed::after {
          background: #28a745;
        }
      `}</style>
      <Header />
      <Breadcrumb type="apId" />
      <div className="content content-space">
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
                      <i className="fa-solid fa-arrow-left-long"></i> Back to Service List
                    </button>
                  </div>
                  <div className="booking-header">
                    <h4 className="booking-title">Schedule Biomedical Service</h4>
                    <p className="booking-subtitle">Select your preferred date and time</p>
                  </div>
                  <Card className="step-card">
                    <div className="step-header">
                      <h5 className="step-title">Select Date & Time</h5>
                    </div>
                    <CardBody>
                      <Row>
                        <Col md="6">
                          <div className="form-group">
                            <label className="form-label">Select Date</label>
                            <DatePicker
                              selected={formData.date ? new Date(formData.date) : null}
                              onChange={handleDateChange}
                              minDate={new Date()}
                              className="form-control"
                              dateFormat="yyyy-MM-dd"
                              placeholderText="Select a date"
                            />
                          </div>
                        </Col>
                        <Col md="6">
                          <div className="form-group">
                            <label className="form-label">Available Time Slots</label>
                            <div className="time-slots-grid">
                              {[
                                "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
                              ].map((time) => (
                                <div
                                  key={time}
                                  className={`time-slot ${
                                    formData.time === time ? "selected" : ""
                                  }`}
                                  onClick={() => handleTimeSelect(time)}
                                >
                                  {time}
                                </div>
                              ))}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end mt-4">
                        <button
                          className="btn btn-primary"
                          onClick={handleSubmit}
                          disabled={!formData.date || !formData.time}
                        >
                          Next: Service Details <ArrowDownRight size={16} />
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="4" md="12">
                  <BookingSummary data={summaryData} type={type} />
                </Col>
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
                        handleFileChange={handleFileChange}
                        handleReasonChange={handleReasonChange}
                        handleSymptomsChange={handleSymptomsChange}
                        handleAppointmentChange={handleAppointmentChange}
                        handleInsuranceChange={handleInsuranceChange}
                      />
                    </CardBody>
                  </Card>
                  <div className="booking-btn">
                    <button
                      onClick={handleBack}
                      className="btn btn-secondary me-2"
                    >
                      <i className="fa-solid fa-arrow-left-long"></i> Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary justify-content-center align-items-center"
                    >
                      Next Step <i className="fa-solid fa-arrow-right-long"></i>
                    </button>
                  </div>
                </Col>
                <Col lg="4" md="12">
                  <BookingSummary data={summaryData} type={type} />
                </Col>
              </>
            )}
            {step === 3 && (
              <ServiceType
                formData={formData}
                setFormData={setFormData}
                onNext={handleSubmit}
                onBack={handleBack}
                handleServiceTypeChange={handleServiceTypeChange}
                loading={loading}
                type={type}
              />
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}; 