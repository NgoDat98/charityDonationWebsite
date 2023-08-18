const User = require("../module/user");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendfridTransport = require("nodemailer-sendgrid-transport");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const { validationResult, body } = require("express-validator");
const user = require("../module/user");

//xử lý nv gửi email
const transporter = nodemailer.createTransport(
  sendfridTransport({
    auth: {
      api_key: process.env.SENDGIRD_API_KEY,
    },
  })
);

// hàm xử lý công việc tạo tài khoản
exports.postCreatedUser = (req, res, next) => {
  const TenDangNhap = req.body.values.TenDangNhap;
  const HoVaTen = req.body.values.HoVaTen;
  const Email = req.body.values.Email;
  const MatKhau = req.body.values.MatKhau;
  const VaiTro = req.body.values?.VaiTro
    ? req.body.values?.VaiTro
    : "người dùng";
  const TrangThai = req.body.values?.TrangThai
    ? req.body.values?.TrangThai
    : "hoạt động";
  const SoDienThoai = req.body.values?.SoDienThoai
    ? req.body.values?.SoDienThoai
    : "";

  User.findOne({ Email: Email, TenDangNhap: TenDangNhap })
    .then((userDoc) => {
      if (userDoc) {
        return res
          .status(err.status || 500)
          .json({ errors: [{ msg: "thông tin tài khoản đã tồn tại" }] });
      }
      return bcryptjs.hash(MatKhau, 12).then((hashedPassword) => {
        const user = new User({
          TenDangNhap: TenDangNhap,
          HoVaTen: HoVaTen,
          Email: Email,
          MatKhau: hashedPassword,
          VaiTro: VaiTro,
          TrangThai: TrangThai,
          SoDienThoai: SoDienThoai,
        });

        user
          .save()
          .then((created) => {
            if (created) {
              res.status(200).json({ message: "Tạo tài khoản thành công!" });
            }
          })
          .catch((err) => {
            console.log(err);
            if (err) {
              res
                .status(err.status || 500)
                .json({ errors: [{ msg: err.message, error: err }] });
            }
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

// hàm xử lý việc lấy toàn bộ tên đăng nhập.
exports.getAllTenDangNhap = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json({
        message: "Tên tài Khoản đã được tạo",
        data: users.map((e) => ({
          TenDangNhap: e.TenDangNhap,
          Email: e.Email,
        })),
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

exports.postEmailAndSendEmail = (req, res, next) => {
  const email = req.body.values.Email;
  const name = req.body.values.HoVaTen;

  const maXacThuc = Math.round(Math.random() * 999999)
    .toString()
    .split(".")[0]
    .padStart(6, "0");

  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result.array());
      return res.status(400).json({ errors: result.array() });
    } else {
      req.session.maXacThuc = maXacThuc;
      const token = jwt.sign(
        {
          MaXacNhan: req.session.maXacThuc,
        },
        "MaXacThuc",
        { expiresIn: "5m" }
      );

      return transporter.sendMail(
        {
          to: email,
          from: "ngodat0410@gmail.com",
          subject: "Create Account!",
          html: `
              <div>
              <h1>Xin chào ${name}</h1>
              <h3>Dưới đây là mã xác thực của bạn:</h3>
              <h2>${maXacThuc}</h2>
              <p>Cảm ơn bạn đã tham gia và chung tay góp sức giúp những những người có hoàn cảnh khó khăn trên mọi miền của tổ quốc.</p>
              </div>`,
        },
        function (err, info) {
          if (err) {
            console.log(err, "send mail err");
            return res.status(204).json(err);
          }
          if (info) {
            info.token = token;
            console.log(info, "send mail");
            return res.status(200).json(info);
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    res
      .status(err.status || 500)
      .json({ errors: [{ msg: err.message, error: err }] });
  }
};

// Hàm xử lý lấy toàn bộ dữ liệu user có phân trang
exports.getAllUser = (req, res, next) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;

  User.find()
    .select("-MatKhau")
    .then((user) => {
      const curruntPage = parseInt(page);
      const start = (curruntPage - 1) * pageSize;
      const end = (curruntPage - 1) * pageSize + pageSize;
      const item = user.slice(start, end);
      if (user) {
        res.status(200).json({
          message: "Lấy dữ liệu người dùng thành công",
          data: item,
          total: user.length,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).json({ message: "Lấy dữ liệu người dùng thất bại" });
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

// Hàm xử lý admin lấy toàn bộ dữ liệu user  không phân trang
exports.adminGetAllUser = (req, res, next) => {
  User.find()
    .select("-MatKhau -TenDangNhap")
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "Lấy dữ liệu người dùng thành công",
          data: user,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).json({ message: "Lấy dữ liệu người dùng thất bại" });
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

exports.getFindUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      res.status(200).json({
        message: "lấy dữ liệu thành công",
        data: {
          _id: user._id,
          TenDangNhap: user.TenDangNhap,
          HoVaTen: user.HoVaTen,
          Email: user.Email,
          VaiTro: user.VaiTro,
          TrangThai: user.TrangThai ? user.TrangThai : "",
          SoDienThoai: user.SoDienThoai ? user.SoDienThoai : "",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

// Admin tạo account giúp user
exports.postAdminCreateUser = (req, res, next) => {
  const TenDangNhap = req.body.values.TenDangNhap;
  const HoVaTen = req.body.values.HoVaTen;
  const Email = req.body.values.Email;
  const VaiTro = req.body.values?.VaiTro
    ? req.body.values?.VaiTro
    : "người dùng";
  const TrangThai = req.body.values?.TrangThai
    ? req.body.values?.TrangThai
    : "hoạt động";
  const SoDienThoai = req.body.values?.SoDienThoai
    ? req.body.values?.SoDienThoai
    : "";

  function generateRandomString() {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 12; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  const test = generateRandomString();

  User.findOne({ Email: Email, TenDangNhap: TenDangNhap })
    .then((userDoc) => {
      if (userDoc) {
        return res
          .status(err.status || 500)
          .json({ errors: [{ msg: "thông tin tài khoản đã tồn tại" }] });
      }
      return bcryptjs.hash(test, 12).then((hashedPassword) => {
        const user = new User({
          TenDangNhap: TenDangNhap,
          HoVaTen: HoVaTen,
          Email: Email,
          MatKhau: hashedPassword,
          VaiTro: VaiTro,
          TrangThai: TrangThai,
          SoDienThoai: SoDienThoai,
        });

        return user
          .save()
          .then((created) => {
            // if (created) {
            //   res.status(200).json({ message: "Tạo tài khoản thành công!" });
            // }
            if (created) {
              return transporter.sendMail(
                {
                  to: user.Email,
                  from: "ngodat0410@gmail.com",
                  subject: "Create Account",
                  html: `
                        <div>
                        <h1>Xin chào ${HoVaTen}</h1>
                        <h4>Quản trị viên quỹ trái tim nhân ái đã giúp bạn tạo một tài khoản truy cập mới, nếu nhận được hộp thư này hãy sử dụng tài khoản và mật khẩu mới này để truy cập nhé!</h4>
                        <h3>Dưới đây là tài khoản và  mật khẩu của bạn:</h3>
                        <h2>Tên đăng nhập: ${TenDangNhap}</h2>
                        <h2>Mật khẩu:${test}</h2>
                        <p>Cảm ơn bạn đã tham gia và chung tay góp sức giúp những những người có hoàn cảnh khó khăn trên mọi miền của tổ quốc.</p>
                        </div>`,
                },
                function (err, info) {
                  if (err) {
                    console.log(err, "send mail err");
                    res
                      .status(err.status || 500)
                      .json({ errors: [{ msg: err.message, error: err }] });

                    user.Email = user.Email;
                    user.save();
                  }
                  if (info.message === "success") {
                    console.log(info, "send mail");
                    res.status(200).json({
                      message: "Thêm tài khoản mới thành công!",
                    });
                  }
                }
              );
            }
          })
          .catch((err) => {
            console.log(err);
            if (err) {
              res
                .status(err.status || 500)
                .json({ errors: [{ msg: err.message, error: err }] });
            }
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

exports.postAdminUpdateUser = (req, res, next) => {
  // console.log(req.body);
  // res.status(200).send("ngon");
  const userId = req.body.userId;
  const HoVaTen = req.body.HoVaTen;
  const Email = req.body.Email;
  const SoDienThoai = req.body.SoDienThoai;
  const VaiTro = req.body.VaiTro;
  const TrangThai = req.body.TrangThai;

  console.log(req.body);
  User.findById(userId)
    .then((user) => {
      if (user?.VaiTro !== "admin") {
        user.HoVaTen = HoVaTen;
        user.Email = Email;
        user.SoDienThoai = SoDienThoai ?? "";
        user.VaiTro = VaiTro;
        user.TrangThai = TrangThai;

        return user.save().then((result) => {
          if (result) {
            res.status(200).json({ message: "Cập nhật người dùng thành công" });
          }
        });
      } else if (
        (user?.VaiTro === "admin" && VaiTro !== "admin") ||
        TrangThai !== "hoạt động"
      ) {
        res.status(400).json({
          errors: [
            { msg: "không được thay đổi vai trò người dùng có quyên admin" },
          ],
        });
      } else {
        user.HoVaTen = HoVaTen;
        user.Email = Email;
        user.SoDienThoai = SoDienThoai ?? "";
        user.TrangThai = TrangThai;
        return user.save().then((result) => {
          if (result) {
            res.status(200).json({ message: "Cập nhật người dùng thành công" });
          }
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

//post giá trị userId , cần quyền admin để xóa dữ liệu người dùng!
exports.postAdminRemoveUser = (req, res, next) => {
  const userId = req.body.userId;
  User.findByIdAndRemove(userId)
    .then((user) => {
      if (user) {
        res
          .status(200)
          .json({ message: "đã xóa thông tin người dùng trên hệ thông" });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
      if (err) {
        User.findById(userId)
          .then((user) => {
            user.TrangThai = "không hoạt động";
            user.save();
          })
          .catch((err) => {
            console.log(err);
            res
              .status(err.status || 500)
              .json({ errors: [{ msg: err.message, error: err }] });
          });
      }
    });
};

//Post Admin reset Password userId
exports.postAdminResetPasswordUserid = (req, res, next) => {
  const userId = req.body.userId;
  function generateRandomString() {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 12; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  const test = generateRandomString();
  console.log(test);
  User.findById(userId)
    .then((user) => {
      if (user) {
        return bcryptjs.hash(test, 12).then((hashedPassword) => {
          user.MatKhau = hashedPassword;
          user
            .save()
            .then((created) => {
              if (created) {
                return transporter.sendMail(
                  {
                    to: user.Email,
                    from: "ngodat0410@gmail.com",
                    subject: "Reset Password!",
                    html: `
                          <div>
                          <h1>Xin chào ${user.HoVaTen}</h1>
                          <h4>Quản trị viên đã giúp bạn làm mới lại mật khẩu, nếu nhận được hộp thư này hãy sử dụng mật khẩu mới và truy cập và thay đổi mất khẩu mới</h4>
                          <h3>Dưới đây là mật khẩu mới của bạn:</h3>
                          <h2>${test}</h2>
                          <p>Cảm ơn bạn đã tham gia và chung tay góp sức giúp những những người có hoàn cảnh khó khăn trên mọi miền của tổ quốc.</p>
                          </div>`,
                  },
                  function (err, info) {
                    if (err) {
                      console.log(err, "send mail err");
                      res
                        .status(err.status || 500)
                        .json({ errors: [{ msg: err.message, error: err }] });

                      user.Email = user.Email;
                      user.save();
                    }
                    if (info.message === "success") {
                      // info.token = token;
                      console.log(info, "send mail");
                      res.status(200).json({
                        message: "đặt lại mật khẩu thành công!",
                      });
                    }
                  }
                );
              }
            })
            .catch((err) => {
              console.log(err);
              if (err) {
                res
                  .status(err.status || 500)
                  .json({ errors: [{ msg: err.message, error: err }] });
              }
            });
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

// User cập nhật thông tin yêu cầu phải là User chỉnh chủ của tài Khoản
exports.postUserUpdateUserId = (req, res, next) => {
  const userId = req.body.userId;
  const UpdateHoVaTen = req.body.HoVaTen;
  const UpdateSoDienThoai = req.body.SoDienThoai;
  const UpdateEmail = req.body.Email;
  console.log(UpdateSoDienThoai);

  const maXacThuc = Math.round(Math.random() * 999999)
    .toString()
    .split(".")[0]
    .padStart(6, "0");

  User.findById(userId)
    .then((user) => {
      if (!UpdateEmail) {
        user.HoVaTen = UpdateHoVaTen;
        user.SoDienThoai = UpdateSoDienThoai;
        return user.save().then((result) => {
          if (result) {
            res.status(200).json({ message: "cập nhật thông tin thành công!" });
          }
        });
      } else {
        return bcryptjs.hash(maXacThuc, 12).then((hashedPassword) => {
          const token = jwt.sign(
            {
              MaXacNhan: hashedPassword,
              Email: UpdateEmail,
              SoDienThoai: UpdateSoDienThoai,
              HoVaTen: UpdateHoVaTen,
            },
            "MaXacThucUpdateEmail",
            { expiresIn: "5m" }
          );

          return transporter.sendMail(
            {
              to: UpdateEmail,
              from: "ngodat0410@gmail.com",
              subject: "Cập nhật thông tin và thay đổi Email!",
              html: `
                <div>
                <h1>Xin chào ${user.HoVaTen}</h1>
                <h3>Dưới đây là mã xác thực thay đổi thông tin và thay đổi Email của bạn:</h3>
                <h2>${maXacThuc}</h2>
                <p>Cảm ơn bạn đã tham gia và chung tay góp sức giúp những những người có hoàn cảnh khó khăn trên mọi miền của tổ quốc.</p>
                </div>`,
            },
            function (err, info) {
              if (err) {
                console.log(err, "send mail err");
                res
                  .status(err.status || 500)
                  .json({ errors: [{ msg: err.message, error: err }] });
              }
              if (info) {
                info.token = token;
                console.log(info, "send mail");
                return res.status(200).json(info);
              }
            }
          );
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

//check User thay đổi Email
exports.checkUpdateEmail = (req, res, next) => {
  const userId = req.body.userId;
  const UpdateHoVaTen = req.body.HoVaTen;
  const UpdateSoDienThoai = req.body.SoDienThoai;
  const UpdateEmail = req.body.Email;
  User.findById(userId)
    .then((user) => {
      user.HoVaTen = UpdateHoVaTen;
      user.SoDienThoai = UpdateSoDienThoai;
      user.Email = UpdateEmail;
      return user.save().then((result) => {
        if (result) {
          res
            .status(200)
            .json({ message: "Cập nhật thông tìn và Email thành công!" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};

//người dùng tự thay đổi mật khẩu của userId
exports.postUpdatePassWordUserId = (req, res, next) => {
  const userId = req.body.userId;
  const MatKhauCu = req.body.MatKhauCu;
  const UpdatePassword = req.body.MatKhauMoi;
  User.findById(userId)
    .then((user) => {
      return bcryptjs.compare(MatKhauCu, user.MatKhau).then((tk) => {
        if (!tk) {
          return res.status(401).json({
            errors: [
              {
                msg: "Thông tin mật khẩu cũ không đúng vui lòng kiểm tra lại",
                path: "UpdatePassword",
              },
            ],
          });
        } else {
          return bcryptjs.hash(UpdatePassword, 12).then((hashedPassword) => {
            user.MatKhau = hashedPassword;

            return user
              .save()
              .then((updatePassword) => {
                if (updatePassword) {
                  res
                    .status(200)
                    .json({ message: "thay đổi mật khẩu thành công!" });
                }
              })
              .catch((err) => {
                console.log(err);
                if (err) {
                  res
                    .status(err.status || 500)
                    .json({ errors: [{ msg: err.message, error: err }] });
                }
              });
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
};

exports.postEmailSendMaXacThuc = (req, res, next) => {
  // const TenDangNhap = req.body.TenDangNhap;
  const Email = req.body.Email;

  const maXacThuc = Math.round(Math.random() * 999999)
    .toString()
    .split(".")[0]
    .padStart(6, "0");

  User.find({
    Email: Email,
    // , TenDangNhap: TenDangNhap
  })
    .then((user) => {
      if (user.length > 0) {
        return bcryptjs.hash(maXacThuc, 12).then((hashedPassword) => {
          const token = jwt.sign(
            {
              MaXacNhan: hashedPassword,
            },
            "MaXacThucQuenMatKhau",
            { expiresIn: "5m" }
          );
          return transporter.sendMail(
            {
              to: Email,
              from: "ngodat0410@gmail.com",
              subject: "Mã Xác thực quên mật khẩu!",
              html: `
                          <div>
                          <h1>Xin chào ${user[0]?.HoVaTen}</h1>
                          <h4>Bạn đang thực hiện xác thực quyên mật khẩu tài khoản website quỹ từ thiện trái tim nhân ái nếu đúng là bạn hãy nhập mã xác nhận bên dưới để nhận mật khẩu mới!</h4>
                          <h3>Dưới đây là mã xác thực của bạn:</h3>
                          <h2>${maXacThuc}</h2>
                          <p>Cảm ơn bạn đã tham gia và chung tay góp sức giúp những những người có hoàn cảnh khó khăn trên mọi miền của tổ quốc.</p>
                          </div>`,
            },
            function (err, info) {
              if (err) {
                console.log(err, "send mail err");
                res
                  .status(err.status || 500)
                  .json({ errors: [{ msg: err.message, error: err }] });
              }
              if (info) {
                info.token = token;
                info.userId = user[0]?._id;
                // console.log(info, "send mail");
                return res.status(200).json(info);
              }
            }
          );
        });
      } else {
        res.status(400).json({
          errors: [
            {
              msg: "Thông tin cung cấp không khớp với dữ liệu trên hệ thông, vui lòng kiểm tra lại!",
            },
          ],
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

exports.UserResetPassword = (req, res, next) => {
  const userId = req.body.userId;

  function generateRandomString() {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 12; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  const test = generateRandomString();

  User.findById(userId)
    .then((user) => {
      if (user) {
        return bcryptjs.hash(test, 12).then((hashedPassword) => {
          user.MatKhau = hashedPassword;
          user
            .save()
            .then((reset) => {
              if (reset) {
                return transporter.sendMail(
                  {
                    to: user.Email,
                    from: "ngodat0410@gmail.com",
                    subject: "Reset Password!",
                    html: `
                          <div>
                          <h1>Xin chào ${user.HoVaTen}</h1>
                          <h4>Quản trị viên đã giúp bạn làm mới lại mật khẩu, nếu nhận được hộp thư này hãy sử dụng mật khẩu mới và truy cập và thay đổi mất khẩu mới</h4>
                          <h3>Dưới đây là mật khẩu mới của bạn:</h3>
                          <h2>${test}</h2>
                          <p>Cảm ơn bạn đã tham gia và chung tay góp sức giúp những những người có hoàn cảnh khó khăn trên mọi miền của tổ quốc.</p>
                          </div>`,
                  },
                  function (err, info) {
                    if (err) {
                      console.log(err, "send mail err");
                      res
                        .status(err.status || 500)
                        .json({ errors: [{ msg: err.message, error: err }] });

                      user.Email = user.Email;
                      user.save();
                    }
                    if (info) {
                      console.log(info, "send mail");
                      res.status(200).json({
                        message:
                          "đặt lại mật khẩu thành công thành công! Vui lòng kiếm tra hòm thư của bạn",
                      });
                    }
                  }
                );
              }
            })
            .catch((err) => {
              console.log(err);
              if (err) {
                res
                  .status(err.status || 500)
                  .json({ errors: [{ msg: err.message, error: err }] });
              }
            });
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
