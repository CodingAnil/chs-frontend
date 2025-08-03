import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MapPin, Phone, Mail, Clock, Award, Users, Truck,
  User, Briefcase, Star, AlertCircle, CheckCircle,
  Calendar, DollarSign, Navigation, ArrowLeft, Shield
} from "lucide-react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import useGetMountData from "../../helpers/getDataHook";

function AmbulanceProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const { data } = useGetMountData(userId ? `/ambulance/viewprofile/${userId}` : null);

  if (!data) {
    return (
      <>
        <Header />
        <Breadcrumb />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading ambulance profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  const ambulanceData = data || {};
  const ambulanceProfile = ambulanceData.profile || {};
  const availabilityDetails = ambulanceProfile.availabilityDetails || {};
  const ambulanceDetails = ambulanceProfile.ambulanceDetails || {};
  const workingHours = ambulanceProfile.workingHours || {};

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
                    <Truck size={36} color="#2563eb" />
                  </div>
                  {ambulanceData.isVerified && (
                    <div style={styles.verifiedBadge}>
                      <CheckCircle size={16} color="white" />
                    </div>
                  )}
                </div>
                
                <div style={styles.profileInfo}>
                  <h1 style={styles.profileName}>
                    {ambulanceProfile.displayName || "Ambulance Service"}
                  </h1>
                  <p style={styles.profileDesignation}>
                    {ambulanceProfile.designation || "Ambulance Driver"}
                  </p>
                  <div style={styles.locationInfo}>
                    <MapPin size={16} color="#6b7280" />
                    <span>{ambulanceProfile.city}, {ambulanceProfile.state}</span>
                  </div>
                </div>
              </div>

              <div style={styles.profileRight}>
                <div style={styles.statusBadges}>
                  <span style={{
                    ...styles.badge,
                    ...(ambulanceProfile.availability ? styles.badgeSuccess : styles.badgeDanger)
                  }}>
                    {ambulanceProfile.availability ? 'Available' : 'Unavailable'}
                  </span>
                  {ambulanceData.isVerified && (
                    <span style={{...styles.badge, ...styles.badgeInfo}}>
                      <Shield size={14} />
                      Verified
                    </span>
                  )}
                  {availabilityDetails.twentyFourHour && (
                    <span style={{...styles.badge, ...styles.badgePurple}}>
                      24/7 Service
                    </span>
                  )}
                </div>
                
                <div style={styles.actionButtons}>
                  {/* <button style={styles.primaryButton}>
                    <Phone size={16} />
                    Call Now
                  </button> */}
                  {/* <button style={styles.secondaryButton}>
                    Book Service
                  </button> */}
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
                    <div style={styles.infoItem}>
                      <Phone size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Phone</div>
                        <div style={styles.infoValue}>{ambulanceProfile.phoneNumber || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Mail size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Email</div>
                        <div style={styles.infoValue}>{ambulanceProfile.email || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <MapPin size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Address</div>
                        <div style={styles.infoValue}>{ambulanceProfile.address || "Not provided"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Navigation size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Pincode</div>
                        <div style={styles.infoValue}>{ambulanceProfile.pincode || "Not provided"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Truck size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Vehicle Details</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <Award size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Vehicle Number</div>
                        <div style={styles.infoValue}>{ambulanceDetails.vehicleNumber || "N/A"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Truck size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Vehicle Model</div>
                        <div style={styles.infoValue}>{ambulanceDetails.vehicleModel || "N/A"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Briefcase size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Ambulance Type</div>
                        <div style={styles.infoValue}>{ambulanceDetails.ambulanceType || "N/A"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Users size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Capacity</div>
                        <div style={styles.infoValue}>
                          {ambulanceDetails.capacity ? `${ambulanceDetails.capacity} person(s)` : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <User size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Driver License</div>
                        <div style={styles.infoValue}>{ambulanceDetails.driverLicenseNumber || "N/A"}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Star size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Experience</div>
                        <div style={styles.infoValue}>
                          {ambulanceDetails.experience ? `${ambulanceDetails.experience} years` : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Star size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Specializations</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.tagContainer}>
                    {ambulanceProfile.specializations?.length ? (
                      ambulanceProfile.specializations.map((spec, index) => (
                        <span key={index} style={styles.tag}>
                          {spec}
                        </span>
                      ))
                    ) : (
                      <p style={styles.emptyText}>No specializations listed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Navigation size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Service Areas</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.tagContainer}>
                    {ambulanceProfile.serviceAreas?.length ? (
                      ambulanceProfile.serviceAreas.map((area, index) => (
                        <span key={index} style={styles.tagBlue}>
                          {area}
                        </span>
                      ))
                    ) : (
                      <p style={styles.emptyText}>No service areas specified</p>
                    )}
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
                      <span style={styles.availabilityLabel}>24/7 Service:</span>
                      <span style={{
                        ...styles.availabilityValue,
                        color: availabilityDetails.twentyFourHour ? '#059669' : '#dc2626'
                      }}>
                        {availabilityDetails.twentyFourHour ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Emergency Only:</span>
                      <span style={styles.availabilityValue}>
                        {availabilityDetails.emergencyOnly ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Service Radius:</span>
                      <span style={styles.availabilityValue}>
                        {availabilityDetails.serviceRadius || 'N/A'} km
                      </span>
                    </div>
                  </div>
                  <div style={styles.workingHours}>
                    <div style={styles.infoLabel}>Working Hours</div>
                    <div style={styles.infoValue}>{workingHours.start} - {workingHours.end}</div>
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
                  <div style={styles.availabilityGrid}>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Base Price:</span>
                      <span style={styles.availabilityValue}>{availabilityDetails.price || 'N/A'}</span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>City Rate:</span>
                      <span style={styles.availabilityValue}>{availabilityDetails.cityRate || 'N/A'}</span>
                    </div>
                    <div style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>Out of City:</span>
                      <span style={styles.availabilityValue}>{availabilityDetails.outOfCityRate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <AlertCircle size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Emergency Contact</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.emergencyContact}>
                    <div>
                      <div style={styles.infoLabel}>Name</div>
                      <div style={styles.infoValue}>{ambulanceProfile.emergencyContactName || "Not provided"}</div>
                    </div>
                    <div>
                      <div style={styles.infoLabel}>Phone</div>
                      <div style={styles.infoValue}>{ambulanceProfile.emergencyContactNumber || "Not provided"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Calendar size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Working Days</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.tagContainer}>
                    {ambulanceProfile.availableDays?.length ? (
                      ambulanceProfile.availableDays.map((day, index) => (
                        <span key={index} style={styles.dayTag}>
                          {day}
                        </span>
                      ))
                    ) : (
                      <p style={styles.emptyText}>Not specified</p>
                    )}
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
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#2563eb',
    border: '2px solid #2563eb',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
  dayTag: {
    padding: '4px 8px',
    backgroundColor: '#f9fafb',
    color: '#374151',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: '14px',
    fontStyle: 'italic',
    margin: '0',
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
  workingHours: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  emergencyContact: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
};

export default AmbulanceProfile;