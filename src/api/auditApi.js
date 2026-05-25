import axiosInstance from "./axiosInstance";

export const getAll = async () => {
  const res = await axiosInstance.get("/audit");
  return res.data;
};

export const getById = async (id) => {
  if (!id) throw new Error("ID required");
  const res = await axiosInstance.get(`/audit/${id}`);
  return res.data;
};

export const create = async (data) => {
  
  const res = await axiosInstance.post("/audit", data);
  console.log(res);
  return res.data;
};

export const update = async (id, data) => {
  console.log("Updating audit with ID:", id, "Data:", data);
  if (!id) throw new Error("ID required");
  const res = await axiosInstance.patch(`/audit/${id}`, data);
  return res.data;
};

export const remove = async (id) => {
  const res = await axiosInstance.delete(`/audit/${id}`);
  return res.data;
};

export const getSummary = async () => {
  const res = await axiosInstance.get("/audit/summary");
  return res.data;
};

const auditApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  getSummary
};

export default auditApi;