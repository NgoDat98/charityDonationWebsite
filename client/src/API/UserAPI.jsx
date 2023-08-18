import axiosClient from "./axiosClient";

const UserAPI = {
  //admin lấy tất cả dữ liệu người dùng có phần trang
  getAllData: (values, header) => {
    const url = `/user/all?page=${values.page}&pageSize=${values.pageSize}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
  //admin lấy tất cả dữ liệu người dùng không phần trang
  AdminGetAllData: (header) => {
    const url = "/user/admin-get-all";
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
  //lấy tên đăng nhập (sử dụng để check tên đăng nhập đã sử dụng khi đăng ký)
  getAllTenDangNhap: () => {
    const url = "/user/exist";
    return axiosClient.get(url);
  },

  //gửi mã xác nhận đến địa chỉ Email khi đăng ký tài khoản mới
  postMaXacThucAndCreatedUser: (values, header) => {
    const url = "/user/created";
    return axiosClient.post(
      url,
      { values },
      {
        headers: {
          Authorization: header,
        },
      }
    );
  },
  //thêm thông tin tài khoản mới,kiểm tra thông tin phù hợp và tạo mã xác thực và gửi đến Email trong form thông tin
  postSendEmail: (values) => {
    const url = "/user/send-email";
    return axiosClient.post(url, { values });
  },
  //nhận dữ liệu đăng ký và sử lý thêm dữ liệu tài khoản mới vào DB
  postSignIn: (values) => {
    const url = "/signin";
    return axiosClient.post(url, { values });
  },
  //nhận dữ liệu đăng nhập và xử lý xác thực
  getLogin: (values) => {
    const url = "/login";
    return axiosClient.get(url, {
      headers: {
        Authorization: values,
      },
    });
  },
  // admin lấy dữ liệu một người dùng theo userId
  getUserId: (userId, header) => {
    const url = `/user/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
  // người dùng xem chi tiết thông tin tài khoản
  getUserViewUserId: (userId, header) => {
    const url = `/user/user-view/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
  //Admin thêm mới người dùng
  postAdminCreateUser: (values, header) => {
    const url = "/user/admin-create-user";
    return axiosClient.post(
      url,
      { values },
      {
        headers: {
          Authorization: header,
        },
      }
    );
  },
  //Admin cập nhật dữ liệu giúp người dùng
  postAdminUpdateUser: (values, header) => {
    const url = "/user/admin-update";
    return axiosClient.post(url, values, {
      headers: {
        Authorization: header,
      },
    });
  },
  //admin xóa dữ liệu userId khỏi DB
  postAdminDeleteUser: (userId, header) => {
    const url = "/user/admin-delete";
    return axiosClient.post(url, userId, {
      headers: {
        Authorization: header,
      },
    });
  },
  //admin đặt lại mật khẩu mới giúp người dùng
  postAdminResetPasswordUserId: (userId, header) => {
    const url = "/user/admin-resetpassword";
    return axiosClient.post(url, userId, {
      headers: {
        Authorization: header,
      },
    });
  },
  // người dùng tự cập nhật tài khoản
  postUserUpdateUserId: (values, header) => {
    const url = "/user/user-update";
    return axiosClient.post(url, values, {
      headers: {
        Authorization: header,
      },
    });
  },
  //xử lý mã xác nhận khi người dùng thay đổi Email
  postXacNhanEmail: (values, header) => {
    const url = "/user/check-email";
    return axiosClient.post(url, values, {
      headers: {
        Authorization: header,
      },
    });
  },
  //người dùng thay đổi mật khẩu
  postUserUpdatePassword: (values, header) => {
    const url = "/user/user-update-password";
    return axiosClient.post(url, values, {
      headers: {
        Authorization: header,
      },
    });
  },
  //người dùng quyên mật khẩu gửi thông tin xác thực
  postEmailSendMaXacThuc: (values) => {
    const url = "/user/send-maxacnhan";
    return axiosClient.post(url, values);
  },
  //nhập mã xác thực được hệ thông gửi tới hộp thư email và tiến hành reset mật Khẩu
  postUserResetPassword: (values, header) => {
    const url = "/user/user-resetpassword";
    return axiosClient.post(url, values, {
      headers: {
        Authorization: header,
      },
    });
  },
};

export default UserAPI;
