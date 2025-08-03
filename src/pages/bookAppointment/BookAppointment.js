import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import user_img from "../../assets/img/dr_profile.jpg";
import { Award, Clock, MapPin } from "react-feather";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { createAppointment } from "../../redux/slices/patientApi";
import { cpFirstName, formatName } from "../../helpers/utils";
import { toastMessage } from "../../config/toast";
import { axiosInstance } from "../../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { Image } from "react-bootstrap";

function getProfile(item) {
  if (item.profile) return item.profile;
  // For nurses, return the item itself
  return item;
}

function BookAppointment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [backupList, setBackupList] = useState([]);
  const [practitionersList, setPractitionersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [availability, setAvailability] = useState(null); // true, false, or null
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Role filter state
  const [selectedRoles, setSelectedRoles] = useState(['doctor', 'nurse', 'Pathology', 'ambulance', 'biomedical', 'hospital']);

  // Handler for role checkbox
  const handleRoleChange = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
    setIsFilterApplied(false);
  };

  // Handler for under development alert
  const handleUnderDevelopment = () => {
    alert('This is under development, please visit later.');
  };

  const userProfileId = getLocalStorage(STORAGE.USER_KEY);
  const allLanguages = Array.from(
    new Set(
      backupList.flatMap((doc) => getProfile(doc)?.languages || [])
    )
  );

  // Gather all unique specialities/designations from all roles, filtered by selectedRoles
  const allSpecialities = Array.from(
    new Set(
      backupList
        .filter((doc) => selectedRoles.length === 0 || selectedRoles.includes(doc.type))
        .map((doc) => {
          const profile = getProfile(doc) || {};
          if (doc.type === 'nurse') return 'Nurse';
          if (doc.type === 'Pathology') return 'Pathology';
          return profile.designation || profile.achievement || '';
        })
        .filter(Boolean)
    )
  );

  const [selectedSpecialities, setSelectedSpecialities] = useState([]);

  useEffect(() => {
          const fetchPractitioners = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get("/common/doctorandnurse/list");
          debugger;
          if (res?.data) {
            // Combine and tag all service types
            const doctors = (res.data.doctors || []).map(d => ({ ...d, type: 'doctor' }));
            const nurses = (res.data.nurses || []).map(n => ({
              ...n,
              type: n.role && n.role.toLowerCase() === 'pathology' ? 'pathology' : 'nurse'
            }));
            const ambulances = (res.data.ambulance || []).map(a => ({ ...a, type: 'ambulance' }));
            const biomedicals = (res.data.biomedical || []).map(b => ({ ...b, type: 'biomedical' }));
            const hospitals = (res.data.hospital || []).map(h => ({ ...h, type: 'hospital' }));
            
            const combined = [...doctors, ...nurses, ...ambulances, ...biomedicals, ...hospitals];
            debugger;
            console.log('All practitioners loaded:', {
              doctors: doctors.length,
              nurses: nurses.length,
              ambulances: ambulances.length,
              biomedicals: biomedicals.length,
              hospitals: hospitals.length,
              total: combined.length
            });
            
            setBackupList(combined);
            setPractitionersList(combined);
          }
        } catch (error) {
          toastMessage("error", "Failed to load list");
        } finally {
          setLoading(false);
        }
      };
    fetchPractitioners();
  }, []);

  const handleBookAppointment = async (data) => {
    if (userProfileId?.role?.toLowerCase() === "doctor") {
      toastMessage(
        "error",
        "You are not a patient user, so you are not eligible to create an appointment."
      );
      return;
    }
    
    console.log("Booking appointment for:", data);
    console.log("User profile:", userProfileId);
    
    setBookingLoading(true);
    
    const formattedData = {
      id: userProfileId?.profile?._id,
      status: "Created",
    };

    // Handle different practitioner types
    if (data.type === 'nurse') {
      formattedData.refNurse = data?.profile?._id || data?._id;
    } else if (data.type === 'pathology') {
      formattedData.refPathology = data?.profile?._id || data?._id;
    } else if (data.type === 'ambulance') {
      formattedData.refAmbulance = data?.profile?._id || data?._id;
    } else if (data.type === 'biomedical') {
      formattedData.refBiomedical = data?.profile?._id || data?._id;
    } else if (data.type === 'hospital') {
      formattedData.refHospital = data?.profile?._id || data?._id;
    } else {
      formattedData.refDoctor = data?.profile?._id || data?._id;
    }
    
    console.log("Formatted appointment data:", formattedData);
    
    if (!formattedData.id) {
      toastMessage("error", "Seems you are not logged in, Please login.");
      setBookingLoading(false);
      return;
    }
    
    if (data.type === 'pathology' && !formattedData.refPathology) {
      toastMessage("error", "Pathology lab information not found.");
      setBookingLoading(false);
      return;
    }
    
    if (data.type === 'ambulance' && !formattedData.refAmbulance) {
      toastMessage("error", "Ambulance service information not found.");
      setBookingLoading(false);
      return;
    }
    
    if (data.type === 'biomedical' && !formattedData.refBiomedical) {
      toastMessage("error", "Biomedical service information not found.");
      setBookingLoading(false);
      return;
    }
    
    if (data.type === 'hospital' && !formattedData.refHospital) {
      toastMessage("error", "Hospital service information not found.");
      setBookingLoading(false);
      return;
    }

    dispatch(createAppointment(formattedData)).then((res) => {
      console.log("Appointment creation response:", res);
      
      if (res?.meta?.requestStatus === "fulfilled") {
        setLocalStorage(STORAGE.APPOINTMENT_KEY, {
          appointment_id: res?.payload?._id,
        });
        
        toastMessage("success", "Appointment created successfully!");
        
        // Navigate to appropriate booking page based on type
        if (data.type === 'nurse') {
          navigate(`/nursebooking/${res?.payload?._id}`);
        } else if (data.type === 'pathology') {
          console.log("Navigating to pathology booking:", `/pathologybooking/${res?.payload?._id}`);
          navigate(`/pathologybooking/${res?.payload?._id}`);
        } else if (data.type === 'ambulance') {
          console.log("Navigating to ambulance booking:", `/ambulance-booking/${res?.payload?._id}`);
          navigate(`/ambulance-booking/${res?.payload?._id}`);
        } else if (data.type === 'biomedical') {
          console.log("Navigating to biomedical booking:", `/biomedicalbooking/${res?.payload?._id}`);
          navigate(`/biomedicalbooking/${res?.payload?._id}`);
        } else if (data.type === 'hospital') {
          console.log("Navigating to hospital booking:", `/hospitalbooking/${res?.payload?._id}`);
          navigate(`/hospitalbooking/${res?.payload?._id}`);
        } else {
          navigate(`/doctorbooking/${res?.payload?._id}`);
        }
      } else {
        console.error("Appointment creation failed:", res);
        toastMessage("error", res?.payload?.message || "Failed to create appointment");
      }
      setBookingLoading(false);
    }).catch((error) => {
      console.error("Appointment creation error:", error);
      toastMessage("error", "Failed to create appointment");
      setBookingLoading(false);
    });
  };

  useEffect(() => {
    if (backupList?.length > 0) {
      setPractitionersList(backupList);
    }
  }, [backupList]);

  useEffect(() => {
    let filtered = [...backupList];

    // Filter by role
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((doc) => selectedRoles.includes(doc.type));
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((doc) => {
        const profile = getProfile(doc) || {};
        return (
          (profile.firstName && profile.firstName.toLowerCase().includes(term)) ||
          (profile.lastName && profile.lastName.toLowerCase().includes(term)) ||
          (profile.displayName && profile.displayName.toLowerCase().includes(term)) ||
          (profile.designation && profile.designation.toLowerCase().includes(term)) ||
          (profile.name && profile.name.toLowerCase().includes(term))
        );
      });
    }

    // Filter by languages
    if (selectedLanguages.length > 0 && isFilterApplied) {
      filtered = filtered.filter((doc) => {
        const profile = getProfile(doc) || {};
        return (
          profile.languages &&
          profile.languages.some((lang) => selectedLanguages.includes(lang))
        );
      });
    }

    // Filter by availability
    if (availability !== null) {
      filtered = filtered.filter((doc) => {
        const profile = getProfile(doc);
        return (profile?.available === availability || profile?.availability === availability);
      });
    }

    // Speciality/Designation filter logic
    if (selectedSpecialities.length > 0 && isFilterApplied) {
      filtered = filtered.filter((doc) => {
        const profile = getProfile(doc) || {};
        const docSpeciality = profile.designation || profile.achievement || (doc.type === 'nurse' ? 'Nurse' : '');
        return selectedSpecialities.includes(docSpeciality);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const profileA = getProfile(a);
      const profileB = getProfile(b);
      const nameA = (profileA?.displayName || profileA?.firstName || profileA?.name || "").toLowerCase();
      const nameB = (profileB?.displayName || profileB?.firstName || profileB?.name || "").toLowerCase();
      if (sortOrder === "A-Z") return nameA.localeCompare(nameB);
      if (sortOrder === "Z-A") return nameB.localeCompare(nameA);
      return 0;
    });

    setPractitionersList(filtered);
  }, [searchTerm, availability, sortOrder, backupList, isFilterApplied]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
    setIsFilterApplied(false);
  };

  const handleApplyFilters = () => {
    setIsFilterApplied(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLanguages([]);
    setSelectedSpecialities([]);
    setAvailability(null);
    setSortOrder("A-Z");
    setIsFilterApplied(false);
    setSelectedRoles(['doctor', 'nurse', 'Pathology', 'ambulance', 'biomedical', 'hospital']);
    setPractitionersList(backupList);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.checked);
  };

  const handleSpecialityChange = (spec) => {
    setSelectedSpecialities((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
    setIsFilterApplied(false);
  };

  const getProfileImageBlock = (el) => {
    debugger;
    const data = el;
    const type = el.type || data?.type || "default"; // Default to 'default' if type is not set

    let imgSrc = null;
    let icon = null;
    let color = "#007bff";

    if (type === "ambulance") {
      imgSrc = data?.coverImage;
      icon = "fas fa-ambulance fa-3x";
    } else if (type === "doctor") {
      imgSrc = data?.coverImage;
      icon = "fas fa-user-md fa-3x";
      color = "#28a745";
    } else if (type === "nurse") {
      imgSrc = data?.coverImage;
      icon = "fas fa-user-nurse fa-3x";
      color = "#17a2b8";
    } else if (type === "pathology") {
      imgSrc = data?.coverImage;
      icon = "fas fa-flask fa-3x";
      color = "#ffc107";
    } else {
      imgSrc = user_img;
    }

    if (imgSrc) {
      return (
        <Image
          src={imgSrc}
          alt="Provider"
          fluid
          style={{ width: 150, height: 150, objectFit: "cover", background: "#f1f3f5" }}
        />
      );
    }

    return (
      <div
        style={{
          width: 150,
          height: 150,
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

  return (
    <>
      <Header />
      <Banner />

      <div className="doctor-content content">
        <Container>
          <Row>
            <Col xl="12" lg="12" className="map-view">
              <Row>
                <Col xl="3" lg="3" className="theiaStickySidebar">
                  <div className="filter-contents">
                    <div className="filter-header">
                      <h4 className="filter-title">Filter</h4>
                    </div>
                    <div className="filter-details">
                      <div className="filter-grid">
                        <h4><a>Role</a></h4>
                        <div className="filter-collapse">
                          <ul>
                            <li>
                              <label className="custom_check d-inline-flex">
                                <input
                                  type="checkbox"
                                  checked={selectedRoles.includes('doctor')}
                                  onChange={() => handleRoleChange('doctor')}
                                />
                                <span className="checkmark"></span>
                                Doctor
                              </label>
                            </li>
                            <li>
                              <label className="custom_check d-inline-flex">
                                <input
                                  type="checkbox"
                                  checked={selectedRoles.includes('nurse')}
                                  onChange={() => handleRoleChange('nurse')}
                                />
                                <span className="checkmark"></span>
                                Nurse
                              </label>
                            </li>
                            <li>
                              <label className="custom_check d-inline-flex">
                                <input
                                  type="checkbox"
                                  checked={selectedRoles.includes('pathology')}
                                  onChange={() => handleRoleChange('pathology')}
                                />
                                <span className="checkmark"></span>
                                Pathology
                              </label>
                            </li>
                            <li>
                              <label className="custom_check d-inline-flex">
                                <input
                                  type="checkbox"
                                  checked={selectedRoles.includes('ambulance')}
                                  onChange={() => handleRoleChange('ambulance')}
                                />
                                <span className="checkmark"></span>
                                Ambulance
                              </label>
                            </li>
                            <li>
                              <label className="custom_check d-inline-flex">
                                <input
                                  type="checkbox"
                                  checked={selectedRoles.includes('biomedical')}
                                  onChange={() => handleRoleChange('biomedical')}
                                />
                                <span className="checkmark"></span>
                                Biomedical
                              </label>
                            </li>
                            <li>
                              <label className="custom_check d-inline-flex">
                                <input
                                  type="checkbox"
                                  checked={selectedRoles.includes('hospital')}
                                  onChange={() => handleRoleChange('hospital')}
                                />
                                <span className="checkmark"></span>
                                Hospital
                              </label>
                            </li>
                          </ul>
                        </div>
                        <h4 className="mt-4">
                          <a href="#collapseeight" data-bs-toggle="collapse">
                            Languages
                          </a>
                        </h4>
                        <div id="collapseeight" className="collapse show">
                          <div className="filter-collapse">
                            <ul>
                              {allLanguages.map((lang) => (
                                <li key={lang}>
                                  <label className="custom_check d-inline-flex">
                                    <input
                                      type="checkbox"
                                      checked={selectedLanguages.includes(lang)}
                                      onChange={() => handleLanguageChange(lang)}
                                    />
                                    <span className="checkmark"></span>
                                    {lang}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      <h4 className="mt-4">
                        <a href="#collapsenine" data-bs-toggle="collapse">
                          Speciality/Designation
                        </a>
                      </h4>
                      <div id="collapsenine" className="collapse show">
                        <div className="filter-collapse">
                          <ul>
                            {allSpecialities.map((spec) => (
                              <li key={spec}>
                                <label className="custom_check d-inline-flex">
                                  <input
                                    type="checkbox"
                                    checked={selectedSpecialities.includes(spec)}
                                    onChange={() => handleSpecialityChange(spec)}
                                  />
                                  <span className="checkmark"></span>
                                  {spec}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="filter-btn apply-btn mt-5">
                        <div className="row">
                          <div className="col-6">
                            <button 
                              className="btn btn-primary"
                              onClick={handleApplyFilters}
                            >
                              Apply
                            </button>
                          </div>
                          <div className="col-6">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={handleResetFilters}
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xl="9" lg="9">
                  <div className="doctor-filter-info">
                    <div className="doctor-filter-inner">
                      <div>
                        <div className="doctors-found">
                          <div className="search-filter">
                            <div className="input-group">
                              <span className="input-group-text">
                              <i className="fas fa-search"></i> 
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                          </div>
                          <p className="mt-3 text-center text-gray-500">
                            <span>Total {practitionersList.length} Found</span>
                          </p>
                        </div>
                      </div>
                      <div></div>
                      <div className="doctor-filter-option">
                        <div className="doctor-filter-sort">
                          <p>Sort</p>
                          <div className="doctor-filter-select">
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                              <option value="A-Z">A to Z</option>
                              <option value="Z-A">Z to A</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card doctor-card">
                    {loading ? (
                      <div className="card-body text-center py-5">
                        <Spinner />
                      </div>
                    ) : practitionersList.length > 0 ? (
                      practitionersList?.map((el, index) => {
                        const data = getProfile(el);
                        return (
                          <div key={index} className="card-body">
                            <div className="doctor-widget-one">
                              <div className="doc-info-left">
                                <div className="doctor-img">
                                  <a href="#">
                                    {getProfileImageBlock(el)}
                                    {/* <img
                                      src={el?.profile?.coverImage || el?.coverImage || user_img}
                                      className="img-fluid"
                                      alt="Profile"
                                    /> */}
                                  </a>
                                </div>
                                <div className="doc-info-cont">
                                  <h4 className="doc-name">
                                    {el.type === 'nurse' ? (
                                      <>
                                        <span>{
                                          data.displayName ||
                                          `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
                                          data.name ||
                                          'Nurse'
                                        }</span>
                                        <i className="fas fa-circle-check"></i>
                                      </>
                                    ) : el.type === 'pathology' ? (
                                      <>
                                        <span>{
                                          data.displayName ||
                                          `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
                                          data.name ||
                                          'Pathology'
                                        }</span>
                                        <i className="fas fa-circle-check"></i>
                                      </>
                                    ) : el.type === 'ambulance' ? (
                                      <>
                                        <span>{
                                          data.displayName ||
                                          `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
                                          data.name ||
                                          'Ambulance Service'
                                        }</span>
                                        <i className="fas fa-circle-check"></i>
                                      </>
                                    ) : el.type === 'biomedical' ? (
                                      <>
                                        <span>{
                                          data.displayName ||
                                          `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
                                          data.name ||
                                          'Biomedical Service'
                                        }</span>
                                        <i className="fas fa-circle-check"></i>
                                      </>
                                    ) : el.type === 'hospital' ? (
                                      <>
                                        <span>{
                                          data.displayName ||
                                          `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
                                          data.name ||
                                          'Hospital Service'
                                        }</span>
                                        <i className="fas fa-circle-check"></i>
                                      </>
                                    ) : (
                                      <>
                                        <Link to="/doctorprofile">
                                          {formatName(data)}
                                        </Link>
                                        <i className="fas fa-circle-check"></i>
                                      </>
                                    )}
                                  </h4>
                                  <p className="doc-speciality">
                                    {el.type === 'nurse' ? (
                                      'Nurse'
                                    ) : el.type === 'pathology' ? (
                                      'Pathology'
                                    ) : el.type === 'ambulance' ? (
                                      'Ambulance Service'
                                    ) : el.type === 'biomedical' ? (
                                      'Biomedical Engineering'
                                    ) : el.type === 'hospital' ? (
                                      'Hospital Services'
                                    ) : (
                                      `${data?.designation || ""}${
                                        data?.achievement
                                          ? `, ${data.achievement}`
                                          : ""
                                      }`
                                    )}
                                  </p>
                                  <div className="clinic-details">
                                    <p className="doc-location">
                                      <MapPin size={18} />
                                      <span>{cpFirstName(data?.address)}</span>
                                    </p>
                                    <p className="doc-location">
                                      <Award size={18} />
                                      <span>
                                        {" "}
                                        &nbsp;{data?.experience || 20}
                                      </span>{" "}
                                      Years of Experience
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="doc-info-right">
                                <div className="clini-infos">
                                  <ul>
                                    <li
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                      }}
                                    >
                                      <span>
                                        <Clock size={18} />
                                      </span>

                                      <span
                                        className={`available-date ${
                                          data?.available || data?.availability
                                            ? "available-today"
                                            : "notavailable-today"
                                        }`}
                                      >
                                        {data?.available || data?.availability
                                          ? "Available Today"
                                          : "Not available today"}
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="clinic-booking book-appoint">
                                  {el.type === 'pathology' ? (
                                    <>
                                      <Link
                                        className="btn btn-primary"
                                        to={`/pathologyprofile?userId=${el?._id}`}
                                      >
                                        View Details
                                      </Link>
                                      <div
                                        onClick={() => !bookingLoading && handleBookAppointment(el)}
                                        className={`btn btn-primary-light ${bookingLoading ? 'disabled' : ''}`}
                                        style={{ 
                                          cursor: bookingLoading ? 'not-allowed' : 'pointer',
                                          opacity: bookingLoading ? 0.6 : 1
                                        }}
                                      >
                                        {bookingLoading ? (
                                          <>
                                            <Spinner size="sm" className="me-2" />
                                            Booking...
                                          </>
                                        ) : (
                                          'Book Lab Test'
                                        )}
                                      </div>
                                    </>
                                  ) : el.type === 'ambulance' ? (
                                    <>
                                      <Link
                                        className="btn btn-primary"
                                        to={`/ambulanceprofile?userId=${el?._id}`}
                                      >
                                        View Details
                                      </Link>
                                      <button
                                        className="btn btn-primary-light w-100"
                                        onClick={() => !bookingLoading && handleBookAppointment(el)}
                                      >
                                        Book Ambulance
                                      </button>
                                    </>
                                  ) : el.type === 'biomedical' ? (
                                    <>
                                      <Link
                                        className="btn btn-primary"
                                        to={`/biomedicalprofile?userId=${el?._id}`}
                                      >
                                        View Details
                                      </Link>
                                      <Link
                                        className="btn btn-primary-light"
                                        to="/biomedical-booking"
                                      >
                                        Book Service
                                      </Link>
                                    </>
                                  ) : el.type === 'hospital' ? (
                                    <>
                                      <Link
                                        className="btn btn-primary"
                                        to={`/hospitalprofile?userId=${el?._id}`}
                                      >
                                        View Details
                                      </Link>
                                      <Link
                                        className="btn btn-primary-light"
                                        to="/hospital-booking"
                                      >
                                        Book Service
                                      </Link>
                                    </>
                                  ) : (
                                    <>
                                      <Link
                                        className="btn btn-primary"
                                        to={el.type === 'nurse' ? `/nurseprofile?userId=${el?._id}` : `/doctorprofile?userId=${el?._id}`}
                                      >
                                        View Details
                                      </Link>
                                      <div
                                        onClick={() => !bookingLoading && handleBookAppointment(el)}
                                        className={`btn btn-primary-light ${bookingLoading ? 'disabled' : ''}`}
                                        style={{ 
                                          cursor: bookingLoading ? 'not-allowed' : 'pointer',
                                          opacity: bookingLoading ? 0.6 : 1
                                        }}
                                      >
                                        {bookingLoading ? (
                                          <>
                                            <Spinner size="sm" className="me-2" />
                                            Booking...
                                          </>
                                        ) : (
                                          'Book Online Consultation'
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="card-body text-center py-5">
                        <div className="no-result-found">
                          <i className="feather-search mb-3" style={{ fontSize: '48px', color: '#ccc' }}></i>
                          <h4 className="text-muted mb-2">No results found</h4>
                          <p className="text-muted">Try adjusting your search or filter criteria</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default BookAppointment; 