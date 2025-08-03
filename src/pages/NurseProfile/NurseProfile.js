import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MapPin, Phone, Mail, Clock, Award, Users, Heart,
  User, Briefcase, Star, AlertCircle, CheckCircle,
  Calendar, DollarSign, Navigation, ArrowLeft, Shield,
  Languages, FileText, Activity
} from "lucide-react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { toastMessage } from "../../config/toast";
import { useDispatch, useSelector } from "react-redux";
import { createAppointment } from "../../redux/slices/patientApi";

function NurseProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const apLoading = useSelector(
    (state) => state.DOCTOR?.loading?.user?.createAppointmentLoading
  );

  const { data } = useGetMountData(userId ? `/user/${userId}` : null);

  const userProfileId = getLocalStorage(STORAGE.USER_KEY);

  const handleBookAppointment = async (data) => {
    if (userProfileId?.role?.toLowerCase() === "doctor") {
      toastMessage(
        "error",
        "You are not a patient user, so you are not eligible to create an appointment."
      );
      return;
    }
    const formattedData = {
      refNurse: data?.profile?._id,
      id: userProfileId?.profile?._id,
      status: "Created",
    };
    dispatch(createAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled")
        setLocalStorage(STORAGE.APPOINTMENT_KEY, {
          appointment_id: res?.payload?._id,
        });
      navigate(`/nursebooking/${res?.payload?._id}`);
    });
  };

  if (!data) {
    return (
      <>
        <Header />
        <Breadcrumb />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading nurse profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  const nurseData = data || {};
  const nurseProfile = nurseData.profile || {};
  const availabilityDetails = nurseProfile.availabilityDetails || {};
  const qualifications = nurseProfile.qualifications || {};

  // Updated data structure mapping
  const profileData = {
    ...nurseData,
    displayName: nurseProfile.displayName || nurseData.name,
    designation: nurseProfile.designation || "Registered Nurse",
    address: nurseProfile.address || "Address not provided",
    languages: nurseProfile.languages || [],
    availability: nurseProfile.availability,
    price: availabilityDetails.price || 0,
    wardName: availabilityDetails.wardName || "General Ward",
    floor: availabilityDetails.floor || "Not specified",
    twentyFourHour: availabilityDetails.twentyFourHour || false,
    readyForTravel: availabilityDetails.readyForTravel || false,
    experience: qualifications.experience || "Not provided",
    licenseNumber: qualifications.licenseNumber || "Not provided",
    qualification: qualifications.qualification || "Not provided",
    description: qualifications.description || "Not provided",
    skills: nurseProfile.skills || [],
    hospitalsWorked: qualifications.hospitalsWorked || [],
    documents: nurseProfile.documents || {}
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              Back to Results
            </button>

            <div style={styles.profileHeader}>
              <div style={styles.profileLeft}>
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>
                    {nurseData.coverImage ? (
                      <img 
                        src={nurseData.coverImage} 
                        alt={nurseData.name}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Heart size={36} color="#2563eb" />
                    )}
                  </div>
                  {nurseData.isVerified && (
                    <div style={styles.verifiedBadge}>
                      <CheckCircle size={16} color="white" />
                    </div>
                  )}
                </div>
                
                <div style={styles.profileInfo}>
                  <h1 style={styles.profileName}>
                    {profileData.name || "Nurse"}
                  </h1>
                  <p style={styles.profileDesignation}>
                    {profileData.designation}
                  </p>
                  <div style={styles.locationInfo}>
                    <MapPin size={16} color="#6b7280" />
                    <span>{profileData.address}</span>
                  </div>
                </div>
              </div>

              <div style={styles.profileRight}>
                <div style={styles.statusBadges}>
                  <span style={{
                    ...styles.badge,
                    ...(profileData.availability ? styles.badgeSuccess : styles.badgeDanger)
                  }}>
                    {profileData.availability ? 'Available' : 'Unavailable'}
                  </span>
                  {nurseData.isVerified && (
                    <span style={{...styles.badge, ...styles.badgeInfo}}>
                      <Shield size={14} />
                      Verified
                    </span>
                  )}
                  {profileData.twentyFourHour && (
                    <span style={{...styles.badge, ...styles.badgePurple}}>
                      24/7 Service
                    </span>
                  )}
                  {profileData.readyForTravel && (
                    <span style={{...styles.badge, ...styles.badgeWarning}}>
                      Travel Ready
                    </span>
                  )}
                  <span style={{...styles.badge, ...styles.badgeWarning}}>
                    {nurseData.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={styles.mainContent}>
            
            {/* Left Column */}
            <div style={styles.leftColumn}>
              
              {/* Personal Information */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <User size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Personal Information</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <User size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Full Name</div>
                        <div style={styles.infoValue}>{nurseData.name || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <User size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Display Name</div>
                        <div style={styles.infoValue}>{profileData.displayName}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Mail size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Email</div>
                        <div style={styles.infoValue}>{nurseData.email}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Phone size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Phone</div>
                        <div style={styles.infoValue}>{nurseData.phoneNumber}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <MapPin size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Address</div>
                        <div style={styles.infoValue}>{profileData.address}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Languages size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Languages</div>
                        <div style={styles.infoValue}>
                          {profileData.languages?.join(", ") || "Not specified"}
                        </div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <User size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>First Name</div>
                        <div style={styles.infoValue}>{nurseProfile.firstName || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <User size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Last Name</div>
                        <div style={styles.infoValue}>{nurseProfile.lastName || "Not provided"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Briefcase size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Professional Details</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <Award size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Designation</div>
                        <div style={styles.infoValue}>{profileData.designation}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Heart size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Role</div>
                        <div style={styles.infoValue}>{nurseData.role}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <FileText size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Qualification</div>
                        <div style={styles.infoValue}>{profileData.qualification}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <FileText size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>License Number</div>
                        <div style={styles.infoValue}>{profileData.licenseNumber}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Star size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Experience</div>
                        <div style={styles.infoValue}>{profileData.experience}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Activity size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Specializations</div>
                        <div style={styles.infoValue}>{profileData.description}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Activity size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Skills & Services Offered</div>
                        <div style={styles.infoValue}>
                          {profileData.skills?.join(", ") || "Not provided"}
                        </div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Navigation size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Ward Specialization</div>
                        <div style={styles.infoValue}>{profileData.wardName}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Navigation size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Floor Preference</div>
                        <div style={styles.infoValue}>Floor {profileData.floor}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Briefcase size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Work Experience</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.experienceList}>
                    {profileData.hospitalsWorked?.length ? (
                      profileData.hospitalsWorked.map((hospital, index) => (
                        <div key={hospital._id || index} style={styles.experienceItem}>
                          <div style={styles.experienceIcon}>
                            <Briefcase size={16} color="#2563eb" />
                          </div>
                          <div style={styles.experienceContent}>
                            <h4 style={styles.experienceName}>{hospital.name || "Not provided"}</h4>
                            <p style={styles.experienceRole}>
                              {hospital.designation || "Not specified"} • {hospital.duration || "Not specified"}
                            </p>
                            <p style={styles.experienceDescription}>
                              Professional nursing experience at this healthcare facility
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={styles.emptyText}>No work experience listed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents Verification */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <FileText size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Document Verification</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.documentGrid}>
                    {Object.entries(profileData.documents).map(([key, value]) => (
                      <div key={key} style={styles.documentItem}>
                        <div style={styles.documentIcon}>
                          <CheckCircle size={16} color="#059669" />
                        </div>
                        <div>
                          <div style={styles.documentName}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div style={styles.documentStatus}>
                            {value ? "Verified" : "Not provided"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div style={styles.rightColumn}>
              
              {/* Availability */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Clock size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Availability</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.availabilityGrid}>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Current Status:</span>
                      <span style={{
                        ...styles.availabilityValue,
                        color: profileData.availability ? '#059669' : '#dc2626'
                      }}>
                        {profileData.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>24/7 Service:</span>
                      <span style={{
                        ...styles.availabilityValue,
                        color: profileData.twentyFourHour ? '#059669' : '#dc2626'
                      }}>
                        {profileData.twentyFourHour ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Travel Ready:</span>
                      <span style={{
                        ...styles.availabilityValue,
                        color: profileData.readyForTravel ? '#059669' : '#dc2626'
                      }}>
                        {profileData.readyForTravel ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Ward:</span>
                      <span style={styles.availabilityValue}>
                        {profileData.wardName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <DollarSign size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Pricing</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.pricingContainer}>
                    <div style={styles.priceMain}>
                      <span style={styles.priceAmount}>₹{profileData.price}</span>
                      <span style={styles.priceUnit}>per hour</span>
                    </div>
                    <div style={styles.pricingNote}>
                      <p style={styles.noteText}>
                        Professional nursing care at competitive rates
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Shield size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Account Information</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.availabilityGrid}>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>User ID:</span>
                      <span style={styles.availabilityValue}>
                        ...{nurseData._id?.slice(-8) || 'N/A'}
                      </span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Status:</span>
                      <span style={styles.availabilityValue}>
                        {nurseData.status || 'Active'}
                      </span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Verified:</span>
                      <span style={{
                        ...styles.availabilityValue,
                        color: nurseData.isVerified ? '#059669' : '#dc2626'
                      }}>
                        {nurseData.isVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Member Since:</span>
                      <span style={styles.availabilityValue}>
                        {nurseData.createdAt ? formatDate(nurseData.createdAt) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Note */}
              <div style={{...styles.card, backgroundColor: '#fef2f2', border: '1px solid #fecaca'}}>
                <div style={styles.cardHeader}>
                  <AlertCircle size={20} color="#dc2626" />
                  <h3 style={{...styles.cardTitle, color: '#dc2626'}}>Emergency Note</h3>
                </div>
                <div style={styles.cardContent}>
                  <p style={{...styles.emptyText, color: '#7f1d1d', fontStyle: 'normal'}}>
                    For medical emergencies, please contact emergency services immediately at 108 or your local emergency number.
                  </p>
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
  badgeWarning: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
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
  experienceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  experienceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  experienceIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#eff6ff',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  experienceContent: {
    flex: 1,
  },
  experienceName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  experienceRole: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },
  experienceDescription: {
    fontSize: '13px',
    color: '#9ca3af',
    margin: '0',
    lineHeight: '1.4',
  },
  documentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  documentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
  },
  documentName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#166534',
  },
  documentStatus: {
    fontSize: '11px',
    color: '#059669',
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
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },
  availabilityValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#111827',
  },
  pricingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  priceMain: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  priceAmount: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
  },
  priceUnit: {
    fontSize: '14px',
    color: '#6b7280',
  },
  pricingNote: {
    marginTop: '8px',
  },
  noteText: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    fontStyle: 'italic',
  }
};

export default NurseProfile;