import axiosInstance from "./axiosInstance";

/**
 * Fetches analytics data.
 * Endpoint: GET /reports/analytics
 */
export const getAnalytics = async () => {
  const response = await axiosInstance.get("/reports/analytics");
  return response.data;
};

/**
 * Fetches a specific report by its ID.
 * Endpoint: GET /reports/{id}
 */
export const fetchReportById = async (id) => {
  if (!id) throw new Error("Report ID is required");
  const response = await axiosInstance.get(`/reports/${id}`);
  return response.data;
};

/**
 * Fetches all available reports.
 * Endpoint: GET /reports
 */
export const fetchAll = async () => {
  const response = await axiosInstance.get("/reports");
  return response.data;
};


export const generateReport = async ({ scope, id = null, year = null, reportName = null }) => {
  if (!scope) throw new Error("Scope is required");

  const baseUrl = "/reports/generate-by-scope";

  const params = {
    scope,
    ...(id != null && { id }),
    ...(year != null && { year }),
    ...(reportName != null && reportName.trim() !== "" && { reportName }),
  };

  const response = await axiosInstance.post(baseUrl, null, { params });
  
  return response.data;
};

export const getSummaryReports = async () => {
  const response = await axiosInstance.get("/reports/summary");
  return response.data;
};

const reportApi = {
  getAnalytics,
  fetchReportById,
  fetchAll,
  generateReport,
  getSummaryReports
};

export default reportApi;