const User = require("../module/user");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.postSignin = (req, res, next) => {
  const TenDangNhap = req.body.values.TenDangNhap;
  const MatKhau = req.body.values.MatKhau;
  User.findOne({ $or: [{ TenDangNhap: TenDangNhap }, { Email: TenDangNhap }] })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          errors: [
            {
              msg: "Thông tin tài khoản mật khẩu không đúng!",
              path: "values.TenDangNhap",
            },
          ],
        });
      }
      return bcryptjs
        .compare(MatKhau, user.MatKhau)
        .then((tk) => {
          if (!tk) {
            return res.status(401).json({
              errors: [
                {
                  msg: "Thông tin tài khoản mật khẩu không đúng!",
                  path: "values.MatKhau",
                },
              ],
            });
          }
          const token = jwt.sign(
            {
              userId: user._id,
              TenDangNhap: user.TenDangNhap,
              HoVaTen: user.HoVaTen,
              VaiTro: user.VaiTro,
              Email: user.Email,
            },
            "DangNhapThanhCong",
            {
              expiresIn: "1d",
            }
          );
          return res
            .status(200)
            .json({ message: "Đăng nhập thành công", token: token });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  console.log(token, "1");
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result.array());
      return res.status(400).json({ errors: result.array() });
    } else {
      decodedToken = jwt.verify(token, "DangNhapThanhCong");
    }
  } catch (err) {
    console.log(err);
  }
  if (decodedToken) {
    return res.status(200).json({
      mesaage: "Đăng nhập thành công",
      data: {
        userId: decodedToken.userId,
        TenDangNhap: decodedToken.TenDangNhap,
        HoVaTen: decodedToken.HoVaTen,
        VaiTro: decodedToken.VaiTro,
        Email: decodedToken.Email,
      },
    });
  }
  if (token && !decodedToken) {
    return res
      .status(401)
      .json({ message: "Phiên đăng nhập của bạn đã hết hạn" });
  }
};
