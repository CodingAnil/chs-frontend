import React, { useState, useEffect } from 'react';
import { callGetApi, callPutApi } from '../../_service';
import { toast } from 'react-toastify';

const Availability = () => {
  const [availability, setAvailability] = useState({
    isAvailable: true,
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    emergencyAvailable: true,
    serviceAreas: [],
    cityRate: 10,
    outOfCityRate: 20,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      console.log('Fetching availability data...');
      const response = await callGetApi('/ambulance/availability');
      console.log('Availability response:', response);
      
      if (response?.success) {
        setAvailability(prev => ({
          ...prev,
          ...response.data
        }));
      }
       else {
        console.error('Failed to fetch availability:', response);
        toast.error('Failed to load availability settings');
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability settings');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async () => {
    setSaving(true);
    try {
      console.log('Updating availability with data:', availability);
      const response = await callPutApi('/ambulance/availability', availability);
      console.log('Update response:', response);
      
      if (response?.success) {
        toast.success('Availability updated successfully');
      } else {
        console.error('Update failed:', response);
        toast.error(response?.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChange = (field, value) => {
    console.log(`Toggling ${field} to:`, value);
    setAvailability(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayToggle = (day) => {
    console.log(`Toggling day: ${day}`);
    setAvailability(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleWorkingHoursChange = (field, value) => {
    setAvailability(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value
      }
    }));
  };

  const addServiceArea = () => {
    const area = prompt('Enter service area (e.g., "Downtown", "Airport", "Hospital District"):');
    if (area && area.trim()) {
      setAvailability(prev => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, area.trim()]
      }));
    }
  };

  const removeServiceArea = (index) => {
    setAvailability(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="loading">Loading availability settings...</div>;
  }

  return (
    <div className="availability-container">
      {/* Debug Section - Remove this in production */}
      

      <div className="availability-header">
        <h2>Availability Settings</h2>
        <p>Manage your ambulance service availability and working hours</p>
      </div>

      <div className="availability-form">
        <div className="form-section">
          <h3>General Availability</h3>
          <div className="form-group">
            <label className="toggle-label" style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <input
                type="checkbox"
                checked={!!availability.isAvailable}
                onChange={(e) => {
                  console.log('isAvailable checkbox clicked:', e.target.checked);
                  handleToggleChange('isAvailable', e.target.checked);
                }}
              />
              <span className="toggle-slider1" style={{display:'inline-block!important'}}></span>
              Currently Available for Bookings
            </label>
          </div>

          <div className="form-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={!!availability.emergencyAvailable}
                onChange={(e) => {
                  console.log('emergencyAvailable checkbox clicked:', e.target.checked);
                  handleToggleChange('emergencyAvailable', e.target.checked);
                }}
              />
              <span className="toggle-slider1"></span>
              Available for Emergency Calls (24/7)
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Working Hours</h3>
          <div className="working-hours">
            <div className="form-group">
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                value={availability.workingHours.start}
                onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                id="endTime"
                value={availability.workingHours.end}
                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Available Days</h3>
          <div className="days-grid">
            {daysOfWeek.map(day => (
              <div key={day} className="day-item">
                <label className="day-label">
                  <input
                    type="checkbox"
                    checked={availability.availableDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  <span className="day-name">{day}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Service Areas</h3>
          <div className="service-areas">
            <div className="areas-list">
              {availability.serviceAreas.map((area, index) => (
                <div key={index} className="area-item">
                  <span>{area}</span>
                  <button 
                    type="button"
                    onClick={() => removeServiceArea(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button"
              onClick={addServiceArea}
              className="btn btn-outline"
            >
              + Add Service Area
            </button>
          </div>
        </div>
        <div className="form-section">
  <h3>Pricing (Rs / Km)</h3>
  <div className="form-group">
    <label htmlFor="cityRate">City Rate (Rs / km):</label>
    <input
      type="number"
      id="cityRate"
      value={availability.cityRate || 0}
      onChange={(e) => setAvailability(prev => ({ ...prev, cityRate: Number(e.target.value) }))}
      min={0}
      className="form-control"
    />
  </div>
  <div className="form-group">
    <label htmlFor="outOfCityRate">Out of City Rate (Rs / km):</label>
    <input
      type="number"
      id="outOfCityRate"
      value={availability.outOfCityRate || 0}
      onChange={(e) => setAvailability(prev => ({ ...prev, outOfCityRate: Number(e.target.value) }))}
      min={0}
      className="form-control"
    />
  </div>
</div>

        <div className="form-actions">
          <button 
            type="button"
            onClick={updateAvailability}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          
         
          
         
        </div>
      </div>

      <div className="availability-status">
        <h3>Current Status</h3>
        <div className="status-card">
          <div className="status-item">
            <span className="status-label">Service Status:</span>
            <span className={`status-value ${availability.isAvailable ? 'available' : 'unavailable'}`}>
              {availability.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Working Hours:</span>
            <span className="status-value">
              {availability.workingHours.start} - {availability.workingHours.end}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Emergency Service:</span>
            <span className={`status-value ${availability.emergencyAvailable ? 'available' : 'unavailable'}`}>
              {availability.emergencyAvailable ? 'Available 24/7' : 'Not Available'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Service Areas:</span>
            <span className="status-value">
              {availability.serviceAreas.length > 0 
                ? availability.serviceAreas.join(', ') 
                : 'No areas specified'}
            </span>
          </div>
 

        </div>
      </div>

      <style jsx>{`
        .availability-container {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .availability-header {
          margin-bottom: 30px;
        }

        .availability-header h2 {
          color: #333;
          margin: 0 0 10px 0;
          font-size: 28px;
        }

        .availability-header p {
          color: #666;
          margin: 0;
          font-size: 16px;
        }

        .availability-form {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .form-section {
          margin-bottom: 30px;
        }

        .form-section h3 {
          color: #333;
          margin: 0 0 20px 0;
          font-size: 20px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 10px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }

        .form-control {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 16px;
        }

        .toggle-label input[type="checkbox"] {
          display: none;
        }

        .toggle-slider1 {
          width: 50px;
          height: 24px;
          background: #ccc;
          border-radius: 12px;
          position: relative;
          margin-right: 15px;
          transition: background 0.3s ease;
          display: inline-block!important;
        }

        .toggle-slider1::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
        }

        .toggle-label input[type="checkbox"]:checked + .toggle-slider1 {
          background: #007bff;
        }

        .toggle-label input[type="checkbox"]:checked + .toggle-slider1::after {
          transform: translateX(26px);
        }

        .working-hours {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
        }

        .day-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
        }

        .day-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
        }

        .day-label input[type="checkbox"] {
          margin-right: 8px;
        }

        .day-name {
          font-weight: 500;
        }

        .service-areas {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .areas-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .area-item {
          display: flex;
          align-items: center;
          background: #e9ecef;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 14px;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #dc3545;
          font-size: 18px;
          cursor: pointer;
          margin-left: 8px;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-outline {
          background: white;
          color: #007bff;
          border: 1px solid #007bff;
        }

        .btn-outline:hover {
          background: #007bff;
          color: white;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .availability-status {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .availability-status h3 {
          color: #333;
          margin: 0 0 20px 0;
          font-size: 20px;
        }

        .status-card {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .status-label {
          font-weight: 500;
          color: #333;
        }

        .status-value {
          font-weight: 600;
        }

        .status-value.available {
          color: #28a745;
        }

        .status-value.unavailable {
          color: #dc3545;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .working-hours {
            grid-template-columns: 1fr;
          }
          
          .days-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .status-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default Availability; 