import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Table, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllTestAppointments, 
  addTestResults 
} from "../../redux/slices/pathologyApi";
import { Spinner } from "reactstrap";
import { toastMessage } from "../../config/toast";
import { uploadFile } from "../../helpers/upload"; // Add this import at top

const TestResults = ({ labDetails }) => {
  const dispatch = useDispatch();
  const { testAppointments, loading } = useSelector(state => ({
    testAppointments: state.PATHOLOGY.data.pathology.getAllTestAppointmentsResult,
    loading: state.PATHOLOGY.loading.pathology.getAllTestAppointmentsLoading || state.PATHOLOGY.loading.pathology.addTestResultsLoading
  }));
  
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [resultData, setResultData] = useState({
    results: '',
    notes: '',
    file: null,
    existingFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('inprogress'); // Add this state

  useEffect(() => {
    if (labDetails?.profile?._id) {
      dispatch(getAllTestAppointments({
        labId: labDetails.profile._id,
        // Get both Accepted and Completed appointments
        status: 'Accepted,Completed'
      }));
    }
  }, [dispatch, labDetails?.profile?._id]);

  const handleAddResults = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
    setResultData({
      results: appointment.prescriptionText || appointment.testResults || '',
      notes: appointment.comments || appointment.notes || '',
      file: null,
      existingFile: appointment.prescriptionFile || appointment.reportFile
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toastMessage("error", "Only PDF, JPEG, JPG, PNG files are allowed");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastMessage("error", "File size should not exceed 5MB");
        return;
      }
      
      setResultData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmitResults = async () => {
    if (!resultData.results.trim()) {
      toastMessage("error", "Please enter test results");
      return;
    }

    setUploading(true);
    try {
      let fileUrl = null;
      let fileKey = null;

      if (resultData.file) {
        const uploadResult = await uploadFile(resultData.file);
        if (!uploadResult.status) {
          throw new Error(uploadResult.message);
        }
        fileUrl = uploadResult.url;
        fileKey = uploadResult.key;
      }

      const testResultData = {
        appointmentId: selectedAppointment._id,
        prescriptionText: resultData.results,
        prescriptionFile: fileUrl || resultData.existingFile,
        prescriptionFileKey: fileKey,
        comments: resultData.notes,
        status: "Completed"
      };

      const resultAction = await dispatch(addTestResults(testResultData));

      if (addTestResults.fulfilled.match(resultAction)) {
        toastMessage("success", "Test results added successfully");
        setShowModal(false);
        setSelectedAppointment(null);
        setResultData({ results: '', notes: '', file: null, existingFile: null });
        
        // Refresh appointments
        await dispatch(getAllTestAppointments({
          labId: labDetails.profile._id,
          status: 'Accepted,Completed'
        }));
      }
    } catch (error) {
      console.error("Error adding test results:", error);
      toastMessage("error", error.message || "Failed to add test results");
    } finally {
      setUploading(false);
    }
  };

  // Add this function before getCollectionTypeBadge
  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    const statusConfig = {
      'pending': { variant: 'warning', text: 'Pending' },
      'created': { variant: 'info', text: 'Created' },
      'accepted': { variant: 'primary', text: 'Accepted' },
      'completed': { variant: 'success', text: 'Completed' },
      'cancelled': { variant: 'danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[normalizedStatus] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getCollectionTypeBadge = (type) => {
    const collectionType = type?.toLowerCase() || '';
    if (collectionType === 'home collection' || collectionType === 'home') {
      return <Badge bg="success"><i className="fa-solid fa-home me-1"></i>Home</Badge>;
    }
    return <Badge bg="primary"><i className="fa-solid fa-building me-1"></i>Lab</Badge>;
  };

  // Update getStatusInfo function to handle payment status properly
  const getStatusInfo = (appointment) => {
    const statusBadge = getStatusBadge(appointment.status);
    const paymentStatus = appointment.paymentStatus?.toLowerCase();
    const isPaid = paymentStatus === 'paid' || paymentStatus === 'completed';
    
    const paymentBadge = (
      <Badge bg={isPaid ? 'success' : 'warning'}>
        {isPaid ? 'Paid' : 'Payment Pending'}
      </Badge>
    );

    return (
      <div className="d-flex flex-column gap-1">
        {statusBadge}
        {paymentBadge}
      </div>
    );
  };

  // Add this helper function near the top with other utility functions
  const hasTestResults = (appointment) => {
    return !!(appointment.prescriptionText || appointment.testResults || appointment.prescriptionFile || appointment.reportFile);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const appointments = testAppointments || [];
  const acceptedAppointments = appointments.filter(app => app.status === 'Accepted');
  const completedAppointments = appointments.filter(app => app.status === 'Completed');

  return (
    <div>
      <div className="dashboard-header">
        <h3>Test Results Management</h3>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col lg="4" md="4">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-warning">{acceptedAppointments.length}</h4>
              <p className="mb-0">Tests In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="4" md="4">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">{completedAppointments.length}</h4>
              <p className="mb-0">Completed Tests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="4" md="4">
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-primary">{appointments.length}</h4>
              <p className="mb-0">Total Tests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tab Buttons */}
      <div className="mb-4">
        <div className="btn-group">
          <button
            className={`btn ${activeTab === 'inprogress' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('inprogress')}
          >
            In Progress ({acceptedAppointments.length})
          </button>
          <button
            className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedAppointments.length})
          </button>
        </div>
      </div>

      {/* Test Results Table */}
      <Card>
        <Card.Header>
          <h5>{activeTab === 'inprogress' ? 'In Progress Tests' : 'Completed Tests'}</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Patient Details</th>
                  <th>Test Info</th>
                  <th>Status</th>
                  <th>Results</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === 'inprogress' ? (
                  acceptedAppointments.length > 0 ? (
                    acceptedAppointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>
                          <div className="d-flex flex-column">
                            <strong>
                              {appointment.patientId?.firstName || appointment.name || 'Unknown Patient'} {appointment.patientId?.lastName || ''}
                            </strong>
                            <small className="text-muted">{appointment.patientId?.phoneNumber || 'N/A'}</small>
                            <small className="mt-1">
                              Amount: {appointment.amount ? `₹${appointment.amount}` : 'Pending'}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <div>
                              <Badge bg="light" text="dark">
                                {appointment.testName || 'General Test'}
                              </Badge>
                            </div>
                            <small className="mt-1">
                              {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'Date TBD'}
                              {appointment.time && `, ${appointment.time}`}
                            </small>
                            <small>{getCollectionTypeBadge(appointment.appointmentType)}</small>
                          </div>
                        </td>
                        <td>{getStatusInfo(appointment)}</td>
                        <td>
                          {hasTestResults(appointment) ? (
                            <div className="d-flex flex-column gap-2">
                              <Badge bg="success">Available</Badge>
                              {(appointment.prescriptionFile || appointment.reportFile) && (
                                <a 
                                  href={appointment.prescriptionFile || appointment.reportFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="fa-solid fa-download me-1"></i>
                                  Download
                                </a>
                              )}
                            </div>
                          ) : (
                            <Badge bg="warning">Pending</Badge>
                          )}
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleAddResults(appointment)}
                          >
                            {hasTestResults(appointment) ? 'Update' : 'Add'} Results
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <div className="py-4">
                          <i className="fa-solid fa-file-medical fa-3x text-muted mb-3"></i>
                          <p className="text-muted">No tests in progress</p>
                        </div>
                      </td>
                    </tr>
                  )
                ) : (
                  completedAppointments.length > 0 ? (
                    completedAppointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>
                          <div className="d-flex flex-column">
                            <strong>
                              {appointment.patientId?.firstName || appointment.name || 'Unknown Patient'} {appointment.patientId?.lastName || ''}
                            </strong>
                            <small className="text-muted">{appointment.patientId?.phoneNumber || 'N/A'}</small>
                            <small className="mt-1">
                              Amount: {appointment.amount ? `₹${appointment.amount}` : 'Pending'}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <div>
                              <Badge bg="light" text="dark">
                                {appointment.testName || 'General Test'}
                              </Badge>
                            </div>
                            <small className="mt-1">
                              {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'Date TBD'}
                              {appointment.time && `, ${appointment.time}`}
                            </small>
                            <small>{getCollectionTypeBadge(appointment.appointmentType)}</small>
                          </div>
                        </td>
                        <td>{getStatusInfo(appointment)}</td>
                        <td>
                          {hasTestResults(appointment) ? (
                            <div className="d-flex flex-column gap-2">
                              <Badge bg="success">Available</Badge>
                              {(appointment.prescriptionFile || appointment.reportFile) && (
                                <a 
                                  href={appointment.prescriptionFile || appointment.reportFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="fa-solid fa-download me-1"></i>
                                  Download
                                </a>
                              )}
                            </div>
                          ) : (
                            <Badge bg="warning">Pending</Badge>
                          )}
                        </td>
                        <td>
                          <div>
                            <button 
                              className="btn btn-sm btn-primary mb-2 w-100"
                              onClick={() => handleAddResults(appointment)}
                            >
                              {hasTestResults(appointment) ? 'Update' : 'Add'} Results
                            </button>
                            {appointment.reportFile && (
                              <a 
                                href={appointment.reportFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-secondary w-100"
                              >
                                <i className="fa-solid fa-download me-1"></i>
                                Download Report
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <div className="py-4">
                          <i className="fa-solid fa-file-medical fa-3x text-muted mb-3"></i>
                          <p className="text-muted">No completed tests found</p>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Results Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Update Test Results
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <div className="mb-3">
                <strong>Patient:</strong> {selectedAppointment.patientId?.firstName} {selectedAppointment.patientId?.lastName}
                <br />
                <strong>Phone:</strong> {selectedAppointment.patientId?.phoneNumber}
                <br />
                <strong>Test:</strong> {selectedAppointment.testName || 'General Test'}
                <br />
                <strong>Date:</strong> {selectedAppointment.date ? new Date(selectedAppointment.date).toLocaleDateString() : 'Date TBD'} {selectedAppointment.time || ''}
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Test Results <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={resultData.results}
                    onChange={(e) => setResultData(prev => ({ ...prev, results: e.target.value }))}
                    placeholder="Enter detailed test results..."
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={resultData.notes}
                    onChange={(e) => setResultData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or recommendations..."
                  />
                </Form.Group>
                
                {resultData.existingFile && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="success">Current Report Available</Badge>
                      <a 
                        href={resultData.existingFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Current Report
                      </a>
                    </div>
                    <small className="text-muted d-block mt-1">
                      Upload a new file to replace the current one
                    </small>
                  </div>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Upload Report File (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    Supported formats: PDF, JPEG, JPG, PNG. Max size: 5MB
                  </Form.Text>
                  {resultData.file && (
                    <div className="mt-2">
                      <Badge bg="info">Selected: {resultData.file.name}</Badge>
                    </div>
                  )}
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowModal(false)}
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmitResults}
            disabled={uploading}
          >
            {uploading && <Spinner size="sm" className="me-2" />}
            Update Results
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestResults;