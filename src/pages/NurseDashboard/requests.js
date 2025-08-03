import React, { useEffect, useState } from "react";
import user_img from "../../assets/img/dr_profile.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import {
  formatName,
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";
import NotFound from "../../components/common/notFound";
import { ChevronDown, ChevronUp } from "react-feather";
import { Dropdown, Form, Modal, Button } from "react-bootstrap";
import { toastMessage } from "../../config/toast";
import { callPutApi } from "../../_service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteModal from "../../components/modals/delete-modal";

const Requests = ({ activeKey }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [time, setTime] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [amount, setAmount] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const {
    data: Appointments,
    loading,
    getAllData,
    setData,
    setQuery,
    isOpen,
    openModelWithItem,
    customData,
  } = useGetMountData(`/nurse/appointment/${userProfileId}`);

  const getByFilter = async (time, startDate, endDate) => {
    if (time) {
      setQuery((e) => ({ ...e, status: "Pending", time: time }));
    }
    if (startDate && endDate) {
      setQuery((e) => ({
        ...e,
        status: "Pending",
        startDate: startDate,
        endDate: endDate,
      }));
    }
  };

  useEffect(() => {
    setQuery((e) => ({ ...e, status: "Pending" }));
  }, []);

  useEffect(() => {
    if (time || (startDate && endDate)) {
      getByFilter(time, startDate, endDate);
    }
  }, [startDate, endDate, time]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleAcceptWithAmount = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAmountModal(true);
    setAmount(""); // Reset amount
  };

  const handleConfirmAccept = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toastMessage("error", "Please enter a valid amount");
      return;
    }

    try {
      setUploading(true);
      const verifyResponse = await callPutApi(`/patient/appointment/${selectedAppointment._id}`, {
        status: "Accepted",
        amount: parseFloat(amount)
      });
      
      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      
      setShowAmountModal(false);
      setSelectedAppointment(null);
      setAmount("");
      setUploading(false);

      toastMessage("success", `Appointment accepted with amount $${amount}`);

      const updatedData = Appointments?.filter((item) => item?._id !== selectedAppointment._id);
      setData(updatedData || []);
    } catch (error) {
      setUploading(false);
      toastMessage("error", "Appointment update process failed!");
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      setUploading(true);
      const verifyResponse = await callPutApi(`/patient/appointment/${id}`, {
        status,
      });
      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      openModelWithItem();
      setUploading(false);

      toastMessage(
        "success",
        status === "Accepted"
          ? "The appointment has been accepted."
          : "The appointment has been rejected."
      );

      const updatedData = Appointments?.filter((item) => item?._id !== id);
      setData(updatedData || []);
    } catch (error) {
      setUploading(false);
      toastMessage("error", "Appointment update process failed!");
    }
  };

  useEffect(() => {
    if (activeKey && userProfileId) {
      getAllData(`/nurse/appointment/${userProfileId}`);
    }
  }, [activeKey, userProfileId]);

  const handleShowDetails = (appointment) => {
    debugger;
    setSelectedDetails(appointment);
    setShowDetailsModal(true);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h3>Appointment Requests</h3>
        <div className="flex justify-between mr-1">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            isClearable
            className="border rounded p-2 w-full h-full"
            placeholderText="Select a date range"
          />
          <ul>
            <li>
              <Form.Select
                onChange={(e) => {
                  setTime(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </Form.Select>
            </li>
          </ul>
        </div>
      </div>
      <NotFound
        loading={loading}
        isData={Appointments?.length > 0}
        message="No Appointment Requests Found."
      />
      {!loading &&
        Appointments?.length > 0 &&
        Appointments?.map((it, index) => {
          return (
            <div className="appointment-wrap" key={index}>
              <ul>
                <li>
                  <div className="patinet-information">
                    <img
                      src={it?.patientId?.coverImage || user_img}
                      alt="User Image"
                    />
                    <div className="patient-info">
                      <p>{getIdLastDigits(it?._id, "PT")}</p>
                      <h6>
                        <a href="#">
                          {it?.appointmentPersonName ||
                            formatName(it?.patientId, "Pt")}
                        </a>
                      </h6>
                    </div>
                  </div>
                </li>
                <li className="appointment-info">
                  <p>
                    <i className="fa-solid fa-clock"></i>
                    {`${getDateFormate(it?.date)} ${it?.time}`}
                  </p>
                  <p className="md-text">General Visit</p>
                </li>
                <li className="appointment-type">
                  <p className="md-text">Type of Appointment</p>
                  <p>
                    <i className="fa-solid fa-video text-blue"></i>{" "}
                    {it?.appointmentType || "General"}
                  </p>
                </li>
                <li>
                  <ul className="request-action">
                  <li>
                      <span
                        onClick={() => handleShowDetails(it)}
                        className="accept-link"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-info-circle text-primary"></i> View Details
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={() => handleAcceptWithAmount(it)}
                        className="accept-link"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-check text-green"></i> Accept
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={() => openModelWithItem("delete", it)}
                        className="reject-link"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-xmark text-danger"></i> Reject
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          );
        })}
      <DeleteModal
        loading={uploading}
        type="request"
        isOpen={isOpen == "delete"}
        onClose={openModelWithItem}
        title="Are you sure you want to reject this appointment request?"
        onConfirm={() => handleUpdate(customData?._id, "Rejected")}
      />

      {/* Amount Modal */}
      <Modal show={showAmountModal} onHide={() => setShowAmountModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Appointment Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="mb-3">
              <p><strong>Patient:</strong> {selectedAppointment.appointmentPersonName || formatName(selectedAppointment.patientId, "Pt")}</p>
              <p><strong>Date:</strong> {getDateFormate(selectedAppointment.date)} {selectedAppointment.time}</p>
              <p><strong>Type:</strong> {selectedAppointment.appointmentType}</p>
            </div>
          )}
          <Form.Group>
            <Form.Label>Amount ₹ <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount in Rupees"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1"
            />
            <Form.Text className="text-muted">
              Enter the consultation fee for this appointment (in Rupees)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAmountModal(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmAccept} disabled={uploading}>
            {uploading ? "Processing..." : "Accept Appointment"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal 
  show={showDetailsModal} 
  onHide={() => setShowDetailsModal(false)} 
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>Appointment Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedDetails ? (
      <div className="appointment-details">
        {/* Basic Information */}
        <div className="section mb-4">
          <h6 className="text-primary mb-3">Basic Information</h6>
          <p><strong>Appointment ID:</strong> {getIdLastDigits(selectedDetails?._id, "APT")}</p>
          <p><strong>Status:</strong> <span className={`badge ${
            selectedDetails?.status === 'Pending' ? 'bg-warning' :
            selectedDetails?.status === 'Accepted' ? 'bg-success' :
            selectedDetails?.status === 'Completed' ? 'bg-primary' : 'bg-danger'
          }`}>{selectedDetails?.status}</span></p>
          <p><strong>Type:</strong> {selectedDetails?.appointmentType}</p>
          <p><strong>Booking Type:</strong> {selectedDetails?.bookingType}</p>
          <p><strong>Date:</strong> {getDateFormate(selectedDetails?.date)}</p>
          <p><strong>Start Time:</strong> {selectedDetails?.startTime}</p>
          {selectedDetails?.duration && <p><strong>Duration:</strong> {selectedDetails?.duration} hour(s)</p>}
        </div>

        {/* Patient Information */}
        <div className="section mb-4">
          <h6 className="text-primary mb-3">Patient Information</h6>
          <p><strong>Patient ID:</strong> {getIdLastDigits(selectedDetails?.patientId?._id, "PT")}</p>
          <p><strong>Name:</strong> {`${selectedDetails?.patientId?.firstName || ''} ${selectedDetails?.patientId?.lastName || ''}`}</p>
          <p><strong>Gender:</strong> {selectedDetails?.patientId?.gender}</p>
          <p><strong>Email:</strong> {selectedDetails?.patientId?.email}</p>
          <p><strong>Phone:</strong> {selectedDetails?.patientId?.phoneNumber}</p>
          <p><strong>Address:</strong> {selectedDetails?.patientId?.address}</p>
        </div>

        {/* Appointment Details */}
        <div className="section mb-4">
          <h6 className="text-primary mb-3">Additional Details</h6>
          <p><strong>Reason:</strong> {selectedDetails?.reason || 'Not specified'}</p>
          {selectedDetails?.symptoms && <p><strong>Symptoms:</strong> {selectedDetails?.symptoms}</p>}
          <p><strong>Priority Booking:</strong> {selectedDetails?.priorityBooking ? 'Yes' : 'No'}</p>
          {selectedDetails?.bookingType === 'multiple' && (
            <>
              <p><strong>Recurring Pattern:</strong> {selectedDetails?.recurringPattern}</p>
              <p><strong>Hourly Duration:</strong> {selectedDetails?.hourlyDuration} hour(s)</p>
            </>
          )}
        </div>

        {/* Payment Information */}
        <div className="section mb-4">
          <h6 className="text-primary mb-3">Payment Information</h6>
          <p><strong>Payment Status:</strong> {selectedDetails?.paymentDetails?.paymentStatus}</p>
          {selectedDetails?.amount && <p><strong>Amount:</strong> ₹{selectedDetails?.amount}</p>}
          {selectedDetails?.calculatedFare > 0 && (
            <p><strong>Calculated Fare:</strong> ${selectedDetails?.calculatedFare}</p>
          )}
        </div>

        {/* System Information */}
        <div className="section">
          <h6 className="text-primary mb-3">System Information</h6>
          <p><strong>Created:</strong> {new Date(selectedDetails?.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(selectedDetails?.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    ) : (
      <p>Loading details...</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default Requests;