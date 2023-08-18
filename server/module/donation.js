const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DonationSchema = new Schema({
  NguoiQuyenGop: {
    type: String,
  },
  TenCongKhai: {
    type: String,
    required: true,
  },
  SoDienThoai: {
    type: Number,
  },
  HinhThucQuyenGop: {
    type: String,
    required: true,
  },
  SoTienQuyenGop: {
    type: Number,
    required: true,
  },
  LoiNhan: {
    type: String,
  },
  ThoiGianQuyenGop: {
    type: String,
    required: true,
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Campaign",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  HinhAnhQuyenGop: {
    type: Array,
  },
  TrangThai: {
    type: Boolean,
    require: true,
  },
});

module.exports = mongoose.model("donation", DonationSchema);
