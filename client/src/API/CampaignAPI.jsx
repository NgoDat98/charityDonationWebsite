import axiosClient from "./axiosClient";

const CampaignAPI = {
  postCreatedCampaign: async (values) => {
    const url = `/campaign/created`;
    return axiosClient.post(url, {
      values,
    });
  },

  getAllCampaign: async () => {
    const url = "/campaign/all-campaign";
    return axiosClient.get(url);
  },

  getAllCampaignPaging: async (values) => {
    const url = `/campaign/all-campaign-paging?page=${values.page}&pageSize=${values.pageSize}`;
    return axiosClient.get(url);
  },

  getUnfCampaign: (values) => {
    const url = `/campaign/unf-campaign?page=${values.page}&pageSize=${values.pageSize}`;
    return axiosClient.get(url);
  },

  getCmpCampaign: (values) => {
    const url = `/campaign/cmp-campaign?page=${values.page}&pageSize=${values.pageSize}`;
    return axiosClient.get(url);
  },

  getFindCampaign: async (id) => {
    const url = `/campaign/${id}`;
    return axiosClient.get(url);
  },

  postUpdateCampaign: async (values) => {
    const url = "/campaign/update";
    return axiosClient.post(url, { values });
  },

  postRemoveCampaign: (values) => {
    const url = "/campaign/delete";
    return axiosClient.post(url, values);
  },

  postRemoveManyCampaign: (values) => {
    const url = "/campaign/delete-many";
    return axiosClient.post(url, values);
  },

  postUnfCampaignType: (values) => {
    const url = `/campaign/campaigntype-unf`;
    return axiosClient.post(url, values);
  },

  postCmpCampaignType: (values) => {
    const url = `/campaign/campaigntype-cmp`;
    return axiosClient.post(url, values);
  },
};

export default CampaignAPI;
