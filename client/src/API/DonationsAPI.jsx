import axiosClient from "./axiosClient";

const DonationAPI = {
  //thêm một lần donation mới
  postNewDonation: (values) => {
    const url = `/donation/new-donation`;
    return axiosClient.post(url, {
      values,
    });
  },
  //phê duyệt donation hợp lệ (yêu cầu quyên admin)
  postAdminApproveDonationId: (donationId, header) => {
    const url = "/donation/approve";
    return axiosClient.post(url, donationId, {
      headers: {
        Authorization: header,
      },
    });
  },
  //Admin thêm một donation mới giúp người dùng
  postAdminCreateDonation: (values, header) => {
    const url = `/donation/admin-new-donation`;
    return axiosClient.post(
      url,
      {
        values,
      },
      {
        headers: {
          Authorization: header,
        },
      }
    );
  },
  //lấy dữ liệu toàn bộ donation
  getAllDonation: (page, header) => {
    const url = `/donation/all?page=${page.page}&pageSize=${page.pageSize}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
  //admin xem chi tiết người dùng va lấy thông tin donation theo userId
  getDonationOfUserId: (userId, header) => {
    const url = `/donation/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
  //người dùng xem tất cả donation mà họ đã quyên góp.
  getUserDoanetionOfUserId: (userId, header) => {
    const url = `/donation/user-donation/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
  //admin xem chi tiết donation theo donationId
  getAdminFindByIdDonation: (values, header) => {
    const url = `/donation/admin-donation/${values}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: header,
      },
    });
  },
  //admin cập nhật lại thông tin , giá trị của donation
  postAdminUpdateDonation: (values, header) => {
    const url = "/donation/admin-update";
    return axiosClient.post(
      url,
      {
        values,
      },
      {
        headers: {
          Authorization: header,
        },
      }
    );
  },
  //admin xóa donation khỏi cơ sở dữ liệu
  postAdminRemoveDonation: (values, header) => {
    const url = "/donation/admin-delete";
    return axiosClient.post(url, values, {
      headers: {
        Authorization: header,
      },
    });
  },
  //admin xóa nhiều donation khỏi cơ sở dữ liệu
  postAdminRemoveManyDonations: (values, header) => {
    const url = "/donation/admin-deletes";
    return axiosClient.post(url, values, {
      headers: {
        Authorization: header,
      },
    });
  },
  //get donation theo campaignId , sắp xếp theo số tiền quyên góp lớn nhất đến nhỏ nhất có phân trang
  getDonationsByCampaignIdSortedMoney: (values) => {
    const url = `/donation/view-donation-money/${values.campaignId}?page=${values.page}&pageSize=${values.pageSize}`;
    return axiosClient.get(url);
  },
  //get donation theo campaignId , sắp xếp theo số thời gian quyên góp mới nhất đến xa nhất có phân trang
  getDonationsByCampaignIdSortedDay: (values) => {
    const url = `/donation/view-donation-date/${values.campaignId}?page=${values.page}&pageSize=${values.pageSize}`;
    return axiosClient.get(url);
  },
};

export default DonationAPI;
