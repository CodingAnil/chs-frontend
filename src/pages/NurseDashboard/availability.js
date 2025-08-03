import React, { useEffect, useState } from "react";
import { callGetApi, callPutApi } from "../../_service";
import { toastMessage } from "../../config/toast";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Availability = ({ UserDetails }) => {
  const userId = UserDetails?._id;

  const [availabilityData, setAvailabilityData] = useState({
    twentyFourHour: false,
    readyForTravel: false,
    price: 0,
    weeklySchedule: {}
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAvailability = async () => {
      try {
        const res = await callGetApi(`/nurse/${userId}/availability-details`);
        if (res.status) {
          setAvailabilityData({
            twentyFourHour: res.data?.twentyFourHour || false,
            readyForTravel: res.data?.readyForTravel || false,
            price: res.data?.price || 0,
            weeklySchedule: res.data?.weeklySchedule || {}
          });
        } else {
          toastMessage("error", res.message || "Failed to fetch availability");
        }
      } catch (err) {
        toastMessage("error", "Error loading availability");
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) getAvailability();
  }, [userId]);

  // ✅ THESE LINES GO RIGHT BEFORE THE RETURN BLOCK
  if (!userId) return <div>Loading user...</div>;
  if (loading) return <div>Loading availability...</div>;

  const handleChange = (field, value) => {
    setAvailabilityData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScheduleChange = (day, timeField, value) => {
    setAvailabilityData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule?.[day],
          [timeField]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      debugger;
      const res = await callPutApi(`/nurse/${userId}/availability-details`, availabilityData);
      if (res.status) {
        toastMessage("success", "Availability updated successfully!");
      } else {
        toastMessage("error", res.message || "Update failed");
      }
    } catch (err) {
      toastMessage("error", "Update request failed");
    }
  };

  return (
    <div className="card p-4">
      <h4 className="mb-3">Availability</h4>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Available for 24 Hour also</label>
          <select
            className="form-control"
            value={availabilityData.twentyFourHour ? "Yes" : "No"}
            onChange={(e) => handleChange("twentyFourHour", e.target.value === "Yes")}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Ready for Travel?</label>
          <select
            className="form-control"
            value={availabilityData.readyForTravel ? "Yes" : "No"}
            onChange={(e) => handleChange("readyForTravel", e.target.value === "Yes")}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Price <span className="text-danger">*</span></label>
          <input
            type="number"
            className="form-control"
            value={availabilityData.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />
        </div>
      </div>

      <h5 className="mt-4">Weekly Schedule</h5>
      <div className="table-responsive">
        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th>Day</th>
              <th>Morning</th>
              <th>Evening</th>
            </tr>
          </thead>
          <tbody>
            {weekdays.map((day) => (
              <tr key={day}>
                <td><strong>{day}</strong></td>
                <td>
                  <input
                    type="time"
                    className="form-control"
                    value={availabilityData.weeklySchedule?.[day]?.morning || ""}
                    onChange={(e) => handleScheduleChange(day, "morning", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    className="form-control"
                    value={availabilityData.weeklySchedule?.[day]?.evening || ""}
                    onChange={(e) => handleScheduleChange(day, "evening", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        Update
      </button>
    </div>
  );
};

export default Availability;
