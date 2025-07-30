import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Badge, Modal } from "react-bootstrap";
import { callPutApi } from "../../_service";
import { toast } from "react-toastify";

const Profile = ({ userData, profileData, refreshData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    licenseNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    experience: "",
    specializations: [],
    serviceAreas: [],
    workingHours: {
      start: "09:00",
      end: "18:00",
    },
    emergencyAvailable: true,
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [showServiceAreaModal, setShowServiceAreaModal] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newServiceArea, setNewServiceArea] = useState("");

  const vehicleTypes = [
    "Basic Ambulance",
    "Advanced Life Support (ALS)",
    "Basic Life Support (BLS)",
    "Critical Care Transport",
    "Neonatal Ambulance",
    "Bariatric Ambulance",
    "Air Ambulance",
  ];

  const commonSpecializations = [
    "Emergency Medical Response",
    "Critical Care Transport",
    "Cardiac Emergency",
    "Trauma Response",
    "Pediatric Emergency",
    "Neonatal Transport",
    "Inter-hospital Transfer",
    "Event Medical Coverage",
  ];

  useEffect(() => {
    if (profileData || userData?.profile) {
      // Use profileData if available, otherwise fall back to userData.profile
      const profile = profileData || userData.profile;
      
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        displayName: profile.displayName || "",
        email: profile.email || userData?.email || "",
        phoneNumber: profile.phoneNumber || userData?.phoneNumber || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
        licenseNumber: profile.licenseNumber || "",
        vehicleNumber: profile.vehicleNumber || "",
        vehicleType: profile.vehicleType || "",
        vehicleModel: profile.vehicleModel || "",
        emergencyContactName: profile.emergencyContactName || "",
        emergencyContactNumber: profile.emergencyContactNumber || "",
        experience: profile.experience || "",
        specializations: profile.specializations || [],
        serviceAreas: profile.serviceAreas || [],
        workingHours: profile.workingHours || {
          start: "09:00",
          end: "18:00",
        },
        emergencyAvailable: profile.emergencyAvailable ?? true,
        isAvailable: profile.isAvailable ?? true,
      });
    }
  }, [userData, profileData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }));
      setNewSpecialization("");
      setShowSpecializationModal(false);
    }
  };

  const handleRemoveSpecialization = (index) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }));
  };

  const handleAddServiceArea = () => {
    if (newServiceArea.trim() && !formData.serviceAreas.includes(newServiceArea.trim())) {
      setFormData((prev) => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, newServiceArea.trim()],
      }));
      setNewServiceArea("");
      setShowServiceAreaModal(false);
    }
  };

  const handleRemoveServiceArea = (index) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await callPutApi(`/ambulance/profile`, formData);
       debugger;
      if (response?.success) {
        toast.success("Profile updated successfully!");
        refreshData();
      } else {
        toast.error(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ambulance-profile">
      <Form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-user me-2"></i>
              Personal Information
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="How you want to be displayed to patients"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience (Years)</Form.Label>
                  <Form.Control
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Vehicle Information */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-ambulance me-2"></i>
              Vehicle Information
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Type *</Form.Label>
                  <Form.Select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Model</Form.Label>
                  <Form.Control
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Emergency Contact */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-phone-alt me-2"></i>
              Emergency Contact
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="emergencyContactNumber"
                    value={formData.emergencyContactNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Address Information */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-map-marker-alt me-2"></i>
              Address Information
            </h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Specializations */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-medal me-2"></i>
              Specializations
            </h5>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowSpecializationModal(true)}
            >
              <i className="fas fa-plus me-1"></i>
              Add
            </Button>
          </Card.Header>
          <Card.Body>
            {formData.specializations.length > 0 ? (
              <div className="tags-container">
                {formData.specializations.map((spec, index) => (
                  <Badge
                    key={index}
                    bg="primary"
                    className="tag-badge me-2 mb-2"
                  >
                    {spec}
                    <Button
                      variant="link"
                      size="sm"
                      className="tag-remove"
                      onClick={() => handleRemoveSpecialization(index)}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted">No specializations added yet.</p>
            )}
          </Card.Body>
        </Card>

        {/* Service Areas */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-map me-2"></i>
              Service Areas
            </h5>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowServiceAreaModal(true)}
            >
              <i className="fas fa-plus me-1"></i>
              Add
            </Button>
          </Card.Header>
          <Card.Body>
            {formData.serviceAreas.length > 0 ? (
              <div className="tags-container">
                {formData.serviceAreas.map((area, index) => (
                  <Badge
                    key={index}
                    bg="success"
                    className="tag-badge me-2 mb-2"
                  >
                    {area}
                    <Button
                      variant="link"
                      size="sm"
                      className="tag-remove"
                      onClick={() => handleRemoveServiceArea(index)}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted">No service areas added yet.</p>
            )}
          </Card.Body>
        </Card>

        {/* Working Hours & Availability */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-clock me-2"></i>
              Working Hours & Availability
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="workingHours.start"
                    value={formData.workingHours.start}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="workingHours.end"
                    value={formData.workingHours.end}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isAvailable"
                    label="Currently Available for Service"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="emergencyAvailable"
                    label="Available for Emergency Calls"
                    checked={formData.emergencyAvailable}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Submit Button */}
        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Updating...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Update Profile
              </>
            )}
          </Button>
        </div>
      </Form>

      {/* Specialization Modal */}
      <Modal
        show={showSpecializationModal}
        onHide={() => setShowSpecializationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Specialization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select from common specializations:</Form.Label>
            <Form.Select
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
            >
              <option value="">Choose a specialization</option>
              {commonSpecializations
                .filter((spec) => !formData.specializations.includes(spec))
                .map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Or enter custom specialization:</Form.Label>
            <Form.Control
              type="text"
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="Enter specialization"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSpecializationModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSpecialization}>
            Add Specialization
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Service Area Modal */}
      <Modal
        show={showServiceAreaModal}
        onHide={() => setShowServiceAreaModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Service Area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Service Area (City/District):</Form.Label>
            <Form.Control
              type="text"
              value={newServiceArea}
              onChange={(e) => setNewServiceArea(e.target.value)}
              placeholder="Enter service area (e.g., Downtown, Central District)"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowServiceAreaModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddServiceArea}>
            Add Service Area
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile; 