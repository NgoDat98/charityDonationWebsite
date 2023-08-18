import axiosClient from "./axiosClient";

const UploadAPI = {
  upload: () => {
    const url = "/upload";
    return axiosClient.post(url);
  },
};

export default UploadAPI;
