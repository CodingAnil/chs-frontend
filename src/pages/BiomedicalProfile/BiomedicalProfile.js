import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import {
  MapPin, Phone, Mail, Clock, Award, Users, Wrench,
  User, Briefcase, Star, AlertCircle, CheckCircle,
  Calendar, DollarSign, Navigation, ArrowLeft, Shield,
  Settings, FileText
} from "lucide-react";

import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import useGetMountData from "../../helpers/getDataHook";
import './BiomedicalProfile.css';

function BiomedicalProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const { data } = useGetMountData(`/biomedical/viewprofile/${userId}`);

  if (!data) {
    return (
      <>
        <Header />
        <Breadcrumb />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading biomedical profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ FIX: Access the nested data structure correctly
  const biomedicalData = data?.profile || {};
  const userData = data || {};

  console.log("🔍 Full Data:", data);
  console.log("🔍 Biomedical Data:", biomedicalData);
  console.log("🔍 Engineering License:", biomedicalData.qualifications?.engineeringLicense);

  return (
    <>
      <Header />
      <Breadcrumb />
      
      <div className="profile-container">
        <div className="profile-content">
          {/* Header */}
          <div className="profile-header">
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeft size={18} />
              Back to Results
            </button>

            <div className="main-header">
              <div className="header-left">
                <div className="avatar-container">
                  <div className="avatar">
                    {userData.coverImage ? (
                      <img 
                        src={userData.coverImage} 
                        alt="Profile" 
                        style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Wrench size={36} color="#2563eb" />
                    )}
                  </div>
                  <div className="verified-badge">
                    <CheckCircle size={16} color="white" />
                  </div>
                </div>
                
                <div className="profile-info">
                  <h1>{biomedicalData.firstName} {biomedicalData.lastName}</h1>
                  <p>{biomedicalData.designation || "Biomedical Engineer"}</p>
                  <div className="location">
                    <MapPin size={16} />
                    <span>{biomedicalData.city || 'City'}, {biomedicalData.state || 'State'}</span>
                  </div>
                </div>
              </div>

              <div className="header-right">
                <div className="status-badges">
                  <span className={`badge ${biomedicalData.availability ? 'success' : 'danger'}`}>
                    {biomedicalData.availability ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="badge info d-flex">
                    <Shield size={14} />
                    Certified Engineer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="left-column">
              {/* Contact Information */}
              <div className="card">
                <div className="card-header">
                  <Phone size={20} color="#2563eb" />
                  <h2>Contact Information</h2>
                </div>
                <div className="card-content">
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{biomedicalData.phoneNumber || userData.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>{biomedicalData.email || userData.email || 'Not provided'}</span>
                  </div>
                  <div className="contact-item">
                    <MapPin size={16} />
                    <span>
                      {biomedicalData.address || 'Address not provided'}
                      {biomedicalData.city && `, ${biomedicalData.city}`}
                      {biomedicalData.state && `, ${biomedicalData.state}`}
                      {biomedicalData.pinCode && ` - ${biomedicalData.pinCode}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="card">
                <div className="card-header">
                  <Briefcase size={20} color="#2563eb" />
                  <h2>Company Details</h2>
                </div>
                <div className="card-content">
                  <div className="detail-item">
                    <strong>Company:</strong> {biomedicalData.biomedicalDetails?.companyName || 'Not specified'}
                  </div>
                  <div className="detail-item">
                    <strong>Service Type:</strong> {biomedicalData.biomedicalDetails?.serviceType || 'All Services'}
                  </div>
                  <div className="detail-item">
                    <strong>Experience:</strong> {biomedicalData.biomedicalDetails?.experience || 'Not specified'} years
                  </div>
                  {biomedicalData.biomedicalDetails?.previousClients?.length > 0 && (
                    <div className="detail-item">
                      <strong>Previous Clients:</strong> {biomedicalData.biomedicalDetails.previousClients.length} clients served
                    </div>
                  )}
                </div>
              </div>

              {/* Equipment Specialties */}
              <div className="card">
                <div className="card-header">
                  <Settings size={20} color="#2563eb" />
                  <h2>Equipment Specialties</h2>
                </div>
                <div className="card-content">
                  <div className="tag-container">
                    {biomedicalData.biomedicalDetails?.equipmentSpecialty?.length > 0 ? (
                      biomedicalData.biomedicalDetails.equipmentSpecialty.map((spec, index) => (
                        <span key={index} className="tag">{spec}</span>
                      ))
                    ) : (
                      <p>No specialties listed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="card">
                <div className="card-header">
                  <Award size={20} color="#2563eb" />
                  <h2>Qualifications</h2>
                </div>
                <div className="card-content">
                  <div className="detail-item">
                    <strong>Engineering Degree:</strong> {biomedicalData.qualifications?.engineeringDegree || 'Not specified'}
                  </div>
                  <div className="detail-item">
                    <strong>Biomedical Certification:</strong> {biomedicalData.qualifications?.biomedicalCertification || 'Not specified'}
                  </div>
                  {/* ✅ Engineering License - This should now display "12345678" */}
                  <div className="detail-item">
                    <strong>Engineering License:</strong> {biomedicalData.qualifications?.engineeringLicense || 'Not specified'}
                  </div>
                  <div className="manufacturer-certs">
                    <strong>Manufacturer Certifications:</strong>
                    <div className="tag-container">
                      {biomedicalData.qualifications?.manufacturerCertifications?.length > 0 ? (
                        biomedicalData.qualifications.manufacturerCertifications.map((cert, index) => (
                          <span key={index} className="tag">{cert}</span>
                        ))
                      ) : (
                        <p>No manufacturer certifications listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="card">
                <div className="card-header">
                  <DollarSign size={20} color="#2563eb" />
                  <h2>Service Details</h2>
                </div>
                <div className="card-content">
                  <div className="detail-item">
                    <strong>Service Area:</strong> {biomedicalData.availabilityDetails?.serviceArea || 'Not specified'}
                  </div>
                  <div className="detail-item">
                    <strong>Base Price:</strong> ₹{biomedicalData.availabilityDetails?.price || 0}
                  </div>
                  <div className="detail-item">
                    <strong>Working Hours:</strong> 
                    {biomedicalData.availabilityDetails?.workingHours ? 
                      ` ${biomedicalData.availabilityDetails.workingHours.start} - ${biomedicalData.availabilityDetails.workingHours.end}` : 
                      ' 9:00 AM - 6:00 PM'
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="right-column">
              {/* Availability */}
              <div className="card">
                <div className="card-header">
                  <Clock size={20} color="#2563eb" />
                  <h3>Availability</h3>
                </div>
                <div className="card-content">
                  <div className="availability-details">
                    <div className="detail-item">
                      <span className={`status-dot ${biomedicalData.availability ? 'active' : 'inactive'}`}></span>
                      <strong>{biomedicalData.availability ? 'Currently Available' : 'Not Available'}</strong>
                    </div>
                    {biomedicalData.availabilityDetails?.twentyFourHour && (
                      <div className="badge success">24/7 Service</div>
                    )}
                    {biomedicalData.availabilityDetails?.emergencySupport && (
                      <div className="badge warning">Emergency Support</div>
                    )}
                  </div>
                  
                  {/* Working Hours Display */}
                  <div className="schedule-container">
                    <div className="schedule-item">
                      <strong>Working Hours:</strong>
                      <div>
                        {biomedicalData.availabilityDetails?.workingHours ? 
                          `${biomedicalData.availabilityDetails.workingHours.start} - ${biomedicalData.availabilityDetails.workingHours.end}` : 
                          '9:00 AM - 6:00 PM'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Weekly Schedule if available */}
                  {biomedicalData.availabilityDetails?.weeklySchedule && 
                   Object.keys(biomedicalData.availabilityDetails.weeklySchedule).length > 0 && (
                    <div className="schedule-container">
                      <strong>Weekly Schedule:</strong>
                      {Object.entries(biomedicalData.availabilityDetails.weeklySchedule).map(([day, times]) => (
                        <div key={day} className="schedule-item">
                          <strong>{day}:</strong>
                          <div>
                            {times.morning && <span>Morning: {times.morning}</span>}
                            {times.evening && <span>Evening: {times.evening}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Previous Clients */}
              <div className="card">
                <div className="card-header">
                  <Users size={20} color="#2563eb" />
                  <h3>Previous Clients</h3>
                </div>
                <div className="card-content">
                  {biomedicalData.biomedicalDetails?.previousClients?.length > 0 ? (
                    biomedicalData.biomedicalDetails.previousClients.map((client, index) => (
                      <div key={index} className="client-item">
                        <strong>{client.name}</strong>
                        <div className="client-details">
                          <span>{client.serviceType}</span>
                          <span>{client.duration}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No previous clients listed</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              {biomedicalData.skills && biomedicalData.skills.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <Star size={20} color="#2563eb" />
                    <h3>Skills</h3>
                  </div>
                  <div className="card-content">
                    <div className="tag-container">
                      {biomedicalData.skills.map((skill, index) => (
                        <span key={index} className="tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Certifications */}
              {biomedicalData.biomedicalDetails?.certifications?.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <Award size={20} color="#2563eb" />
                    <h3>Certifications</h3>
                  </div>
                  <div className="card-content">
                    <div className="tag-container">
                      {biomedicalData.biomedicalDetails.certifications.map((cert, index) => (
                        <span key={index} className="tag">{cert}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Status */}
              <div className="card">
                <div className="card-header">
                  <Shield size={20} color="#2563eb" />
                  <h3>Profile Status</h3>
                </div>
                <div className="card-content">
                  <div className="status-item">
                    <CheckCircle size={16} color="green" />
                    <span>Profile Verified</span>
                  </div>
                  {userData.isVerified && (
                    <div className="status-item">
                      <CheckCircle size={16} color="green" />
                      <span>Identity Verified</span>
                    </div>
                  )}
                  <div className="status-item">
                    <span className={`status-dot ${userData.status === 'Active' ? 'active' : 'pending'}`}></span>
                    <span>Status: {userData.status || 'Pending'}</span>
                  </div>
                  <div className="status-item">
                    <Calendar size={16} />
                    <span>Member since: {new Date(userData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="card">
                <div className="card-content">
             
                  
                  {/* Service highlights */}
                  <div className="service-highlights">
                    <h4>Service Highlights</h4>
                    <ul>
                      {biomedicalData.availabilityDetails?.emergencySupport && (
                        <li>✅ Emergency Support Available</li>
                      )}
                      {biomedicalData.availabilityDetails?.twentyFourHour && (
                        <li>✅ 24/7 Service Available</li>
                      )}
                      <li>✅ {biomedicalData.biomedicalDetails?.experience || '5'}+ Years Experience</li>
                      <li>✅ Certified Biomedical Engineer</li>
                      <li>✅ Multiple Equipment Specialties</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {(biomedicalData.achievement || biomedicalData.languages) && (
                <div className="card">
                  <div className="card-header">
                    <FileText size={20} color="#2563eb" />
                    <h3>Additional Information</h3>
                  </div>
                  <div className="card-content">
                    {biomedicalData.achievement && (
                      <div className="detail-item">
                        <strong>Achievements:</strong> {biomedicalData.achievement}
                      </div>
                    )}
                    {biomedicalData.languages && (
                      <div className="detail-item">
                        <strong>Languages:</strong> {Array.isArray(biomedicalData.languages) ? biomedicalData.languages.join(', ') : biomedicalData.languages}
                      </div>
                    )}
                    {biomedicalData.dob && (
                      <div className="detail-item">
                        <strong>Date of Birth:</strong> {new Date(biomedicalData.dob).toLocaleDateString()}
                      </div>
                    )}
                    {biomedicalData.gender && (
                      <div className="detail-item">
                        <strong>Gender:</strong> {biomedicalData.gender}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BiomedicalProfile;