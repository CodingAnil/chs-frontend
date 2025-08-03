import { axiosInstance } from "./axiosInstance";
import { API_CONFIG } from "../config/api";

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(API_CONFIG.uploadEndpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data?.status) {
      throw new Error(response.data?.message || "Upload failed");
    }

    return {
      status: true,
      url: response.data.data.url,
      key: response.data.data.key
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      status: false,
      message: error.message || "File upload failed"
    };
  }
};
