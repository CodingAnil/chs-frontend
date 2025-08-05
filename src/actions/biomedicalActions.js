import { ENDPOINTS } from '../constants';
import axios from 'axios';

export const getBiomedicalProfile = async (profileId) => {
  try {
    const response = await axios.get(`${ENDPOINTS.BASE_URL}/biomedical/profile/${profileId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getBiomedicalProfile:', error);
    throw error;
  }
};