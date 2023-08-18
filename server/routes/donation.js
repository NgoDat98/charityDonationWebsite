const express = require("express");
const Donation = require("../module/donation");
const { body } = require("express-validator");
const isAdmin = require("../midleware/quyen_admin");
const holderAcc = require("../midleware/quyen_chu_tai_khoan");

const donationController = require("../controller/Donations");

const router = express.Router();
//get all donation (yêu cầu quyền admin)
router.get("/all", donationController.getAlldonation);

//post new donation
router.post("/new-donation", donationController.postAddDonation);

//post phê duyệt donation  (quyên admin)
router.post(
  "/approve",
  body("donationId").custom(async (value) => {
    const isApprove = await Donation.findById(value);
    if (isApprove?.TrangThai) {
      throw new Error("Quyên góp này đã được phê duyệt!");
    }
  }),
  isAdmin,
  donationController.postAdminApproveDonationId
);

//get donation theo userId (quyên admin)
router.get("/:userId", isAdmin, donationController.getDonationOfUserId);

//get donation theo userId (quyên chủ tài khoản)
router.get(
  "/user-donation/:userId",
  holderAcc,
  donationController.getDonationOfUserId
);

//post Amdin tạo donation mới giúp người dùng
router.post(
  "/admin-new-donation",
  body("values.userId")
    .isLength({ min: 1 })
    .withMessage("Lỗi thông tin người quyên góp không hợp lệ!"),
  body("values.campaignId")
    .isLength({ min: 1 })
    .withMessage("Lỗi thông tin đợt quyên góp không hợp lệ!"),
  isAdmin,
  donationController.postAdminCreatedDontion
);
//admin get chi tiết Donation theo donationId
router.get(
  "/admin-donation/:donationId",
  isAdmin,
  donationController.getFindByIdDonation
);

//admin cập nhật giá trị donation từ phía fe gửi lên
router.post(
  "/admin-update",
  isAdmin,
  donationController.postAdminUpdateDonation
);
//admin xóa một donation theo donationId gửi lên
router.post("/admin-delete", isAdmin, donationController.postRemoveDonation);
//admin xóa nhiều donation theo donationId gửi lên
router.post(
  "/admin-deletes",
  isAdmin,
  donationController.postRemoveManyDonations
);
//get donation theo campaignId , sắp xếp theo số tiền quyên góp lớn nhất đến nhỏ nhất có phân trang
router.get(
  "/view-donation-money/:campaignId",
  donationController.getDonationsByCampaignIdSortedMoney
);
//get donation theo campaignId , sắp xếp theo số thời gian quyên góp mới nhất đến xa nhất có phân trang
router.get(
  "/view-donation-date/:campaignId",
  donationController.getDonationsByCampaignIdSortedDay
);
module.exports = router;
