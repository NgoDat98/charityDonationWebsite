const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  TenDangNhap: {
    type: String,
    required: true,
  },
  HoVaTen: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  MatKhau: {
    type: String,
    required: true,
  },
  SoDienThoai: {
    type: String,
  },
  VaiTro: {
    type: String,
    required: true,
  },
  TrangThai: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
