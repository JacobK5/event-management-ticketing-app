import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const makeRequest = async (method, endpoint, data = {}, params = {}) => {
  try {
    const response = await apiClient({
      method,
      url: `api/${endpoint}`,
      data,
      params,
    });
    return response;
  } catch (error) {
    console.error(
      `Error during ${method} request to ${endpoint}:`,
      error.response?.data || error.message
    );
    return error.response;
  }
};

export default makeRequest;
