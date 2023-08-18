const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  MaHoanCanh: {
    type: String,
    required: true,
  },
  TieuDe: {
    type: String,
    required: true,
  },
  DiaChi: {
    type: String,
    required: true,
  },
  DoiTuongQuyenGop: {
    type: String,
    required: true,
  },
  NgayBatDau: {
    type: String,
    required: true,
  },
  NgayKetThuc: {
    type: String,
    required: true,
  },
  SoTienHuyDong: {
    type: Number,
    required: true,
  },
  SoTienDaNhan: {
    type: Number,
  },
  MoTaHoanCanh: {
    type: Array,
    required: true,
  },
  HinhAnh: {
    type: Array,
    required: true,
  },
  LuotQuyenGop: {
    type: Number,
  },
  TrangThai: {
    type: String,
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
