export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  uploadEndpoint: '/upload',
  fileUploadLimit: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
};