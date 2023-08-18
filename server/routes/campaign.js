const express = require("express");
const isAdmin = require("../midleware/quyen_admin");

const campaignController = require("../controller/Campaign");

const router = express.Router();

//lấy toàn bộ hoàn cảnh trong mongoDB
router.get("/all-campaign", campaignController.getAllCampaign);
//lấy toàn bộ hoàn cảnh trong mongoDB có phân trang
router.get("/all-campaign-paging", campaignController.getAllCampaignPaging);
//lấy toàn bộ campaign chưa hoàn thành đã được phân trang
router.get("/unf-campaign", campaignController.getUnfCampaignPaging);
//lấy toàn bộ campaign đã hoàn thành đã được phân trang
router.get("/cmp-campaign", campaignController.getCmpCampaignPaging);

//thêm hoàn cảnh vào mongoDB
router.post("/created", campaignController.postCreatedCampaign);

//lấy dữ liệu hoàn cảnh theo id truyền vào
router.get("/:id", campaignController.getFindCampaignId);

//update dữ liệu từ yêu cầu gửi lên theo hoản cảnh kèm id
router.post("/update", campaignController.postUpdateCampaign);

//remove campaign có id === id mà client  gửi lên
router.post("/delete", campaignController.postRemoveCampaign);

//remove nhiều campaign có id === id mà client  gửi lên
router.post("/delete-many", campaignController.postRemoveManyCampaign);

//get dữ liệu campaign theo DoiTuongQuyenGop chưa hoàn thành có phần trang
router.post("/campaigntype-unf", campaignController.postUnfCampaigntype);

//get dữ liệu campaign theo DoiTuongQuyenGop đã hoàn thành có phần trang
router.post("/campaigntype-cmp", campaignController.postCmpCampaigntype);
module.exports = router;
