import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { callPutApi, callPostApi, callDeleteApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import biomedical_img from "../../assets/img/dr_profile.jpg";
import DeleteModal from "../../components/modals/delete-modal";
import { Spinner } from "reactstrap";

const profileSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone Number must be numeric"),
  designation: yup.string().required("Designation is required"),
  companyName: yup.string().required("Company Name is required"),
  experience: yup.string().required("Experience is required"),
  engineeringLicense: yup.string().required("Engineering License is required"),
  equipmentSpecialty: yup.array().min(1, "At least one equipment specialty is required"),
});

const Profile = ({ biomedicalDetails, getAllData }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState({ is: false, id: null });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
      email: "",
      phoneNumber: "",
      designation: "Biomedical Engineer",
      address: "",
      city: "",
      state: "",
      country: "India",
      pinCode: "",
      // Biomedical specific fields
      companyName: "",
      serviceType: "All",
      equipmentSpecialty: [],
      certifications: [],
      experience: "",
      previousClients: [],
      // Qualifications
      engineeringDegree: "",
      biomedicalCertification: "",
      manufacturerCertifications: [],
      engineeringLicense: "",
      // Documents
      idProof: "",
      educationCertificates: "",
      licenseDocument: "",
      certificationDocuments: "",
      experienceLetter: "",
      policeVerification: "",
      // Availability
      emergencySupport: false,
      twentyFourHour: false,
      serviceArea: "",
      price: 0,
      workingHours: {
        start: "09:00",
        end: "18:00",
      },
    },
  });

  const equipmentSpecialtyOptions = [
    "Medical Imaging Systems",
    "Patient Monitoring Equipment",
    "Surgical Instruments",
    "Laboratory Equipment",
    "Diagnostic Equipment",
    "Life Support Systems",
    "Rehabilitation Equipment",
    "Dental Equipment",
    "Anesthesia Equipment",
    "Sterilization Equipment",
    "X-Ray Machines",
    "Ultrasound Systems",
    "MRI Machines",
    "CT Scanners",
    "ECG Machines",
    "Ventilators",
    "Dialysis Machines",
  ];

  const serviceTypeOptions = [
    "All",
    "Maintenance",
    "Repair",
    "Installation", 
    "Calibration",
    "Inspection",
    "Emergency",
    "Training",
  ];

  useEffect(() => {
    if (biomedicalDetails?.profile) {
      const profile = biomedicalDetails.profile;
      
      console.log("🔍 Profile data received:", profile);
      console.log("💼 Company details from API:", {
        companyName: profile.biomedicalDetails?.companyName,
        serviceType: profile.biomedicalDetails?.serviceType,
        experience: profile.biomedicalDetails?.experience,
        workingHours: profile.availabilityDetails?.workingHours
      });
      
      // Set all basic fields first
      setValue("firstName", profile.firstName || "");
      setValue("lastName", profile.lastName || "");
      setValue("displayName", profile.displayName || "");
      setValue("email", profile.email || "");
      setValue("phoneNumber", profile.phoneNumber?.toString() || "");
      setValue("designation", profile.designation || "Biomedical Engineer");
      setValue("address", profile.address || "");
      setValue("city", profile.city || "");
      setValue("state", profile.state || "");
      setValue("country", profile.country || "India");
      setValue("pinCode", profile.pinCode || "");
      
      // Company & Service Details - FROM biomedicalDetails object
      setValue("companyName", profile.biomedicalDetails?.companyName || "");
      setValue("serviceType", profile.biomedicalDetails?.serviceType || "All");
      setValue("experience", profile.biomedicalDetails?.experience || "");
      setValue("equipmentSpecialty", profile.biomedicalDetails?.equipmentSpecialty || []);
      setValue("certifications", profile.biomedicalDetails?.certifications || []);
      setValue("previousClients", profile.biomedicalDetails?.previousClients || []);
      
      // Qualifications - FROM qualifications object
      setValue("engineeringDegree", profile.qualifications?.engineeringDegree || "");
      setValue("biomedicalCertification", profile.qualifications?.biomedicalCertification || "");
      setValue("manufacturerCertifications", profile.qualifications?.manufacturerCertifications || []);
      setValue("engineeringLicense", profile.qualifications?.engineeringLicense || "");
      
      // Documents - FROM documents object
      setValue("idProof", profile.documents?.idProof || "");
      setValue("educationCertificates", profile.documents?.educationCertificates || "");
      setValue("licenseDocument", profile.documents?.engineeringLicense || "");
      setValue("certificationDocuments", profile.documents?.certificationDocuments || "");
      setValue("experienceLetter", profile.documents?.experienceLetter || "");
      setValue("policeVerification", profile.documents?.policeVerification || "");
      
      // Availability - FROM availabilityDetails object
      setValue("emergencySupport", profile.availabilityDetails?.emergencySupport || false);
      setValue("twentyFourHour", profile.availabilityDetails?.twentyFourHour || false);
      setValue("serviceArea", profile.availabilityDetails?.serviceArea || "");
      setValue("price", profile.availabilityDetails?.price || 0);
      
      // Working hours - FROM availabilityDetails object
      const workingHours = profile.availabilityDetails?.workingHours || { start: "09:00", end: "18:00" };
      setValue("workingHours", workingHours);
      
      console.log("✅ Form values set. Working hours:", workingHours);
      console.log("✅ Company Name set to:", profile.biomedicalDetails?.companyName);
    }
  }, [biomedicalDetails, setValue]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toastMessage("error", "No file selected.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toastMessage("error", "Please upload a valid image file (JPEG or PNG).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toastMessage("error", "File size exceeds the 4MB limit.");
      return;
    }

    setSelectedFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await callPostApi("user/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res?.data?.location) {
        throw new Error("Invalid response from server.");
      }

      const updateRes = await callPutApi(`/user/update/${biomedicalDetails?._id}`, {
        coverImage: res.data.location,
        fileKey: res.data.key,
      });

      if (updateRes?.status) {
        getAllData();
        toastMessage("success", "Profile image updated successfully");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toastMessage("error", "File upload failed. Please try again.");
    }
  };

  const handleProfileRemove = async () => {
    try {
      setLoading(true);
      const updateRes = await callDeleteApi(
        `/user/delete-dp/${biomedicalDetails._id}`
      );
      if (updateRes?.status) {
        setLoading(false);
        setIsOpen({ is: false, id: null });
        setSelectedFile(null);
        getAllData();
        toastMessage("success", "Profile image removed successfully");
      }
    } catch (error) {
      setLoading(false);
      console.error("Remove failed:", error);
      toastMessage("error", "Failed to remove profile image.");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("📝 Form submission data:", data);
    
    try {
      // Ensure all fields are properly formatted
      const formattedData = {
        ...data,
        // Convert phone number to integer
        phoneNumber: data.phoneNumber ? parseInt(data.phoneNumber) : null,
        
        // Ensure company details are properly included
        companyName: data.companyName || "",
        serviceType: data.serviceType || "All",
        experience: data.experience || "",
        
        // Ensure arrays are properly formatted
        equipmentSpecialty: Array.isArray(data.equipmentSpecialty) 
          ? data.equipmentSpecialty 
          : [],
        certifications: Array.isArray(data.certifications) 
          ? data.certifications 
          : [],
        manufacturerCertifications: Array.isArray(data.manufacturerCertifications) 
          ? data.manufacturerCertifications 
          : [],
        previousClients: Array.isArray(data.previousClients) 
          ? data.previousClients 
          : [],
        
        // Ensure working hours is properly structured
        workingHours: data.workingHours && typeof data.workingHours === 'object' 
          ? data.workingHours 
          : { start: "09:00", end: "18:00" },
        
        // Convert price to number
        price: data.price ? parseFloat(data.price) : 0,
        
        // Ensure boolean fields are properly set
        emergencySupport: Boolean(data.emergencySupport),
        twentyFourHour: Boolean(data.twentyFourHour),
      };
      
      console.log("🚀 Sending formatted data to server:", formattedData);
      console.log("💼 Company details being sent:", {
        companyName: formattedData.companyName,
        serviceType: formattedData.serviceType,
        experience: formattedData.experience,
        equipmentSpecialty: formattedData.equipmentSpecialty
      });
      
      const response = await callPutApi(`/biomedical/profile`, formattedData);
      console.log("📨 Server response:", response);
      
      if (response?.success) {
        toastMessage("success", "Profile updated successfully");
        if (getAllData) await getAllData();
      } else {
        throw new Error(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      toastMessage("error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentSpecialtyChange = (specialty) => {
    const current = watch("equipmentSpecialty") || [];
    const updated = current.includes(specialty)
      ? current.filter((s) => s !== specialty)
      : [...current, specialty];
    setValue("equipmentSpecialty", updated);
    setError("equipmentSpecialty", null);
  };

  const formatDocumentLabel = (docType) => {
    const labels = {
      idProof: "ID Proof (Aadhaar, Passport)",
      educationCertificates: "Education Certificates",
      licenseDocument: "Engineering License Document",
      certificationDocuments: "Certification Documents",
      experienceLetter: "Experience Letter",
      policeVerification: "Police Verification"
    };
    return labels[docType] || docType;
  };

  const handleDocumentUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toastMessage("error", "Please upload a valid file (JPEG, PNG, or PDF).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toastMessage("error", "File size exceeds the 4MB limit.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await callPostApi("user/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.location) {
        setValue(docType, res.data.location);
        toastMessage("success", `${formatDocumentLabel(docType)} uploaded successfully`);
      }
    } catch (error) {
      console.error("Document upload failed:", error);
      toastMessage("error", "Document upload failed. Please try again.");
    }
  };

  const handleDocumentRemove = (docType) => {
    setValue(docType, "");
    toastMessage("success", `${formatDocumentLabel(docType)} removed successfully`);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h3>Profile Settings</h3>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Profile Image Section */}
        <div className="setting-title">
          <h5>Profile Image</h5>
        </div>
        <div className="setting-card">
          <div className="change-avatar img-upload">
            <div className="profile-img">
              {biomedicalDetails?.coverImage ? (
                <img 
                  src={biomedicalDetails.coverImage} 
                  alt="Profile" 
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
              ) : selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Profile Preview"
                  style={{ borderRadius: '50%', width: '120px', height: '120px', objectFit: 'cover' }}
                />
              ) : (
                <i className="fa-solid fa-file-image"></i>
              )}
            </div>
            <div className="upload-img">
              <h5>Profile Image</h5>
              <div className="imgs-load d-flex align-items-center">
                <label className="change-photo" style={{ cursor: "pointer" }}>
                  Upload New
                  <input
                    type="file"
                    className="upload cursor-pointer"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
                <div
                  onClick={() => setIsOpen({ is: true })}
                  className="upload-remove"
                  style={{ cursor: "pointer" }}
                >
                  Remove
                </div>
              </div>
              <p className="form-text">
                Your Image should be below 4 MB, Accepted formats: jpg, png, svg
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="setting-title">
          <h5>Basic Information</h5>
        </div>
        <div className="setting-card">
          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="First Name"
                    />
                  )}
                />
                <p className="text-danger">{errors?.firstName?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Last Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Last Name"
                    />
                  )}
                />
                <p className="text-danger">{errors.lastName?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Display Name</label>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Display Name"
                    />
                  )}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Designation <span className="text-danger">*</span>
                </label>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Designation"
                      className="form-control"
                    />
                  )}
                />
                <p className="text-danger">{errors.designation?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Phone number"
                    />
                  )}
                />
                <p className="text-danger">{errors.phoneNumber?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Email address"
                      className="form-control"
                    />
                  )}
                />
                <p className="text-danger">{errors.email?.message}</p>
              </div>
            </Col>
          </Row>
        </div>

        {/* Address Information */}
        <div className="setting-title">
          <h5>Address Information</h5>
        </div>
        <div className="setting-card">
          <Row>
            <Col lg="12">
              <div className="form-wrap">
                <label className="col-form-label">Address</label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="form-control"
                      rows="3"
                      placeholder="Complete Address"
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="3" md="6">
              <div className="form-wrap">
                <label className="col-form-label">City</label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="City"
                    />
                  )}
                />
              </div>
            </Col>
            <Col lg="3" md="6">
              <div className="form-wrap">
                <label className="col-form-label">State</label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="State"
                    />
                  )}
                />
              </div>
            </Col>
            <Col lg="3" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Country</label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Country"
                    />
                  )}
                />
              </div>
            </Col>
            <Col lg="3" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Pin Code</label>
                <Controller
                  name="pinCode"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Pin Code"
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Company & Service Details */}
        <div className="setting-title">
          <h5>Company & Service Details</h5>
        </div>
        <div className="setting-card">
          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Company Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Company Name"
                    />
                  )}
                />
                <p className="text-danger">{errors.companyName?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Service Type</label>
                <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="form-control">
                      {serviceTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Experience <span className="text-danger">*</span>
                </label>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="e.g., 5+ years"
                    />
                  )}
                />
                <p className="text-danger">{errors.experience?.message}</p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="form-wrap">
                <label className="col-form-label">
                  Equipment Specialty <span className="text-danger">*</span>
                </label>
                <div className="checkbox-group">
                  <Row>
                    {equipmentSpecialtyOptions.map((specialty, index) => (
                      <Col lg="4" md="6" key={index}>
                        <label className="custom_check">
                          <input
                            type="checkbox"
                            checked={watch("equipmentSpecialty")?.includes(specialty)}
                            onChange={() => handleEquipmentSpecialtyChange(specialty)}
                          />
                          <span className="checkmark"></span>
                          {specialty}
                        </label>
                      </Col>
                    ))}
                  </Row>
                </div>
                <p className="text-danger">{errors.equipmentSpecialty?.message}</p>
              </div>
            </Col>
          </Row>
        </div>

        {/* Qualifications */}
        <div className="setting-title">
          <h5>Qualifications</h5>
        </div>
        <div className="setting-card">
          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Engineering Degree</label>
                <Controller
                  name="engineeringDegree"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="e.g., B.E. Biomedical Engineering"
                    />
                  )}
                />
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Biomedical Certification</label>
                <Controller
                  name="biomedicalCertification"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Certification Details"
                    />
                  )}
                />
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Engineering License <span className="text-danger">*</span>
                </label>
                <Controller
                  name="engineeringLicense"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="License Number"
                    />
                  )}
                />
                <p className="text-danger">{errors.engineeringLicense?.message}</p>
              </div>
            </Col>
          </Row>
        </div>

        {/* Availability Details */}
        <div className="setting-title">
          <h5>Availability Details</h5>
        </div>
        <div className="setting-card">
          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Working Hours Start</label>
                <Controller
                  name="workingHours"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="time"
                      className="form-control"
                      value={field.value?.start || "09:00"}
                      onChange={(e) => field.onChange({ 
                        ...field.value, 
                        start: e.target.value 
                      })}
                    />
                  )}
                />
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Working Hours End</label>
                <Controller
                  name="workingHours"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="time"
                      className="form-control"
                      value={field.value?.end || "18:00"}
                      onChange={(e) => field.onChange({ 
                        ...field.value, 
                        end: e.target.value 
                      })}
                    />
                  )}
                />
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Service Area</label>
                <Controller
                  name="serviceArea"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Service Area Coverage"
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Service Price (₹)</label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="form-control"
                      placeholder="0"
                      min="0"
                    />
                  )}
                />
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="custom_check">
                  <Controller
                    name="emergencySupport"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span className="checkmark"></span>
                  Emergency Support Available
                </label>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="custom_check">
                  <Controller
                    name="twentyFourHour"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span className="checkmark"></span>
                  24/7 Service Available
                </label>
              </div>
            </Col>
          </Row>
        </div>

        {/* Documents */}
        <div className="setting-title">
          <h5>Documents</h5>
        </div>
        <div className="setting-card">
          <Row>
            {['idProof', 'educationCertificates', 'licenseDocument', 'certificationDocuments', 'experienceLetter', 'policeVerification'].map((docType, index) => (
              <Col lg="6" md="6" key={docType} className="mb-4">
                <div className="change-avatar img-upload">
                  <div className="profile-img document-icon">
                    {watch(docType) ? (
                      <a href={watch(docType)} target="_blank" rel="noopener noreferrer">
                        <i className="fa-solid fa-file-lines"></i>
                      </a>
                    ) : (
                      <i className="fa-solid fa-file-upload"></i>
                    )}
                  </div>
                  <div className="upload-img">
                    <h5>{formatDocumentLabel(docType)}</h5>
                    <div className="imgs-load d-flex align-items-center">
                      {watch(docType) ? (
                        <button
                          type="button"
                          onClick={() => handleDocumentRemove(docType)}
                          className="upload-remove btn btn-sm btn-outline-danger"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      ) : (
                        <label className="change-photo" style={{ cursor: "pointer" }}>
                          Upload New
                          <input
                            type="file"
                            className="upload cursor-pointer"
                            style={{ display: "none" }}
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload(e, docType)}
                            disabled={loading}
                          />
                        </label>
                      )}
                    </div>
                    <p className="form-text">
                      Max size 4MB. Accepted formats: jpg, png, pdf.
                    </p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Submit Button */}
        <div className="setting-card">
          <div className="setting-form-btn">
            {/* Debug Button - Remove after testing */}
          
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="me-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => reset()}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Modal */}
      <DeleteModal
        show={isOpen.is}
        onHide={() => setIsOpen({ is: false, id: null })}
        onDelete={handleProfileRemove}
        loading={loading}
      />
    </div>
  );
};

export default Profile;