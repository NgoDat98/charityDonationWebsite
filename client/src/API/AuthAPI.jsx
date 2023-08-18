import axiosClient from "./axiosClient";

const AuthAPI = {
  // lấy dữ liệu xác thực thông tin đăng nhập
  getLogin: (header) => {
    const url = `/login`;
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
};

export default AuthAPI;
