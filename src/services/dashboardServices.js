import localapi from "@/utils/local_api";

export const getDashboardMetrics = async () => {
  try {
    const response = await localapi.get("/dashboard/metrics");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
}

export const getDashboardBookings = async (queryParams) => {
  try {
    const response = await localapi.get("/dashboard/bookings", {
      params: queryParams
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard bookings:", error);
    throw error;
  }
}

export const getDashboardBookingStats = async () => {
  try {
    const response = await localapi.get("/dashboard/bookings/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard booking stats:", error);
    throw error;
  }
}

export const getDashboardProperties = async (queryParams) => {
  try {
    const response = await localapi.get("/dashboard/properties", {
      params: queryParams
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard properties:", error);
    throw error;
  }
}

export const getDashboardPropertyStats = async () => {
  try {
    const response = await localapi.get("/dashboard/properties/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard property stats:", error);
    throw error;
  }
}

