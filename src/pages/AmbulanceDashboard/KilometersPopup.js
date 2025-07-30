import React, { useState } from 'react';
import { putDataAPI } from '../../helpers/axiosInstance';
import { toast } from 'react-toastify';

const KilometersPopup = ({ appointmentId, onClose, onSuccess }) => {
  const [km, setKm] = useState('');
  const [customFare, setCustomFare] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const kmNum = parseFloat(km);
    const fareNum = customFare === '' ? undefined : parseFloat(customFare);

    if (isNaN(kmNum) || kmNum <= 0) {
      toast.error('Please enter a valid number of kilometers');
      return;
    }

    if (fareNum !== undefined && (isNaN(fareNum) || fareNum < 0)) {
      toast.error('Please enter a valid custom fare or leave it blank');
      return;
    }

    setLoading(true);
    try {
      const res = await putDataAPI(`/ambulance/appointments/${appointmentId}/kilometers`, {
        kilometersDriven: kmNum,
        customFare: fareNum,
      });

      if (res.success) {
        toast.success('Kilometers and fare saved!');
        onSuccess(res.data);
        onClose();
      } else {
        toast.error(res.message || 'Failed to save kilometers and fare');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving kilometers and fare');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Enter kilometers driven</h3>
        <input
          type="number"
          min="0"
          value={km}
          onChange={(e) => setKm(e.target.value)}
          placeholder="Kilometers driven"
          className="form-control"
        />
        <input
          type="number"
          min="0"
          value={customFare}
          onChange={(e) => setCustomFare(e.target.value)}
          placeholder="Custom fare (optional)"
          className="form-control"
        />
        <div className="popup-actions">
          <button onClick={handleSave} disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 320px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        .form-control {
          width: 100%;
          padding: 8px 12px;
          margin: 12px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
          box-sizing: border-box;
        }
        .popup-actions {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          min-width: 90px;
          transition: background-color 0.3s ease;
          user-select: none;
        }
        .btn-primary {
          background: #007bff;
          color: white;
        }
        .btn-primary:disabled {
          background: #0056b3;
          opacity: 0.7;
          cursor: not-allowed;
        }
        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }
        .btn-outline {
          background: white;
          color: #007bff;
          border: 1px solid #007bff;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .btn-outline:hover {
          background: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default KilometersPopup;
