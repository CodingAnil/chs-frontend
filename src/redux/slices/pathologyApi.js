import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axiosInstance";
import { toastMessage } from "../../config/toast";

// MARK: Get All Pathology Labs API
export const getAllPathologyLabs = createAsyncThunk("getAllPathologyLabs", async () => {
  try {
    const response = await axiosInstance.get("/pathology/all-labs");
    return response.data.data;
  } catch (error) {
    console.log("Get pathology labs Error:", error.response?.data ?? error?.message);
    throw error;
  }
});

// MARK: Get Pathology Lab Profile API
export const getPathologyLabProfile = createAsyncThunk("getPathologyLabProfile", async (labId) => {
  try {
    const response = await axiosInstance.get(`/pathology/${labId}`);
    return response.data.data;
  } catch (error) {
    console.log("Get pathology lab profile Error:", error.response?.data ?? error?.message);
    throw error;
  }
});

// MARK: Update Pathology Lab Profile API
export const updatePathologyLabProfile = createAsyncThunk(
  "updatePathologyLabProfile",
  async (data) => {
    try {
      const response = await axiosInstance.put(
        `/pathology/${data.userId}`,
        data
      );
      if (response.status === 200) {
        toastMessage("success", "Lab Profile Updated Successfully!");
      }
      return response.data.data;
    } catch (error) {
      console.log(
        "Update pathology lab profile Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Update Lab Availability API
export const updateLabAvailability = createAsyncThunk(
  "updateLabAvailability",
  async ({ userId, available }) => {
    try {
      const response = await axiosInstance.put(
        `/pathology/${userId}/availability`,
        { available }
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Update lab availability Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Get Pathology Dashboard Data API
export const getPathologyDashboardData = createAsyncThunk(
  "getPathologyDashboardData",
  async (labId) => {
    try {
      const response = await axiosInstance.get(`/pathology/dashboard/${labId}`);
      return response.data.data;
    } catch (error) {
      console.log(
        "Get pathology dashboard data Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Get All Test Appointments API
export const getAllTestAppointments = createAsyncThunk(
  "getAllTestAppointments",
  async ({ labId, ...queryParams }) => {
    try {
      const params = new URLSearchParams(queryParams).toString();
      const url = `/pathology/appointments/${labId}${params ? `?${params}` : ""}`;
      
      console.log("=== Redux API Call ===");
      console.log("Lab ID:", labId);
      console.log("Query params:", queryParams);
      console.log("URL params:", params);
      console.log("Full URL:", url);
      
      const response = await axiosInstance.get(url);
      
      console.log("API Response:", response.data);
      console.log("Appointments data:", response.data.data);
      
      return response.data.data;
    } catch (error) {
      console.log(
        "Get test appointments Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Get Appointment Counts API
export const getAppointmentCounts = createAsyncThunk(
  "getAppointmentCounts",
  async (labId) => {
    try {
      const response = await axiosInstance.get(
        `/pathology/appointment-count/${labId}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Get appointment counts Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Update Test Status API
export const updateTestStatus = createAsyncThunk(
  "updateTestStatus",
  async ({ appointmentId, status, comments }) => {
    try {
      const response = await axiosInstance.put(
        `/pathology/test-status/${appointmentId}`,
        { status, comments }
      );
      if (response.status === 200) {
        toastMessage("success", "Test Status Updated Successfully!");
      }
      return response.data.data;
    } catch (error) {
      console.log(
        "Update test status Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Add Test Results API
export const addTestResults = createAsyncThunk(
  "addTestResults",
  async (data) => {
    try {
      const response = await axiosInstance.put(
        `/pathology/test-results/${data.appointmentId}`,
        data
      );
      if (response.status === 200) {
        toastMessage("success", "Test Results Added Successfully!");
      }
      return response.data.data;
    } catch (error) {
      console.log(
        "Add test results Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

// MARK: Get Lab Statistics API
export const getLabStatistics = createAsyncThunk(
  "getLabStatistics",
  async (labId) => {
    try {
      const response = await axiosInstance.get(`/pathology/statistics/${labId}`);
      return response.data.data;
    } catch (error) {
      console.log(
        "Get lab statistics Error:",
        error.response?.data ?? error?.message
      );
      throw error;
    }
  }
);

const initialState = {
  data: {
    pathology: {
      getAllPathologyLabsResult: [],
      getPathologyLabProfileResult: null,
      updatePathologyLabProfileResult: null,
      updateLabAvailabilityResult: null,
      getPathologyDashboardDataResult: null,
      getAllTestAppointmentsResult: [],
      getAppointmentCountsResult: null,
      updateTestStatusResult: null,
      addTestResultsResult: null,
      getLabStatisticsResult: null,
    },
  },
  loading: {
    pathology: {
      getAllPathologyLabsLoading: false,
      getPathologyLabProfileLoading: false,
      updatePathologyLabProfileLoading: false,
      updateLabAvailabilityLoading: false,
      getPathologyDashboardDataLoading: false,
      getAllTestAppointmentsLoading: false,
      getAppointmentCountsLoading: false,
      updateTestStatusLoading: false,
      addTestResultsLoading: false,
      getLabStatisticsLoading: false,
    },
  },
  error: {
    pathology: {
      getAllPathologyLabsError: "",
      getPathologyLabProfileError: "",
      updatePathologyLabProfileError: "",
      updateLabAvailabilityError: "",
      getPathologyDashboardDataError: "",
      getAllTestAppointmentsError: "",
      getAppointmentCountsError: "",
      updateTestStatusError: "",
      addTestResultsError: "",
      getLabStatisticsError: "",
    },
  },
};

const pathologyApiSlice = createSlice({
  name: "pathologyApi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // MARK: Get All Pathology Labs
      .addCase(getAllPathologyLabs.pending, (state) => {
        state.loading.pathology.getAllPathologyLabsLoading = true;
        state.error.pathology.getAllPathologyLabsError = "";
      })
      .addCase(getAllPathologyLabs.fulfilled, (state, action) => {
        state.loading.pathology.getAllPathologyLabsLoading = false;
        state.data.pathology.getAllPathologyLabsResult = action.payload;
      })
      .addCase(getAllPathologyLabs.rejected, (state, action) => {
        state.loading.pathology.getAllPathologyLabsLoading = false;
        state.error.pathology.getAllPathologyLabsError =
          action.error.message || "Get pathology labs failed!";
      })
      // MARK: Get Pathology Lab Profile
      .addCase(getPathologyLabProfile.pending, (state) => {
        state.loading.pathology.getPathologyLabProfileLoading = true;
        state.error.pathology.getPathologyLabProfileError = "";
      })
      .addCase(getPathologyLabProfile.fulfilled, (state, action) => {
        state.loading.pathology.getPathologyLabProfileLoading = false;
        state.data.pathology.getPathologyLabProfileResult = action.payload;
      })
      .addCase(getPathologyLabProfile.rejected, (state, action) => {
        state.loading.pathology.getPathologyLabProfileLoading = false;
        state.error.pathology.getPathologyLabProfileError =
          action.error.message || "Get pathology lab profile failed!";
      })
      // MARK: Update Pathology Lab Profile
      .addCase(updatePathologyLabProfile.pending, (state) => {
        state.loading.pathology.updatePathologyLabProfileLoading = true;
        state.error.pathology.updatePathologyLabProfileError = "";
      })
      .addCase(updatePathologyLabProfile.fulfilled, (state, action) => {
        state.loading.pathology.updatePathologyLabProfileLoading = false;
        state.data.pathology.updatePathologyLabProfileResult = action.payload;
      })
      .addCase(updatePathologyLabProfile.rejected, (state, action) => {
        state.loading.pathology.updatePathologyLabProfileLoading = false;
        state.error.pathology.updatePathologyLabProfileError =
          action.error.message || "Update pathology lab profile failed!";
      })
      // MARK: Update Lab Availability
      .addCase(updateLabAvailability.pending, (state) => {
        state.loading.pathology.updateLabAvailabilityLoading = true;
        state.error.pathology.updateLabAvailabilityError = "";
      })
      .addCase(updateLabAvailability.fulfilled, (state, action) => {
        state.loading.pathology.updateLabAvailabilityLoading = false;
        state.data.pathology.updateLabAvailabilityResult = action.payload;
      })
      .addCase(updateLabAvailability.rejected, (state, action) => {
        state.loading.pathology.updateLabAvailabilityLoading = false;
        state.error.pathology.updateLabAvailabilityError =
          action.error.message || "Update lab availability failed!";
      })
      // MARK: Get Pathology Dashboard Data
      .addCase(getPathologyDashboardData.pending, (state) => {
        state.loading.pathology.getPathologyDashboardDataLoading = true;
        state.error.pathology.getPathologyDashboardDataError = "";
      })
      .addCase(getPathologyDashboardData.fulfilled, (state, action) => {
        state.loading.pathology.getPathologyDashboardDataLoading = false;
        state.data.pathology.getPathologyDashboardDataResult = action.payload;
      })
      .addCase(getPathologyDashboardData.rejected, (state, action) => {
        state.loading.pathology.getPathologyDashboardDataLoading = false;
        state.error.pathology.getPathologyDashboardDataError =
          action.error.message || "Get pathology dashboard data failed!";
      })
      // MARK: Get All Test Appointments
      .addCase(getAllTestAppointments.pending, (state) => {
        state.loading.pathology.getAllTestAppointmentsLoading = true;
        state.error.pathology.getAllTestAppointmentsError = "";
      })
      .addCase(getAllTestAppointments.fulfilled, (state, action) => {
        state.loading.pathology.getAllTestAppointmentsLoading = false;
        state.data.pathology.getAllTestAppointmentsResult = action.payload;
      })
      .addCase(getAllTestAppointments.rejected, (state, action) => {
        state.loading.pathology.getAllTestAppointmentsLoading = false;
        state.error.pathology.getAllTestAppointmentsError =
          action.error.message || "Get test appointments failed!";
      })
      // MARK: Get Appointment Counts
      .addCase(getAppointmentCounts.pending, (state) => {
        state.loading.pathology.getAppointmentCountsLoading = true;
        state.error.pathology.getAppointmentCountsError = "";
      })
      .addCase(getAppointmentCounts.fulfilled, (state, action) => {
        state.loading.pathology.getAppointmentCountsLoading = false;
        state.data.pathology.getAppointmentCountsResult = action.payload;
      })
      .addCase(getAppointmentCounts.rejected, (state, action) => {
        state.loading.pathology.getAppointmentCountsLoading = false;
        state.error.pathology.getAppointmentCountsError =
          action.error.message || "Get appointment counts failed!";
      })
      // MARK: Update Test Status
      .addCase(updateTestStatus.pending, (state) => {
        state.loading.pathology.updateTestStatusLoading = true;
        state.error.pathology.updateTestStatusError = "";
      })
      .addCase(updateTestStatus.fulfilled, (state, action) => {
        state.loading.pathology.updateTestStatusLoading = false;
        state.data.pathology.updateTestStatusResult = action.payload;
      })
      .addCase(updateTestStatus.rejected, (state, action) => {
        state.loading.pathology.updateTestStatusLoading = false;
        state.error.pathology.updateTestStatusError =
          action.error.message || "Update test status failed!";
      })
      // MARK: Add Test Results
      .addCase(addTestResults.pending, (state) => {
        state.loading.pathology.addTestResultsLoading = true;
        state.error.pathology.addTestResultsError = "";
      })
      .addCase(addTestResults.fulfilled, (state, action) => {
        state.loading.pathology.addTestResultsLoading = false;
        state.data.pathology.addTestResultsResult = action.payload;
      })
      .addCase(addTestResults.rejected, (state, action) => {
        state.loading.pathology.addTestResultsLoading = false;
        state.error.pathology.addTestResultsError =
          action.error.message || "Add test results failed!";
      })
      // MARK: Get Lab Statistics
      .addCase(getLabStatistics.pending, (state) => {
        state.loading.pathology.getLabStatisticsLoading = true;
        state.error.pathology.getLabStatisticsError = "";
      })
      .addCase(getLabStatistics.fulfilled, (state, action) => {
        state.loading.pathology.getLabStatisticsLoading = false;
        state.data.pathology.getLabStatisticsResult = action.payload;
      })
      .addCase(getLabStatistics.rejected, (state, action) => {
        state.loading.pathology.getLabStatisticsLoading = false;
        state.error.pathology.getLabStatisticsError =
          action.error.message || "Get lab statistics failed!";
      });
  },
});

export default pathologyApiSlice.reducer;