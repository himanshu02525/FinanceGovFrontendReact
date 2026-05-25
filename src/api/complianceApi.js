import axiosInstance from "./axiosInstance";

export const getAll = async () => {
  const res = await axiosInstance.get("/compliance");
  return res.data;
};

export const getById = async (id) => {
  if (!id) throw new Error("ID required");
  const res = await axiosInstance.get(`/compliance/${id}`);
  return res.data;
};

export const create = async (data) => {
  const res = await axiosInstance.post("/compliance", data);
  console.log(res); // Kept the log to match your audit pattern
  return res.data;
};

export const update = async (id, data) => {
  if (!id) throw new Error("ID required");
  // Using patch as per your original ComplianceService logic, 
  // but feel free to change to .put if your backend matches the audit style.
  const res = await axiosInstance.patch(`/compliance/${id}`, data);
  return res.data;
};

export const remove = async (id) => {
  if (!id) throw new Error("ID required");
  const res = await axiosInstance.delete(`/compliance/${id}`);
  return res.data;
};

export const getSummary = async () => {
  const res = await axiosInstance.get("/compliance/summary");
  return res.data;
};

export const findByEntityId = async (entityId) => {
  if (!entityId) throw new Error("Entity ID required");
  const res = await axiosInstance.get(`/compliance/entity/${entityId}`);
  return res.data;
};
const complianceApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  getSummary,
  findByEntityId
};
export default complianceApi;