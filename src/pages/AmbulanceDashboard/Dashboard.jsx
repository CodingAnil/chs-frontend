import React, { useEffect, useState } from "react";
import drProfileImg from "../../assets/img/dr_profile.jpg";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";
import { Button } from "react-bootstrap";
import NotFound from "../../components/common/notFound";
import {
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const STATUS_COLOR_MAP = {
  pending: "#ffc107",    // Yellow
  accepted: "#17a2b8",   // Teal / Info
  completed: "#28a745",  // Green
  cancelled: "#dc3545",  // Red
};

const URGENCY_COLOR_MAP = {
  low: "#6c757d",     // Gray
  medium: "#17a2b8",  // Teal / Info
  high: "#ffc107",    // Yellow
  critical: "#dc3545" // Red
};

const Dashboard = () => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;
  const { data, getAllData } = useGetMountData(`/ambulance/dashboard/${userProfileId}`);
  const {
    data: Appointments,
    loading,
    getAllData: getAllAppointments,
    setQuery,
  } = useGetMountData(`/ambulance/appointments`);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Initially get pending requests by default, or customize as needed
    setQuery((e) => ({ ...e, status: "Pending" }));
  }, []);

  // Pagination logic for appointments
  const totalItems = Appointments?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedAppointments = (Appointments || []).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h3>Ambulance Dashboard</h3>
      </div>

      <div className="row">
        {/* Stats widgets - can consider making a separate component */}
        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Total Rides</h6>
                <h4>{data?.totalBookings || 0}</h4>
                <span
                  className={data?.percentageChange?.totalBookings <= 0 ? "text-danger" : "text-success"}
                >
                  <i
                    className={
                      data?.percentageChange?.totalBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>{" "}
                  {Math.trunc(data?.percentageChange?.totalBookings) || 0}% From Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-ambulance"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Today's Rides</h6>
                <h4>{data?.todayBookings || 0}</h4>
                <span className={data?.percentageChange?.todayBookings <= 0 ? "text-danger" : "text-success"}>
                  <i
                    className={
                      data?.percentageChange?.todayBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>{" "}
                  {Math.trunc(data?.percentageChange?.todayBookings) || 0}% From Yesterday
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-calendar-day"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Pending Requests</h6>
                <h4>{data?.pendingBookings || 0}</h4>
                <span className={data?.percentageChange?.pendingBookings <= 0 ? "text-danger" : "text-success"}>
                  <i
                    className={
                      data?.percentageChange?.pendingBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>{" "}
                  {Math.trunc(data?.percentageChange?.pendingBookings) || 0}% From Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-clock"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Completed Rides</h6>
                <h4>{data?.completedBookings || 0}</h4>
                <span className={data?.percentageChange?.completedBookings <= 0 ? "text-danger" : "text-success"}>
                  <i
                    className={
                      data?.percentageChange?.completedBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>{" "}
                  {Math.trunc(data?.percentageChange?.completedBookings) || 0}% From Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-check-circle"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Emergency Calls</h6>
                <h4>{data?.emergencyBookings || 0}</h4>
                <span className={data?.percentageChange?.emergencyBookings <= 0 ? "text-danger" : "text-success"}>
                  <i
                    className={
                      data?.percentageChange?.emergencyBookings <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>{" "}
                  {Math.trunc(data?.percentageChange?.emergencyBookings) || 0}% From Last Week
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Total Revenue</h6>
                <h4>₹{data?.revenue || 0}</h4>
                <span className={data?.percentageChange?.revenue <= 0 ? "text-danger" : "text-success"}>
                  <i
                    className={
                      data?.percentageChange?.revenue <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>{" "}
                  {Math.trunc(data?.percentageChange?.revenue) || 0}% From Last Month
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-rupee-sign"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="dashboard-card">
            <div className="dashboard-card-head d-flex justify-content-between align-items-center mb-3">
              <h5>Recent Ambulance Requests</h5>
              <Link to="/AmbulanceDashboard?key=second" className="btn btn-link p-0">
                View All
              </Link>
            </div>
            <div className="dashboard-card-body">
              <div className="table-responsive">
                <table className="table dashboard-table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Patient</th>
                      <th>Pickup Location</th>
                      <th>Ambulance Type</th>
                      <th>Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    ) : totalItems === 0 ? (
                      <tr>
                        <td colSpan="7">
                          <NotFound message="No ambulance requests found" />
                        </td>
                      </tr>
                    ) : (
                      paginatedAppointments.map((appointment, idx) => {
                        const statusKey = (appointment.status || "").toLowerCase();
                        const urgencyKey = (appointment.urgencyLevel || "low").toLowerCase();

                        return (
                          <tr key={appointment._id || idx}>
                            <td style={{width:'400px'}}>
                              <div className="table-avatar d-flex align-items-center gap-2" style={{width:'170px'}}>
                                <img
                                  src={appointment.patientDetails?.profileImage || drProfileImg}
                                  alt="Patient"
                                  className="rounded-circle"
                                  style={{ width: 40, height: 40, objectFit: "cover" }}
                                />
                                <div>
                                  <div className="font-weight-bold">
                                    {appointment.patientDetails?.name || "Unknown"}
                                  </div>
                                  <small className="text-muted">#{getIdLastDigits(appointment._id)}</small>
                                </div>
                              </div>
                            </td>
                            <td>{appointment.pickupLocation || "N/A"}</td>
                            <td>{appointment.ambulanceType || "Basic"}</td>
                            <td>{getDateFormate(appointment.date)}</td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: URGENCY_COLOR_MAP[urgencyKey] || "#6c757d",
                                  color: "white",
                                  fontWeight: "500",
                                }}
                              >
                                {appointment.urgencyLevel || "Low"}
                              </span>
                            </td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: STATUS_COLOR_MAP[statusKey] || "#6c757d",
                                  color: "white",
                                  fontWeight: "500",
                                }}
                              >
                                {appointment.status}
                              </span>
                            </td>
                           
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center mt-3">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages).keys()].map((page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page + 1 ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Styling */}
      <style jsx>{`
        .dashboard-header h3 {
          font-weight: 600;
          margin-bottom: 20px;
        }
        .dashboard-widget-box {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 0 8px rgb(0 0 0 / 0.1);
        }
        .dashboard-content-info h6 {
          font-size: 14px;
          font-weight: 600;
          color: #6c757d;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        .dashboard-content-info h4 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 5px 0;
          color: #343a40;
        }
        .text-success {
          color: #28a745 !important;
        }
        .text-danger {
          color: #dc3545 !important;
        }
        .dashboard-widget-icon .dash-icon-box {
          font-size: 30px;
          color: #007bff;
        }
        .dashboard-card {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 0 8px rgb(0 0 0 / 0.1);
        }
        .dashboard-card-head {
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .dashboard-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }
        .dashboard-table th,
        .dashboard-table td {
          vertical-align: middle;
          padding: 12px 15px;
        }
        .dashboard-table thead tr th {
          color: #6c757d;
          font-weight: 600;
          border-bottom: 1px solid #dee2e6;
          background-color: #f8f9fa;
        }
        .table-avatar img {
          border-radius: 50%;
          object-fit: cover;
        }
        .badge {
          padding: 6px 10px;
          border-radius: 12px;
          font-size: 12px;
          text-transform: capitalize;
          display: inline-block;
        }
        .table-action button {
          min-width: 70px;
        }
        /* Responsive tweaks */
        @media (max-width: 768px) {
          .dashboard-widget-box {
            flex-direction: column;
            align-items: flex-start;
          }
          .dashboard-widget-icon {
            margin-top: 10px;
          }
          .table-responsive {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
