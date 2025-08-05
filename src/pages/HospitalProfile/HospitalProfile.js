import React from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from "react-bootstrap";
import { 
  MapPin, Phone, Mail, Clock, Award, Users, User, Activity, 
  Heart, Shield, Calendar, Globe, Star, Home, Package, Box,
  Briefcase, Truck, Zap, CheckCircle, FileText, ArrowLeft 
} from "react-feather";

import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import useGetMountData from "../../helpers/getDataHook";

function HospitalProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const navigate = useNavigate();

  const { data } = useGetMountData(userId ? `/hospital/viewprofile/${userId}` : null);

  if (!data) {
    return (
      <>
        <Header />
        <Breadcrumb />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading hospital profile...</p>
        </div>
        <Footer />
      </>
    );
  }

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
                    <Home size={36} color="#2563eb" />
                  </div>
                  {data.nabh_accredited && (
                    <div style={styles.verifiedBadge}>
                      <CheckCircle size={16} color="white" />
                    </div>
                  )}
                </div>
                
                <div style={styles.profileInfo}>
                  <h1 style={styles.profileName}>
                    {data.hospitalName || "Hospital Name"}
                  </h1>
                  <p style={styles.profileDesignation}>
                    {data.hospitalType || "Multi-Specialty Hospital"}
                  </p>
                  <div style={styles.locationInfo}>
                    <MapPin size={16} color="#6b7280" />
                    <span>{data.city}, {data.state}</span>
                  </div>
                </div>
              </div>

              <div style={styles.profileRight}>
                <div style={styles.statusBadges}>
                  <span style={{
                    ...styles.badge,
                    ...(data.isAvailable ? styles.badgeSuccess : styles.badgeDanger)
                  }}>
                    {data.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  {data.nabh_accredited && (
                    <span style={{...styles.badge, ...styles.badgeInfo}}>
                      <Shield size={14} />
                      NABH Accredited
                    </span>
                  )}
                  {data.acceptingPatients && (
                    <span style={{...styles.badge, ...styles.badgePurple}}>
                      Accepting Patients
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
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
                        <div style={styles.infoValue}>{data.phoneNumber}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Phone size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Emergency Number</div>
                        <div style={styles.infoValue}>{data.emergencyNumber}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Mail size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Email</div>
                        <div style={styles.infoValue}>{data.email}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <MapPin size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Address</div>
                        <div style={styles.infoValue}>
                          {data.address}, {data.landmark && `Near ${data.landmark},`} {data.city}, {data.state} - {data.pincode}
                        </div>
                      </div>
                    </div>
                    {data.website && (
                      <div style={styles.infoItem}>
                        <Globe size={16} color="#9ca3af" />
                        <div>
                          <div style={styles.infoLabel}>Website</div>
                          <div style={styles.infoValue}>{data.website}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hospital Details */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Home size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Hospital Details</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <User size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Administrator</div>
                        <div style={styles.infoValue}>{data.firstName} {data.lastName}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Calendar size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Established</div>
                        <div style={styles.infoValue}>{data.establishedYear}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Award size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Registration Number</div>
                        <div style={styles.infoValue}>{data.registrationNumber}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Users size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Total Staff</div>
                        <div style={styles.infoValue}>{data.totalStaff}</div>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Activity size={16} color="#9ca3af" />
                      <div>
                        <div style={styles.infoLabel}>Operation Theaters</div>
                        <div style={styles.infoValue}>{data.operationTheaters}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Briefcase size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Departments</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.tagContainer}>
                    {data.departments?.map((dept, index) => (
                      <span key={index} style={styles.tag}>
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Package size={20} color="#2563eb" />
                  <h2 style={styles.cardTitle}>Facilities</h2>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.tagContainer}>
                    {data.facilities?.map((facility, index) => (
                      <span key={index} style={styles.tagBlue}>
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                  {Object.entries(data.workingHours || {}).map(([day, hours]) => (
                    <div key={day} style={styles.availabilityItem}>
                      <span style={styles.availabilityLabel}>{day}</span>
                      <span style={{
                        ...styles.availabilityValue,
                        color: hours.isOpen ? '#059669' : '#dc2626'
                      }}>
                        {hours.isOpen ? `${hours.start} - ${hours.end}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Services */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Zap size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Emergency Services</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.emergencyServices}>
                    {Object.entries(data._raw?.availabilityDetails?.emergencyServices || {}).map(([service, available]) => (
                      <div key={service} style={styles.serviceItem}>
                        <span style={styles.serviceName}>
                          {service.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span style={{
                          ...styles.serviceStatus,
                          backgroundColor: available ? '#dcfce7' : '#fee2e2',
                          color: available ? '#166534' : '#dc2626'
                        }}>
                          {available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bed Availability */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <Activity size={20} color="#2563eb" />
                  <h3 style={styles.cardTitle}>Bed Availability</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.bedStats}>
                    <div style={styles.bedStatItem}>
                      <span style={styles.bedNumber}>{data.totalBeds || 0}</span>
                      <span style={styles.bedLabel}>Total Beds</span>
                    </div>
                    <div style={styles.bedStatItem}>
                      <span style={styles.bedNumber}>{data.icuBeds || 0}</span>
                      <span style={styles.bedLabel}>ICU Beds</span>
                    </div>
                    <div style={styles.bedStatItem}>
                      <span style={styles.bedNumber}>{data.emergencyBeds || 0}</span>
                      <span style={styles.bedLabel}>Emergency Beds</span>
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

// Replace the empty styles object with these styles
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
  // Loading styles
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
  // Header styles
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
  // Profile sections
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
  // Profile info
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
  // Status badges
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
  // Main content layout
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
  // Cards
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
  // Info grid
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
  // Tags
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
  // Availability sections
  availabilityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  availabilityLabel: {
    fontSize: '14px',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  availabilityValue: {
    fontSize: '14px',
    fontWeight: '600',
  },
  // Service items
  serviceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  serviceName: {
    fontSize: '14px',
    color: '#374151',
  },
  serviceStatus: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  // Bed stats
  bedStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '16px',
    textAlign: 'center',
  },
  bedStatItem: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
  },
  bedNumber: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '4px',
  },
  bedLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
};

export default HospitalProfile;