import React, { useEffect } from "react";
import user_img from "../../assets/img/dr_profile.jpg";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import useGetMountData from "../../helpers/getDataHook";
import { Button, Form } from "react-bootstrap";
import NotFound from "../../components/common/notFound";
import {
  formatDate,
  formatName,
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const { data, getAllData } = useGetMountData(
    `/doctor/dashboard/${userProfileId}`
  );

  const {
    data: Appointments,
    loading,
    getAllData: getAllAppointments,
    setQuery,
  } = useGetMountData(`/doctor/appointment/${userProfileId}`);

  const getByFilter = async (filter) => {
    setQuery((e) => ({ ...e, status: "Pending", time: filter }));
    // await getAllAppointments(
    //   `/doctor/appointment/${userProfileId}?status=Pending&time=${filter}`
    // );
  };

  useEffect(() => {
    setQuery((e) => ({ ...e, status: "Pending" }));
  }, []);

  console.log(Appointments, "dtaa");
  return (
    <div>
      <div className="dashboard-header">
        <h3>Dashboard</h3>
      </div>

      <div className="row">
        <div className="col-xl-4 d-flex">
          <div className="dashboard-box-col w-100">
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Total Patient</h6>
                <h4>{data?.totalPatients || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.totalPatients <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.totalPatients <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {Math.trunc(data?.percentageChange?.totalPatients) || 0}% From
                  Last Week
                  {/* {1}% From Last Week */}
                </span>
                {/* <span className="text-success">
                  <i className="fa-solid fa-arrow-up"></i>15% From Last Week
                </span> */}
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-user-injured"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Patients Today</h6>
                <h4>{data?.todayPatients || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.patients <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.appointments <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>
                  {Math.trunc(data?.percentageChange?.patients) || 0}% From
                  Yesterday
                  {/* {0}% From Yesterday */}
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-user-clock"></i>
                </span>
              </div>
            </div>
            <div className="dashboard-widget-box">
              <div className="dashboard-content-info">
                <h6>Appointments Today</h6>
                <h4>{data?.todayAppointments || 0}</h4>
                <span
                  className={
                    data?.percentageChange?.appointments <= 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  <i
                    className={
                      data?.percentageChange?.appointments <= 0
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  ></i>{" "}
                  {Math.trunc(data?.percentageChange?.appointments) || 0}% From
                  Yesterday
                  {/* {0}% From Yesterday */}
                </span>
              </div>
              <div className="dashboard-widget-icon">
                <span className="dash-icon-box">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-8 d-flex">
          <div className="dashboard-card w-100">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Appointment</h5>
              </div>
              <div className="dropdown header-dropdown">
                <Form.Select
                  onChange={(e) => {
                    getByFilter(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </Form.Select>
              </div>
            </div>
            <div className="dashboard-card-body">
              <div className="table-responsive">
                <table className="table dashboard-table appoint-table">
                  <NotFound
                    loading={loading}
                    isData={Appointments?.length > 0}
                    message="No Appointments Found."
                    height="40vh"
                  />
                  {!loading &&
                    Appointments?.length > 0 &&
                    Appointments?.map((it, index) => {
                      return (
                        <tbody>
                          <tr>
                            <td>
                              <div className="patient-info-profile">
                                <span className="table-avatar">
                                  <img src={user_img} alt="Img" />
                                </span>
                                <div className="patient-name-info">
                                  {getIdLastDigits(it?._id || "", "PT")}
                                  <h5>
                                    <a href="#">
                                      {it?.appointmentPersonName ||
                                        formatName(it?.patientId, "Pt")}
                                    </a>
                                  </h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="appointment-date-created">
                                <h6>{`${formatDate(it?.date)} ${it?.time}`}</h6>
                                <span className="badge table-badge">
                                  {it?.appointmentType || "General"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="appointment-actions d-flex align-items-center">
                                <Link
                                  to="/DoctorDashboard?key=second"
                                  className="btn-view"
                                >
                                  <button className="btn btn-primary btn-sm">
                                    View{" "}
                                    <i className="fa-solid fa-arrow-right ms-1"></i>
                                  </button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-7 d-flex">
          {data?.lastUpcomingAppointment && (
            <div className="dashboard-main-col w-100">
              <div className="upcoming-appointment-card">
                <div className="title-card">
                  <h5>Upcoming Appointment</h5>
                </div>
                <div className="upcoming-patient-info">
                  <div className="info-details">
                    <span className="img-avatar">
                      <img
                        src={
                          data?.lastUpcomingAppointment?.patientId
                            ?.coverImage || user_img
                        }
                        alt="Img"
                      />
                    </span>
                    <div className="name-info">
                      <span>
                        {getIdLastDigits(
                          data?.lastUpcomingAppointment?.patientId?._id || "",
                          "PT"
                        )}
                      </span>
                      <h6>{`${
                        data?.lastUpcomingAppointment?.patientId?.firstName
                      } ${
                        data?.lastUpcomingAppointment?.patientId?.lastName || ""
                      }`}</h6>
                      <span style={{ marginLeft: 5 }}>
                        {data?.lastUpcomingAppointment?.appointmentPersonName ||
                          ""}
                      </span>
                    </div>
                  </div>
                  <div className="date-details">
                    <span>
                      {data?.lastUpcomingAppointment?.appointmentType}
                    </span>
                    <h6>{`${getDateFormate(
                      data?.lastUpcomingAppointment?.date
                    )} ${data?.lastUpcomingAppointment?.time}`}</h6>
                  </div>
                  <div className="circle-bg">
                    <img src="assets/img/bg/dashboard-circle-bg.png" alt="" />
                  </div>
                </div>
                <div className="appointment-card-footer">
                  {data?.lastUpcomingAppointment?.appointmentType && (
                    <h5>
                      <i className="fa-solid fa-video"></i>{" "}
                      {data?.lastUpcomingAppointment?.appointmentType?.toLowerCase() ==
                      "video"
                        ? "Video Call Appointment"
                        : data?.lastUpcomingAppointment?.appointmentType?.toLowerCase() ==
                          "chat"
                        ? "Chat Appointment"
                        : "Audio Call Appointment"}
                    </h5>
                  )}
                  <div className="btn-appointments">
                    <Link to="/DoctorDashboard?key=fourth" className="btn">
                      Start Appointment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className={
            data?.lastUpcomingAppointment
              ? "col-xl-5 d-flex"
              : "col-xl-12 d-flex"
          }
        >
          <div className="dashboard-card w-100">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Clinics & Availability</h5>
              </div>
            </div>
            <div className="dashboard-card-body">
              <div className="clinic-available">
                <div className="clinic-head">
                  <div className="clinic-info">
                    <span className="clinic-img">
                      <img src={user_img} alt="Img" />
                    </span>
                    <h6>Sofi’s Clinic</h6>
                  </div>
                  <div className="clinic-charge">
                    <span>$900</span>
                  </div>
                </div>
                <div className="available-time">
                  <ul>
                    <li>
                      <span>Today :</span>
                      07:00 AM - 09:00 PM
                    </li>
                  </ul>
                </div>
              </div>
              <div className="d-flex justify-content-end change-time">
                <Button>Change </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
