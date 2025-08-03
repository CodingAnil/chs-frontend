import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import {
  MapPin, Phone, Mail, Clock, Award, Users,
  User, Briefcase, Star, AlertCircle, CheckCircle,
  Calendar, DollarSign, Navigation, ArrowLeft, Shield,
  Building, Microscope, FileText, Activity
} from "lucide-react";

import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import useGetMountData from "../../helpers/getDataHook";
import { createAppointment } from "../../redux/slices/patientApi";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { toastMessage } from "../../config/toast";
import user_img from "../../assets/img/doctor-profile-img.jpg";

function PathologyProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apLoading = useSelector(
    (state) => state.PATIENT?.loading?.user?.createAppointmentLoading
  );

  const { data, getAllData } = useGetMountData(
    userId ? `/user/${userId}` : null
  );

  const userProfileId = getLocalStorage(STORAGE.USER_KEY);

  const handleBookAppointment = async (data) => {
    if (userProfileId?.role?.toLowerCase() === "pathology") {
      toastMessage(
        "error",
        "You are not a patient user, so you are not eligible to book lab tests."
      );
      return;
    }
    const formattedData = {
      refPathology: data?.profile?._id,
      id: userProfileId?.profile?._id,
      status: "Created",
    };
    dispatch(createAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setLocalStorage(STORAGE.APPOINTMENT_KEY, {
          appointment_id: res?.payload?._id,
        });
        navigate(`/pathologybooking/${res?.payload?._id}`);
      }
    });
  };

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

  const labProfile = data?.profile || {};

  return (
    <>
      <Header />
      <Breadcrumb />
      
      <div style={styles.container}>
        <div style={styles.content}>
          
          {/* Header Section */}
          <div style={styles.header}>
            <button 
              onClick={() => navigate(-1)}
              style={styles.backButton}
            >
              <ArrowLeft size={18} />
              Back to Labs
            </button>

            <div style={styles.profileHeader}>
              <div style={styles.profileLeft}>
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>
                    <Microscope size={36} color="#2563eb" />
                  </div>
                  <div style={styles.verifiedBadge}>
                    <CheckCircle size={16} color="white" />
                  </div>
                </div>
                
                <div style={styles.profileInfo}>
                  <h1 style={styles.profileName}>
                    {labProfile?.labName || `${labProfile?.firstName} ${labProfile?.lastName}` || "Lab Name"}
                  </h1>
                  <p style={styles.profileDesignation}>
                    {labProfile?.designation || "Pathology Laboratory"}
                  </p>
                  <div style={styles.locationInfo}>
                    <MapPin size={16} />
                    <span>{labProfile?.city}, {labProfile?.state}</span>
                  </div>
                </div>
              </div>

              <div style={styles.profileRight}>
                <div style={styles.statusBadges}>
                  <span style={{
                    ...styles.badge,
                    ...(labProfile?.available ? styles.badgeSuccess : styles.badgeDanger)
                  }}>
                    {labProfile?.available ? 'Available Now' : 'Currently Unavailable'}
                  </span>
                  <span style={{...styles.badge, ...styles.badgeInfo}}>
                    <Shield size={14} />
                    Licensed Lab
                  </span>
                </div>
                
                <div style={styles.actionButtons}>
                  <button 
                    style={styles.primaryButton}
                    onClick={() => handleBookAppointment(data)}
                    disabled={apLoading || !labProfile?.available}
                  >
                    {apLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      "Book Lab Test"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={styles.mainContent}>
            
            {/* Left Column */}
            <div style={styles.leftColumn}>
              
              {/* Contact Information */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Phone size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Contact Information</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.infoGrid}>
                    {labProfile?.contactPerson && (
                      <div style={styles.infoItem}>
                        <User size={16} color="#9ca3af" />
                        <div>
                          <div style={styles.infoLabel}>Contact Person</div>
                          <div style={styles.infoValue}>{labProfile.contactPerson}</div>
                        </div>
                      </div>
                    )}
                    <div style={styles.infoItem}>
                      <Phone size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Phone</div>
                        <div style={styles.infoValue}>{labProfile?.phoneNumber || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Mail size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Email</div>
                        <div style={styles.infoValue}>{labProfile?.email || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <MapPin size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Address</div>
                        <div style={styles.infoValue}>{labProfile?.address || "Not provided"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laboratory Details */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Building size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Laboratory Details</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <Award size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Lab ID</div>
                        <div style={styles.infoValue}>{labProfile?.labId || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Shield size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>License Number</div>
                        <div style={styles.infoValue}>{labProfile?.labLicenseNumber || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Activity size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Specialization</div>
                        <div style={styles.infoValue}>Clinical Pathology</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Tests */}
              {labProfile?.testsOffered && labProfile.testsOffered.length > 0 && (
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <FileText size={20} color="#2563eb" />
                    <h2 style={styles.cardTitle}>Available Tests</h2>
                  </div>
                  <div style={styles.cardContent}>
                    <div style={styles.tagContainer}>
                      {labProfile.testsOffered.map((test, index) => (
                        <span key={index} style={styles.tag}>
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div style={styles.rightColumn}>
              {/* Working Hours */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Clock size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Working Hours</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.availabilityGrid}>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Monday - Friday:</span>
                      <span style={styles.availabilityValue}>8:00 AM - 8:00 PM</span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Saturday:</span>
                      <span style={styles.availabilityValue}>9:00 AM - 6:00 PM</span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Sunday:</span>
                      <span style={styles.availabilityValue}>Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Offered */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Briefcase size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Services</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.tagContainer}>
                    <span style={styles.tagBlue}>Home Sample Collection</span>
                    <span style={styles.tagBlue}>Online Reports</span>
                    <span style={styles.tagBlue}>Emergency Testing</span>
                    <span style={styles.tagBlue}>Same Day Reports</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <AlertCircle size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Additional Information</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.availabilityGrid}>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Home Collection:</span>
                      <span style={styles.availabilityValue}>Available</span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Report Delivery:</span>
                      <span style={styles.availabilityValue}>Online & Physical</span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Payment Methods:</span>
                      <span style={styles.availabilityValue}>Cash, Cards, UPI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

const styles = {
  container: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '0',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '16px',
  },
  header: {
    marginBottom: '32px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'all 0.2s',
  },
  profileHeader: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  },
  profileLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: '80px',
    height: '80px',
    backgroundColor: '#eff6ff',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    width: '24px',
    height: '24px',
    backgroundColor: '#059669',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  profileName: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0',
  },
  profileDesignation: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0',
  },
  locationInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '8px',
  },
  profileRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '16px',
  },
  statusBadges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  badgeInfo: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  badgePurple: {
    backgroundColor: '#f3e8ff',
    color: '#7c3aed',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '32px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: '500',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  tagBlue: {
    padding: '6px 12px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:disabled': {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
  },
  availabilityGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  availabilityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  availabilityValue: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: '600',
  },
};

export default PathologyProfile;