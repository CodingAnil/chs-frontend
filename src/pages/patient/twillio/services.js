import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getTwilioToken = async (identity) => {
  try {
    const response = await axios.get(`${API_URL}/token`, {
      params: { identity },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Twilio token:", error);
    throw error;
  }
};