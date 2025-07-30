import React, { useState, useEffect } from 'react';
import { getDataAPI, putDataAPI } from '../../helpers/axiosInstance';
import { toast } from 'react-toastify';
import KilometersPopup from './KilometersPopup'; // your popup component

const ITEMS_PER_PAGE = 5;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showKmPopup, setShowKmPopup] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsAppointment, setDetailsAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await getDataAPI('/ambulance/appointments');
      if (response.success) {
        setAppointments(response.data);
      } else {
        toast.error('Failed to load appointments');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await putDataAPI(`/ambulance/appointments/${appointmentId}`, {
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
      });
      if (response.success) {
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) } : app
          )
        );
        toast.success(response.message);
      } else {
        toast.error(response.message || 'Failed to update appointment status');
      }
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const openKmPopup = (appointmentId) => {
    setCurrentAppointmentId(appointmentId);
    setShowKmPopup(true);
  };

  const handleKmSuccess = (data) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === currentAppointmentId
          ? { ...appt, kilometersDriven: data.kilometersDriven, calculatedFare: data.calculatedFare, isPaid: false }
          : appt
      )
    );
  };

  // Show details modal for selected appointment
  const openDetailsModal = (appointment) => {
    setDetailsAppointment(appointment);
    setShowDetailsModal(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setDetailsAppointment(null);
    setShowDetailsModal(false);
  };

  // Filter and search logic
  const filteredAppointments = appointments.filter((appointment) => {
    const status = (appointment.status || '').toLowerCase();
    const matchesFilter = filter === 'all' || status === filter;
    const patientEmail = appointment.patientId?.email?.toLowerCase() || '';
    const matchesSearch =
      patientEmail.includes(searchTerm.toLowerCase()) ||
      (appointment._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Status colors map
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'accepted':
        return '#28a745';
      case 'completed':
        return '#007bff';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="appointments-container">
      <h2>Ambulance Appointments</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by email or booking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-tabs">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              className={`filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => {
                setFilter(s);
                setCurrentPage(1); // reset page on filter change
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="appointments-list">
        {paginatedAppointments.length === 0 && <p>No appointments found.</p>}

        {paginatedAppointments.map((appointment) => {
          const statusLower = (appointment.status || '').toLowerCase();
          const isPaymentDone = appointment.isPaid || appointment.paymentStatus === 'Completed';

          return (
            <div key={appointment._id} className="appointment-card">
              <div className="header-row">
                <div className="booking-id">#{appointment._id.slice(-6)}</div>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(appointment.status) }}>
                  {appointment.status}
                </div>
              </div>

              <div className="info-row">
                <div>{appointment.patientId?.email || 'Unknown'}</div>
                <div>
                  {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}{' '}
                  {appointment.time ? `at ${appointment.time}` : ''}
                </div>
              </div>

              <div className="info-row">
                <div>From: {appointment.pickupLocation || 'N/A'}</div>
                <div>To: {appointment.dropLocation || 'N/A'}</div>
              </div>

              {(appointment.kilometersDriven !== undefined || appointment.calculatedFare !== undefined) && (
                <div className="info-row">
                  {appointment.kilometersDriven !== undefined && <div>Km Driven: {appointment.kilometersDriven}</div>}
                  {appointment.calculatedFare !== undefined && (
                    <div>Fare: ₹{appointment.calculatedFare.toFixed(2)}</div>
                  )}
                  <div>
                    Payment:{' '}
                    <strong style={{ color: isPaymentDone ? 'green' : 'red' }}>
                      {isPaymentDone ? 'Done' : 'Pending'}
                    </strong>
                  </div>
                </div>
              )}

              <div className="actions-row">
                {statusLower === 'pending' && (
                  <>
                    <button className="btn success" onClick={() => updateAppointmentStatus(appointment._id, 'Accepted')}>
                      Confirm
                    </button>
                    <button className="btn danger" onClick={() => updateAppointmentStatus(appointment._id, 'Cancelled')}>
                      Cancel
                    </button>
                  </>
                )}

                {statusLower === 'accepted' && (
                  <>
                    <button
                      className="btn primary"
                      onClick={() => {
                        if (!isPaymentDone) {
                          toast.error('Cannot complete appointment before payment is done');
                          return;
                        }
                        updateAppointmentStatus(appointment._id, 'Completed');
                      }}
                      disabled={!isPaymentDone}
                      title={!isPaymentDone ? 'Complete appointment after payment is done' : ''}
                    >
                      Mark Completed
                    </button>
                    <button className="btn secondary" onClick={() => openKmPopup(appointment._id)} title="Update Fare">
                      Update Fare
                    </button>
                  </>
                )}

                <button className="btn btn-outline" onClick={() => openDetailsModal(appointment)}>
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
          Previous
        </button>
        <span>
          Page {currentPage} / {totalPages || 1}
        </span>
        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
          Next
        </button>
      </div>

      {/* Kilometers Popup */}
      {showKmPopup && (
        <KilometersPopup
          appointmentId={currentAppointmentId}
          onClose={() => setShowKmPopup(false)}
          onSuccess={handleKmSuccess}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && detailsAppointment && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Appointment Details</h3>
            <div className="details-section">
              <p><strong>Booking ID:</strong> #{detailsAppointment._id}</p>
              <p><strong>Status:</strong> {detailsAppointment.status}</p>
              <p><strong>Patient Email:</strong> {detailsAppointment.patientId?.email || 'Unknown'}</p>
              {/* Add any other fields you want to show */}
              <p><strong>Reason:</strong> {detailsAppointment.reason || 'N/A'}</p>
              <p><strong>Symptoms:</strong> {detailsAppointment.symptoms || 'N/A'}</p>
              <p><strong>Pickup Location:</strong> {detailsAppointment.pickupLocation || 'N/A'}</p>
              <p><strong>Drop Location:</strong> {detailsAppointment.dropLocation || 'N/A'}</p>
              <p><strong>Appointment Date:</strong> {detailsAppointment.date ? new Date(detailsAppointment.date).toLocaleString() : 'N/A'}</p>
              <p><strong>Kilometers Driven:</strong> {detailsAppointment.kilometersDriven ?? 'N/A'}</p>
              <p><strong>Fare:</strong> ₹{detailsAppointment.calculatedFare?.toFixed(2) ?? 'N/A'}</p>
              <p><strong>Payment Status:</strong> {detailsAppointment.isPaid || detailsAppointment.paymentStatus === 'Completed' ? 'Paid' : 'Pending'}</p>
            </div>
            <button className="btn btn-primary" onClick={closeDetailsModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .appointments-container {
          max-width: 900px;
          margin: auto;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        h2 {
          margin-bottom: 15px;
          color: #222;
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 15px;
          gap: 10px;
        }
        .search-input {
          flex-grow: 1;
          min-width: 220px;
          padding: 6px 10px;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .filter-tabs button {
          margin-left: 8px;
          padding: 6px 12px;
          font-size: 13px;
          cursor: pointer;
          border-radius: 4px;
          border: 1px solid #ccc;
          background: #fff;
          min-width: 75px;
          text-transform: capitalize;
        }
        .filter-tabs button.active {
          background: #007bff;
          color: #fff;
          border-color: #007bff;
        }
        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .appointment-card {
          background: #fff;
          border-radius: 6px;
          padding: 12px 15px;
          box-shadow: 0 1px 4px rgb(0 0 0 / 0.1);
          font-size: 14px;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-weight: bold;
        }
        .booking-id {
          color: #3a3a3a;
        }
        .status-badge {
          padding: 3px 15px;
          border-radius: 15px;
          color: white;
          font-size: 12px;
          text-transform: capitalize;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          color: #555;
          flex-wrap: wrap;
          gap: 5px;
        }
        .actions-row button {
          margin-right: 10px;
          margin-top: 6px;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          color: #fff;
          transition: background-color 0.2s ease;
        }
        .btn.success {
          background-color: #28a745;
        }
        .btn.success:hover {
          background-color: #218838;
        }
        .btn.danger {
          background-color: #dc3545;
        }
        .btn.danger:hover {
          background-color: #c82333;
        }
        .btn.primary {
          background-color: #007bff;
        }
        .btn.primary:hover:not(:disabled) {
          background-color: #0056b3;
        }
        .btn.primary:disabled {
          background-color: #888;
          cursor: not-allowed;
        }
        .btn.secondary {
          background-color: #6c757d;
          margin-left: 8px;
        }
        .btn.secondary:hover {
          background-color: #5a6268;
        }
        .btn.btn-outline {
          background: white;
          color: #007bff;
          border: 1px solid #007bff;
        }
        .btn.btn-outline:hover {
          background: #007bff;
          color: white;
        }
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #333;
        }
        .pagination button {
          background: #007bff;
          border: none;
          padding: 6px 12px;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }
        .pagination button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 20px 30px;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }
        .modal-content h3 {
          margin-top: 0;
          margin-bottom: 20px;
          text-align: center;
        }
        .details-section p {
          margin: 6px 0;
          font-size: 14px;
          color: #333;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
};

export default Appointments;
