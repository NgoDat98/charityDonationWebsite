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

// hàm sử lý việc tải nhiều ảnh lên trong một mục
const uploadArrFile = (arr) => {
  arr &&
    arr.forEach((x) => {
      const storageRef = ref(
        storage,
        `${x.response.multer.fieldname}/${x.response.name}`
      );
      const metadata = {
        contentType: x.response.multer.mimetype,
      };
      uploadBytes(
        storageRef,
        Buffer.from(x.response.multer.buffer.data),
        metadata
      )
        .then((snapshot) => {
          console.log("file uploaded" + " " + snapshot.metadata.fullPath);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err.message });
        });
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
// const mapLinkImage = (arr) => ({
//   url: `https://firebasestorage.googleapis.com/v0/b/quytraitimnhanai.appspot.com/o/${arr[0].response.multer.fieldname}%2F${arr[0].response.name}?alt=media`,
//   uid: arr[0].uid,
//   name: arr[0].response.name,
//   fieldname: arr[0].response.multer.fieldname,
// });

const mapLinkImage = (arr) =>
  arr &&
  arr.map((item, index) => ({
    url: `https://firebasestorage.googleapis.com/v0/b/quytraitimnhanai.appspot.com/o/${item.response.multer.fieldname}%2F${item.response.name}?alt=media`,
    uid: item.uid,
    name: item.response.name,
    fieldname: item.response.multer.fieldname,
  }));

//Hàm sử lý việc lấy dữ liệu các hoàn cảnh gửi về phía client
exports.getAllCampaign = (req, res, next) => {
  Campaign.find()
    .then((campaign) => {
      return res
        .status(200)
        .json({ message: "lấy dữ liệu thanh công", data: campaign });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//Hàm sử lý việc lấy dữ liệu các hoàn cảnh gửi về phía client có phân trang
exports.getAllCampaignPaging = (req, res, next) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;

  Campaign.find()
    .then((campaign) => {
      // const data = campaign.filter(
      //   (x) => new Date(x.NgayKetThuc) >= new Date()
      // );
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = campaign.slice(start, end);

      return res.status(200).json({
        message: "lấy dữ liệu thanh công",
        data: item,
        total: campaign.length,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//GET dữ liệu campaign hoàn thành, được phân trang theo page và pageSize gửi lên
exports.getCmpCampaignPaging = (req, res, next) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  Campaign.find({
    TrangThai: "Đã hoàn thành",
  })
    .then((campaign) => {
      // const unfCampaign = campaign.filter(
      //   (x) => x.TrangThai === "Đã hoàn thành"
      // );
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = campaign.slice(start, end);
      // const total_pages = Math.ceil(unfCampaign.length / pageSize);
      return res.status(200).json({
        message: "lấy dữ liệu thanh công",
        data: item,
        total: campaign.length,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//GET dữ liệu campaign đã hoàn thành, được phân trang theo page và pageSize gửi lên
exports.getUnfCampaignPaging = (req, res, next) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  Campaign.find({
    TrangThai: "Chưa hoàn thành",
  })
    .then((campaign) => {
      const unfCampaign = campaign.filter(
        (x) => new Date(x.NgayKetThuc) >= new Date()
      );
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = unfCampaign.slice(start, end);
      // const total_pages = Math.ceil(unfCampaign.length / pageSize);
      return res.status(200).json({
        message: "lấy dữ liệu thanh công",
        data: item,
        total: unfCampaign.length,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//hàm xử lý nhiệm vụ thêm dữ liệu hoàn cảnh vào db
exports.postCreatedCampaign = (req, res, next) => {
  let a;
  Campaign.find().then((value) => {
    const t = value.map((items) => items.MaHoanCanh.slice(-4));

    for (let i = 1; i <= 9999; i++) {
      if (!t.includes(i.toString().split(".")[0].padStart(4, "0"))) {
        a = `HC${String(new Date().getFullYear()).slice(-2)}${i
          .toString()
          .split(".")[0]
          .padStart(4, "0")}`;
        break;
      }
    }
    const MaHoanCanh = a;
    const TieuDe = req.body.values.TieuDe;
    const DiaChi = req.body.values.DiaChi;
    const DoiTuongQuyenGop = req.body.values.DoiTuongQuyenGop;
    const NgayBatDau = req.body.values.ThoiGianHoatDong[0];
    const NgayKetThuc = req.body.values.ThoiGianHoatDong[1];
    const SoTienHuyDong = req.body.values.SoTienHuyDong;
    const MoTaHoanCanh = req.body.values.MoTaHoanCanh;
    const HinhAnh = req.body.values.HinhAnh.fileList;

    const campaign = new Campaign({
      MaHoanCanh: MaHoanCanh,
      TieuDe: TieuDe,
      DiaChi: DiaChi,
      DoiTuongQuyenGop: DoiTuongQuyenGop,
      NgayBatDau: NgayBatDau,
      NgayKetThuc: NgayKetThuc,
      SoTienHuyDong: SoTienHuyDong,
      MoTaHoanCanh: MoTaHoanCanh,
      HinhAnh: mapLinkImage(HinhAnh),
      TrangThai: "Chưa hoàn thành",
      LuotQuyenGop: 0,
      SoTienDaNhan: 0,
    });
    uploadArrFile(HinhAnh);

    return campaign
      .save()
      .then((xuat) => {
        if (xuat) {
          res.status(200).json({
            data: "Tạo hoàn cảnh thành công!",
          });
        } else {
          console.log(err);
          res.status(500).json({ error: err.message });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  });
};

//lấy giá trị theo id từ yêu cầu gửi lên
exports.getFindCampaignId = (req, res, next) => {
  const campaignId = req.params.id;
  Campaign.findById(campaignId)
    .then((campaign) => {
      if (campaign) {
        return res.status(200).json(campaign);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//xử lý Update dữ liệu từ một campaign có id cụ thể
exports.postUpdateCampaign = (req, res, next) => {
  const campaignId = req.body.values.id;
  const updateTieuDe = req.body.values.TieuDe;
  const updateDiaChi = req.body.values.DiaChi;
  const updateDoiTuongQuyenGop = req.body.values.DoiTuongQuyenGop;
  const updateNgayBatDau = req.body.values.ThoiGianHoatDong[0];
  const updateNgayKetThuc = req.body.values.ThoiGianHoatDong[1];
  const updateSoTienHuyDong = req.body.values.SoTienHuyDong;
  const updateMoTaHoanCanh = req.body.values.MoTaHoanCanh;
  const updateHinhAnh = req.body.values.HinhAnh?.fileList;

  Campaign.findById(campaignId)
    .then((result) => {
      result.TieuDe = updateTieuDe;
      result.DiaChi = updateDiaChi;
      result.DoiTuongQuyenGop = updateDoiTuongQuyenGop;
      result.NgayBatDau = updateNgayBatDau;
      result.NgayKetThuc = updateNgayKetThuc;
      result.SoTienHuyDong = updateSoTienHuyDong;
      result.MoTaHoanCanh = updateMoTaHoanCanh;
      if (updateHinhAnh?.length > 0) {
        const newHinhAnh = [];
        const addNewAnh = [];
        const removeAnh = [];
        for (let k in updateHinhAnh) {
          const findHad = result.HinhAnh.find(
            (x) =>
              x.name === updateHinhAnh[k].name && x.url === updateHinhAnh[k].url
          );

          if (findHad) {
            newHinhAnh.push(findHad);
          } else {
            addNewAnh.push(updateHinhAnh[k]);
            newHinhAnh.push(mapLinkImage([updateHinhAnh[k]]));
          }
        }
        for (let k in result.HinhAnh) {
          const findImg = updateHinhAnh.find(
            (x) =>
              x.name === result.HinhAnh[k].name &&
              x.url === result.HinhAnh[k].url
          );
          if (!findImg) {
            removeAnh.push(result.HinhAnh[k]);
          }
        }
        newHinhAnh.length > 0 && (result.HinhAnh = newHinhAnh);
        addNewAnh.length > 0 && uploadArrFile(addNewAnh);
        removeAnh.length > 0 && DeleteArrFile(removeAnh);
      }
      return result.save();
    })
    .then((campaign) => {
      res.status(200).json({ message: "Cập nhật hoàn cảnh thành Công!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Cập nhật campaign thất bại!" });
    });
};

//xóa một campaign có id cụ thể
exports.postRemoveCampaign = (req, res, next) => {
  const campaignId = req.body.campaignId;
  Campaign.findByIdAndRemove(campaignId)
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Đã xóa campaign thành công!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Xóa campaign thất bại!" });
    });
};

//xóa nhiều campaign có trong req gửi lên từ phía client
exports.postRemoveManyCampaign = async (req, res, next) => {
  const arrCampaignId = req.body.arrCampaignId;
  Campaign.deleteMany({ _id: { $in: arrCampaignId } })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Đã xóa thành công!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Xóa thất bại" });
    });
};

//post Campaign theo DoiTuongQuyenGop chưa hoàn thành có phân trang
exports.postUnfCampaigntype = (req, res, next) => {
  const page = req.body.page;
  const pageSize = req.body.pageSize;
  const type = req.body.type;
  Campaign.find({ DoiTuongQuyenGop: type })
    .then((campaign) => {
      const unfCampaign = campaign.filter(
        (x) => x.TrangThai === "Chưa hoàn thành"
      );
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = unfCampaign.slice(start, end);
      return res.status(200).json({
        message: "lấy dữ liệu thanh công",
        data: item,
        total: unfCampaign.length,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//post Campaign theo DoiTuongQuyenGop đã hoàn thành có phân trang
exports.postCmpCampaigntype = (req, res, next) => {
  const page = req.body.page;
  const pageSize = req.body.pageSize;
  const type = req.body.type;
  Campaign.find({ DoiTuongQuyenGop: type })
    .then((campaign) => {
      const cmpCampaign = campaign.filter(
        (x) => x.TrangThai === "Đã hoàn thành"
      );
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = cmpCampaign.slice(start, end);
      return res.status(200).json({
        message: "lấy dữ liệu thanh công",
        data: item,
        total: cmpCampaign.length,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};
