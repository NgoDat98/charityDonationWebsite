const Donation = require("../module/donation");
const Campaign = require("../module/campaign");

const firebase = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} = require("firebase/storage");
const campaign = require("../module/campaign");
const donation = require("../module/donation");
const firebaseConfig = {
  apiKey: "AIzaSyA-zO_-dBaCIW8e7c48_JzBtnytCRkHMyM",
  authDomain: "quytraitimnhanai.firebaseapp.com",
  projectId: "quytraitimnhanai",
  storageBucket: "quytraitimnhanai.appspot.com",
  messagingSenderId: "327376218670",
  appId: "1:327376218670:web:75b63977fce8a4f60d4dbf",
  measurementId: "G-K12N7W8VQ5",
};
firebase.initializeApp(firebaseConfig);

const storage = getStorage();

// hàm sử lý việc tải ảnh lên trong một mục
const uploadArrFile = (arr) => {
  const storageRef = ref(
    storage,
    `${arr[0].response.multer.fieldname}/${arr[0].response.name}`
  );
  const metadata = {
    contentType: arr[0].response.multer.mimetype,
  };
  uploadBytes(
    storageRef,
    Buffer.from(arr[0].response.multer.buffer.data),
    metadata
  )
    .then((snapshot) => {
      console.log("file uploaded" + " " + snapshot.metadata.fullPath);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

// Hàm xử lý việc xóa file không dùng đền trên firebase
const DeleteArrFile = (arr) => {
  const storageRef = ref(storage, `${arr[0].fieldname}/${arr[0].name}`);
  deleteObject(storageRef)
    .then((result) => {
      console.log("Xóa ảnh thành công!");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//hàm sử lý lọc tên ảnh để luu vào mongoDB
const mapLinkImage = (arr) => ({
  url: `https://firebasestorage.googleapis.com/v0/b/quytraitimnhanai.appspot.com/o/${arr[0].response.multer.fieldname}%2F${arr[0].response.name}?alt=media`,
  uid: arr[0].uid,
  name: arr[0].response.name,
  fieldname: arr[0].response.multer.fieldname,
});

//lấy ra toàn bộ donation (yêu cầu quyên Admin)
exports.getAlldonation = (req, res, next) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;

  Donation.find()
    .then((donation) => {
      const data = donation.sort(
        (a, b) => new Date(b.ThoiGianQuyenGop) - new Date(a.ThoiGianQuyenGop)
      );
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = data.slice(start, end);

      res.status(200).json({
        message: "lấy dữ liệu thành công!",
        data: item,
        total: donation.length,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//Nhận donation và thêm thông tin dư liệu một lần donation và thêm vào DB
exports.postAddDonation = (req, res, next) => {
  const campaignId = req.body.values.campaignId;
  const userId = req.body.values.userId;
  const NguoiQuyenGop = req.body.values.NguoiQuyenGop;
  const TenCongKhai = req.body.values.TenCongKhai;
  const SoDienThoai = req.body.values.SoDienThoai;
  const HinhThucQuyenGop = req.body.values.HinhThucQuyenGop;
  const SoTienQuyenGop = req.body.values.SoTienQuyenGop;
  const LoiNhan = req.body.values.LoiNhan;
  const ThoiGianQuyenGop = req.body.values.ThoiGianQuyenGop;

  const donation = new Donation({
    campaignId: campaignId,
    userId: userId,
    NguoiQuyenGop: NguoiQuyenGop,
    TenCongKhai: TenCongKhai,
    SoDienThoai: SoDienThoai,
    HinhThucQuyenGop: HinhThucQuyenGop,
    SoTienQuyenGop: SoTienQuyenGop,
    LoiNhan: LoiNhan,
    ThoiGianQuyenGop: ThoiGianQuyenGop,
    TrangThai: false,
  });

  donation
    .save()
    .then((options) => {
      if (options) {
        // Campaign.findById(options.campaignId)
        //   .then((campaign) => {
        //     if (campaign.SoTienDaNhan) {
        //       const tongTienDaNhan =
        //         campaign.SoTienDaNhan + options.SoTienQuyenGop;
        //       tongTienDaNhan >= campaign.SoTienHuyDong &&
        //         (campaign.TrangThai = "Đã hoàn thành");
        //       campaign.SoTienDaNhan = tongTienDaNhan;
        //     } else {
        //       campaign.SoTienDaNhan = options.SoTienQuyenGop;
        //     }
        //     if (campaign.LuotQuyenGop) {
        //       campaign.LuotQuyenGop += 1;
        //     } else {
        //       campaign.LuotQuyenGop = 1;
        //     }

        //     return campaign.save();
        //   })
        //   .then((rulest) => {
        //     res.status(200).json({ message: "Quyên góp thành công!" });
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     res
        //       .status(err.status || 500)
        //       .json({ errors: [{ msg: err.message, error: err }] });
        //   });
        res.status(200).json({
          message: "Tạo quyên góp thành công, vui lòng chờ admin phê duyệt",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//xử lý yêu cầu phê duyệt donation (yêu cầu quyên Admin)
exports.postAdminApproveDonationId = (req, res, next) => {
  const donationId = req.body.donationId;
  console.log(donationId);
  Donation.findById(donationId)
    .then((donation) => {
      Campaign.findById(donation.campaignId)
        .then((campaign) => {
          if (campaign.SoTienDaNhan) {
            const tongTienDaNhan =
              campaign.SoTienDaNhan + donation.SoTienQuyenGop;
            tongTienDaNhan >= campaign.SoTienHuyDong &&
              (campaign.TrangThai = "Đã hoàn thành");
            campaign.SoTienDaNhan = tongTienDaNhan;
          } else {
            donation.SoTienQuyenGop >= campaign.SoTienHuyDong &&
              (campaign.TrangThai = "Đã hoàn thành");
            campaign.SoTienDaNhan = donation.SoTienQuyenGop;
          }
          if (campaign.LuotQuyenGop) {
            campaign.LuotQuyenGop += 1;
          } else {
            campaign.LuotQuyenGop = 1;
          }
          return campaign.save().then((rulest) => {
            if (rulest) {
              donation.TrangThai = true;
              donation.save().then((ok) => {
                res.status(200).json({ message: "Phê duyệt thành công!" });
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(err.status || 500)
            .json({ errors: [{ msg: err.message, error: err }] });
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//lấy ra các donation theo userId
exports.getDonationOfUserId = (req, res, next) => {
  const userId = req.params.userId;
  Donation.find({ userId: userId })
    .populate("campaignId")
    .then((donation) => {
      if (donation.length > 0) {
        const data = donation.map((item) => {
          return {
            TenCongKhai: item.TenCongKhai,
            HinhThucQuyenGop: item.HinhThucQuyenGop,
            SoTienQuyenGop: item.SoTienQuyenGop,
            ThoiGianQuyenGop: item.ThoiGianQuyenGop,
            campaign: item.campaignId,
            TrangThaiQuyenGop: item.TrangThai,
          };
        });

        res.status(200).json({ message: "lấy dữ liệu thành công", data: data });
      } else {
        res
          .status(200)
          .json({ message: "Bạn chưa tham gia đợt quyên góp nào!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//Admin thêm donation vào datadb giúp người dùng
exports.postAdminCreatedDontion = (req, res, next) => {
  const campaignId = req.body.values.campaignId;
  const userId = req.body.values.userId;
  const NguoiQuyenGop = req.body.values.NguoiQuyenGop;
  const TenCongKhai = req.body.values.TenCongKhai;
  const SoDienThoai = req.body.values.SoDienThoai;
  const HinhThucQuyenGop = req.body.values.HinhThucQuyenGop;
  const SoTienQuyenGop = req.body.values.SoTienQuyenGop;
  const HinhAnhQuyenGop = req.body.values.HinhAnhQuyenGop?.fileList;
  const LoiNhan = req.body.values.LoiNhan;
  const ThoiGianQuyenGop = req.body.values.ThoiGianQuyenGop;

  const donation = new Donation({
    campaignId: campaignId,
    userId: userId,
    NguoiQuyenGop: NguoiQuyenGop,
    TenCongKhai: TenCongKhai,
    SoDienThoai: SoDienThoai,
    HinhThucQuyenGop: HinhThucQuyenGop,
    SoTienQuyenGop: SoTienQuyenGop,
    HinhAnhQuyenGop: HinhAnhQuyenGop ? mapLinkImage(HinhAnhQuyenGop) : [],
    LoiNhan: LoiNhan,
    ThoiGianQuyenGop: ThoiGianQuyenGop,
    TrangThai: true,
  });
  HinhAnhQuyenGop && uploadArrFile(HinhAnhQuyenGop);

  donation
    .save()
    .then((options) => {
      if (options) {
        Campaign.findById(options.campaignId)
          .then((campaign) => {
            if (campaign.SoTienDaNhan) {
              const tongTienDaNhan =
                campaign.SoTienDaNhan + options.SoTienQuyenGop;
              tongTienDaNhan >= campaign.SoTienHuyDong &&
                (campaign.TrangThai = "Đã hoàn thành");
              campaign.SoTienDaNhan = tongTienDaNhan;
            } else {
              campaign.SoTienDaNhan = options.SoTienQuyenGop;
            }
            if (campaign.LuotQuyenGop) {
              campaign.LuotQuyenGop += 1;
            } else {
              campaign.LuotQuyenGop = 1;
            }

            return campaign.save();
          })
          .then((rulest) => {
            res.status(200).json({ message: "Quyên góp thành công!" });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(err.status || 500)
              .json({ errors: [{ msg: err.message, error: err }] });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//admin cập nhật thông tin dữ liệu donation theo 1 donationId cụ thể
exports.postAdminUpdateDonation = (req, res, next) => {
  const donationId = req.body.values.donationId;
  const campaignId = req.body.values.campaignId;
  const userId = req.body.values.userId;
  const NguoiQuyenGop = req.body.values.NguoiQuyenGop;
  const TenCongKhai = req.body.values.TenCongKhai;
  const SoDienThoai = req.body.values.SoDienThoai;
  const HinhThucQuyenGop = req.body.values.HinhThucQuyenGop;
  const SoTienQuyenGop = req.body.values.SoTienQuyenGop;
  const HinhAnhQuyenGop = req.body.values.HinhAnhQuyenGop?.fileList;
  const LoiNhan = req.body.values.LoiNhan;

  Donation.findById(donationId)
    .then((donation) => {
      if (campaignId) {
        console.log("a");
        Campaign.findById(donation.campaignId)
          .then((campaign) => {
            const tongTienDaNhan =
              campaign.SoTienDaNhan - donation.SoTienQuyenGop;
            campaign.SoTienDaNhan = tongTienDaNhan;
            if (campaign.LuotQuyenGop) {
              campaign.LuotQuyenGop -= 1;
            }
            return campaign.save();
          })
          .then((result) => {
            Campaign.findById(campaignId)
              .then((test) => {
                if (test.SoTienDaNhan) {
                  const tongTienDaNhan = test.SoTienDaNhan + SoTienQuyenGop;
                  tongTienDaNhan >= test.SoTienHuyDong &&
                    (test.TrangThai = "Đã hoàn thành");
                  test.SoTienDaNhan = tongTienDaNhan;
                } else {
                  test.SoTienDaNhan = SoTienQuyenGop;
                }
                if (test.LuotQuyenGop) {
                  test.LuotQuyenGop += 1;
                } else {
                  test.LuotQuyenGop = 1;
                }
                donation.campaignId = campaignId;
                userId && (donation.userId = userId);
                NguoiQuyenGop && (donation.NguoiQuyenGop = NguoiQuyenGop);
                donation.TenCongKhai = TenCongKhai;
                donation.SoDienThoai = SoDienThoai;
                donation.HinhThucQuyenGop = HinhThucQuyenGop;
                if (HinhAnhQuyenGop && HinhAnhQuyenGop.length > 0) {
                  donation.HinhAnhQuyenGop.length > 0 &&
                    DeleteArrFile(donation.HinhAnhQuyenGop);
                  donation.HinhAnhQuyenGop = mapLinkImage(HinhAnhQuyenGop);
                  uploadArrFile(HinhAnhQuyenGop);
                }
                donation.SoTienQuyenGop = SoTienQuyenGop;
                donation.LoiNhan = LoiNhan;
                donation.save();
                return test.save();
              })
              .catch((err) => {
                console.log(err);
                res
                  .status(err.status || 500)
                  .json({ errors: [{ msg: err.message, error: err }] });
              });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(err.status || 500)
              .json({ errors: [{ msg: err.message, error: err }] });
          });
      } else {
        Campaign.findById(donation.campaignId)
          .then((result) => {
            if (
              parseInt(donation.SoTienQuyenGop) !== parseInt(SoTienQuyenGop)
            ) {
              console.log(donation.SoTienQuyenGop, "1");

              const tongTienDaNhan =
                result.SoTienDaNhan - donation.SoTienQuyenGop + SoTienQuyenGop;
              console.log(tongTienDaNhan, "2");
              tongTienDaNhan >= result.SoTienHuyDong &&
                (result.TrangThai = "Đã hoàn thành");
              tongTienDaNhan < result.SoTienHuyDong &&
                (result.TrangThai = "Chưa hoàn thành");
              result.SoTienDaNhan = tongTienDaNhan;
            }
            userId && (donation.userId = userId);
            NguoiQuyenGop && (donation.NguoiQuyenGop = NguoiQuyenGop);
            donation.TenCongKhai = TenCongKhai;
            donation.SoDienThoai = SoDienThoai;
            donation.HinhThucQuyenGop = HinhThucQuyenGop;
            if (HinhAnhQuyenGop && HinhAnhQuyenGop.length > 0) {
              donation.HinhAnhQuyenGop.length > 0 &&
                DeleteArrFile(donation.HinhAnhQuyenGop);
              donation.HinhAnhQuyenGop = mapLinkImage(HinhAnhQuyenGop);
              uploadArrFile(HinhAnhQuyenGop);
            }
            donation.SoTienQuyenGop = SoTienQuyenGop;
            donation.LoiNhan = LoiNhan;
            donation.save();
            return result.save();
          })
          .catch((err) => {
            console.log(err);
            res
              .status(err.status || 500)
              .json({ errors: [{ msg: err.message, error: err }] });
          });
      }
      // if (parseInt(donation.SoTienQuyenGop) !== parseInt(SoTienQuyenGop)) {
      //   donation.SoTienQuyenGop = SoTienQuyenGop;
      // }
      // campaignId && (donation.campaignId = campaignId);
      // userId && (donation.userId = userId);
      // NguoiQuyenGop && (donation.NguoiQuyenGop = NguoiQuyenGop);
      // donation.TenCongKhai = TenCongKhai;
      // donation.SoDienThoai = SoDienThoai;
      // donation.HinhThucQuyenGop = HinhThucQuyenGop;
      // if (HinhAnhQuyenGop && HinhAnhQuyenGop.length > 0) {
      //   donation.HinhAnhQuyenGop.length > 0 &&
      //     DeleteArrFile(donation.HinhAnhQuyenGop);
      //   donation.HinhAnhQuyenGop = mapLinkImage(HinhAnhQuyenGop);
      //   uploadArrFile(HinhAnhQuyenGop);
      // }
      // donation.LoiNhan = LoiNhan;
      // donation.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Cập nhật donation thành công!" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//admin lấy chi tiết donation
exports.getFindByIdDonation = (req, res, next) => {
  const donationId = req.params.donationId;

  Donation.findById(donationId)
    .populate("campaignId")
    .populate("userId", "Email HoVaTen SoDienThoai")
    .then((donation) => {
      res
        .status(200)
        .json({ message: "Lấy dữ liệu thành công!", data: donation });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//xóa một donation có id cụ thể
exports.postRemoveDonation = (req, res, next) => {
  const donationId = req.body.donationId;
  Donation.findByIdAndRemove(donationId)
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Đã xóa donation thành công!" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: "Xóa donation thất bại!", error: err }] });
    });
};

//xóa nhiều donation có trong req gửi lên từ phía client
exports.postRemoveManyDonations = (req, res, next) => {
  const arrDonationIds = req.body.arrDonationIds;
  Donation.deleteMany({ _id: { $in: arrDonationIds } })
    .then((result) => {
      res.status(200).json({ message: "Đã xóa thành công!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Xóa thất bại" });
    });
};

//get donation theo campaignId , sắp xếp theo số tiền quyên góp lớn nhất đến nhỏ nhất có phân trang
exports.getDonationsByCampaignIdSortedMoney = (req, res, next) => {
  const campaignId = req.params.campaignId;
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  Donation.find({ campaignId: campaignId, TrangThai: true })
    .then((donation) => {
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = donation
        .sort((a, b) => b.SoTienQuyenGop - a.SoTienQuyenGop)
        .slice(start, end);

      res.status(200).json({
        message: "lấy dữ liệu thành công!",
        data: item,
        total: donation.length,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: "Xóa donation thất bại!", error: err }] });
    });
};

//get donation theo campaignId , sắp xếp theo số thời gian quyên góp mới nhất đến xa nhất có phân trang
exports.getDonationsByCampaignIdSortedDay = (req, res, next) => {
  const campaignId = req.params.campaignId;
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  Donation.find({ campaignId: campaignId, TrangThai: true })
    .then((donation) => {
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = donation
        .sort(
          (a, b) => new Date(b.ThoiGianQuyenGop) - new Date(a.ThoiGianQuyenGop)
        )
        .slice(start, end);

      res.status(200).json({
        message: "lấy dữ liệu thành công!",
        data: item,
        total: donation.length,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: "Xóa donation thất bại!", error: err }] });
    });
};
