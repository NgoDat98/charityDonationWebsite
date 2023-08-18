var express = require("express");
const User = require("../module/user");
const { body } = require("express-validator");
const isSignup = require("../midleware/xac_thuc_signup");
const isAdmin = require("../midleware/quyen_admin");
const holderAcc = require("../midleware/quyen_chu_tai_khoan");
const xacNhan = require("../midleware/xac_nhan_update_email");
const userXacNhanResetPassword = require("../midleware/xac_thuc_user_resetpassword");

const userController = require("../controller/User");

var router = express.Router();

// router tạo mới tài khoản
router.post(
  "/created",
  body("values.XacNhanMa")
    .isLength({ min: 6 })
    .withMessage("Mã xác nhận phải có 6 ký tự")
    .isLength({ max: 6 })
    .withMessage("Mã xác nhận tối đa là 6 ký tự")
    .custom(async (value) => {
      const existingUser = await User.find({ TenDangNhap: value });
      if (existingUser.length > 0) {
        throw new Error("tên đăng nhập đã có người sử dụng!");
      }
    }),
  body("values.TenDangNhap")
    .isLength({ min: 1 })
    .withMessage("Tên đăng nhập không được để trống!")
    .isLength({ max: 100 })
    .withMessage("Tên đăng nhập tối đa là 100 ký tự")
    .matches(/^[a-zA-Z0-9]+$/i)
    .withMessage(
      "Tên đăng nhập chỉ được phép sử dụng các chữ cái (a-z)(A-Z), số (0-9)"
    )
    .custom(async (value) => {
      const existingUser = await User.find({ TenDangNhap: value });
      if (existingUser.length > 0) {
        throw new Error("tên đăng nhập đã có người sử dụng!");
      }
    }),
  body("values.HoVaTen")
    .isLength({ min: 1 })
    .withMessage("Họ và tên không được để trống!")
    .isLength({ max: 150 })
    .withMessage("Họ và tên tối đa là 150 ký tự"),
  body("values.Email")
    .isLength({ min: 1 })
    .withMessage("Email không được để trống!")
    .isLength({ max: 50 })
    .withMessage("Email tối đa 50 ký tự ")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .matches(/^[a-zA-Z0-9@.]+$/i)
    .withMessage(
      "Email chỉ cho phép các chữ cái (a-z,A-Z) số (0-9) và dấu chấm (.)"
    )
    .matches(/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.(com|vn)$/g)
    .withMessage("Email không hợp lệ")
    .custom(async (value) => {
      const existingUser = await User.find({ Email: value });
      if (existingUser.length > 0) {
        throw new Error("Email đã có người sử dụng!");
      }
    }),
  body("values.SoDienThoai")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Số điện thoại tối đa 50 ký tự ")
    .matches(/^[0-9+]+$/i)
    .withMessage("Email chỉ cho phép các chữ số (0-9) và dấu cộng (+)"),
  body("values.MatKhau")
    .isLength({ min: 8 })
    .withMessage("Mât Khẩu ít nhất phải có 8 ký tự!")
    .isLength({ max: 50 })
    .withMessage("Tên đăng nhập tối đa là 50 ký tự"),
  isSignup,
  userController.postCreatedUser
);

// router lấy tài khoản và email đã được tồn tại trên hệ thông
router.get("/exist", userController.getAllTenDangNhap);

// router xử lý việc gửi email chứa mã xác nhận
router.post(
  "/send-email",
  body("values.TenDangNhap")
    .isLength({ min: 1 })
    .withMessage("Tên đăng nhập không được để trống!")
    .isLength({ max: 100 })
    .withMessage("Tên đăng nhập tối đa là 100 ký tự")
    .matches(/^[a-zA-Z0-9]+$/i)
    .withMessage(
      "Tên đăng nhập chỉ được phép sử dụng các chữ cái (a-z)(A-Z), số (0-9)"
    )
    .custom(async (value) => {
      const existingUser = await User.find({ TenDangNhap: value });
      if (existingUser.length > 0) {
        throw new Error("tên đăng nhập đã có người sử dụng!");
      }
    }),
  body("values.HoVaTen")
    .isLength({ min: 1 })
    .withMessage("Họ và tên không được để trống!")
    .isLength({ max: 150 })
    .withMessage("Họ và tên tối đa là 150 ký tự"),
  body("values.Email")
    .isLength({ min: 1 })
    .withMessage("Email không được để trống!")
    .isLength({ max: 50 })
    .withMessage("Email tối đa 50 ký tự ")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .matches(/^[a-zA-Z0-9@.]+$/i)
    .withMessage(
      "Email chỉ cho phép các chữ cái (a-z,A-Z) số (0-9) và dấu chấm (.)"
    )
    .matches(/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.(com|vn)$/g)
    .withMessage("Email không hợp lệ")
    .custom(async (value) => {
      const existingUser = await User.find({ Email: value });
      if (existingUser.length > 0) {
        throw new Error("Email đã có người sử dụng!");
      }
    }),
  body("values.SoDienThoai")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Số điện thoại tối đa 50 ký tự ")
    .matches(/^[0-9+]+$/i)
    .withMessage("Email chỉ cho phép các chữ số (0-9) và dấu cộng (+)"),
  body("values.MatKhau")
    .isLength({ min: 8 })
    .withMessage("Mât Khẩu ít nhất phải có 8 ký tự!")
    .isLength({ max: 50 })
    .withMessage("Tên đăng nhập tối đa là 50 ký tự"),
  userController.postEmailAndSendEmail
);

//Get toàn bộ tk người dùng có phân trang (có yêu cầu quyên admin)
router.get("/all", isAdmin, userController.getAllUser);

//Get toàn bộ tk người dùng không phân trang (có yêu cầu quyên admin)
router.get("/admin-get-all", isAdmin, userController.adminGetAllUser);

//Get chi tiết tk người dùng (có yêu cầu quyên admin)
router.get("/:userId", isAdmin, userController.getFindUser);

//Get chi tiết tài khoàn người dùng(yêu cầu quyên chủ tài khoản)
router.get("/user-view/:userId", holderAcc, userController.getFindUser);

//admin thêm mới tài khoản giúp người dùng!
router.post(
  "/admin-create-user",
  body("values.TenDangNhap")
    .isLength({ min: 1 })
    .withMessage("Tên đăng nhập không được để trống!")
    .isLength({ max: 100 })
    .withMessage("Tên đăng nhập tối đa là 100 ký tự")
    .matches(/^[a-zA-Z0-9]+$/i)
    .withMessage(
      "Tên đăng nhập chỉ được phép sử dụng các chữ cái (a-z)(A-Z), số (0-9)"
    )
    .custom(async (value) => {
      const existingUser = await User.find({ TenDangNhap: value });
      if (existingUser.length > 0) {
        throw new Error("tên đăng nhập đã có người sử dụng!");
      }
    }),
  body("values.HoVaTen")
    .isLength({ min: 1 })
    .withMessage("Họ và tên không được để trống!")
    .isLength({ max: 150 })
    .withMessage("Họ và tên tối đa là 150 ký tự"),
  body("values.Email")
    .isLength({ min: 1 })
    .withMessage("Email không được để trống!")
    .isLength({ max: 50 })
    .withMessage("Email tối đa 50 ký tự ")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .matches(/^[a-zA-Z0-9@.]+$/i)
    .withMessage(
      "Email chỉ cho phép các chữ cái (a-z,A-Z) số (0-9) và dấu chấm (.)"
    )
    .matches(/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.(com|vn)$/g)
    .withMessage("Email không hợp lệ")
    .custom(async (value) => {
      const existingUser = await User.find({ Email: value });
      if (existingUser.length > 0) {
        throw new Error("Email đã có người sử dụng!");
      }
    }),
  body("values.SoDienThoai")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Số điện thoại tối đa 50 ký tự ")
    .matches(/^[0-9+]+$/i)
    .withMessage("Email chỉ cho phép các chữ số (0-9) và dấu cộng (+)"),
  isAdmin,
  userController.postAdminCreateUser
);

//admin cập nhật thông tin dữ liệu của người dùng có userId
router.post(
  "/admin-update",
  body("userId").custom(async (value) => {
    const existingUser = await User.find({ _id: value });
    if (existingUser.length === 0) {
      throw new Error("dữ liệu người dùng không tồn tại");
    }
  }),
  body("TenDangNhap")
    .isLength({ min: 1 })
    .withMessage("Tên đăng nhập không được để trống!")
    .isLength({ max: 100 })
    .withMessage("Tên đăng nhập tối đa là 100 ký tự")
    .matches(/^[a-zA-Z0-9]+$/i)
    .withMessage(
      "Tên đăng nhập chỉ được phép sử dụng các chữ cái (a-z)(A-Z), số (0-9)"
    )
    .custom(async (value) => {
      const existingUser = await User.find({ TenDangNhap: value });
      if (existingUser.lenth === 0) {
        throw new Error("tên đăng nhập không khớp với dữ liệu hệ thống!");
      }
    }),
  body("HoVaTen")
    .isLength({ min: 1 })
    .withMessage("Họ và tên không được để trống!")
    .isLength({ max: 150 })
    .withMessage("Họ và tên tối đa là 150 ký tự"),
  body("Email")
    .isLength({ min: 1 })
    .withMessage("Email không được để trống!")
    .isLength({ max: 50 })
    .withMessage("Email tối đa 50 ký tự ")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .matches(/^[a-zA-Z0-9@.]+$/i)
    .withMessage(
      "Email chỉ cho phép các chữ cái (a-z,A-Z) số (0-9) và dấu chấm (.)"
    )
    .matches(/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.(com|vn)$/g)
    .withMessage("Email không hợp lệ"),
  isAdmin,
  userController.postAdminUpdateUser
);

//admin xóa thông tin người dùng có userId khỏi hệ thống
router.post(
  "/admin-delete",
  body("userId").custom(async (value) => {
    const existingUser = await User.find({ _id: value });
    if (existingUser.length > 0 && existingUser[0].VaiTro === "admin") {
      console.log(true);
      throw new Error("không thể xóa người dùng có quyền quản lý");
    }
    if (existingUser.length === 0) {
      throw new Error("dữ liệu người dùng không tồn tại trên hệ thông!");
    }
  }),
  isAdmin,
  userController.postAdminRemoveUser
);

//admin reset mật khẩu của người dùng có userId
router.post(
  "/admin-resetpassword",
  isAdmin,
  userController.postAdminResetPasswordUserid
);

//người dùng check email thay đổi
router.post("/check-email", xacNhan, userController.checkUpdateEmail);

//người dùng tự cập nhật thông tin dữ liệu có userId
router.post(
  "/user-update",
  body("HoVaTen")
    .isLength({ min: 1 })
    .withMessage("Họ và tên không được để trống!")
    .isLength({ max: 150 })
    .withMessage("Họ và tên tối đa là 150 ký tự"),
  body("SoDienThoai")
    .isLength({ min: 5 })
    .withMessage("Số điện thoại phải có ít nhất 5 ký tự!")
    .matches(/^[0-9+]+$/i)
    .withMessage("Số điện thoại chỉ cho phép các chữ số (0-9) và dấu cộng (+)"),
  body("Email")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Email tối đa 50 ký tự ")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .matches(/^[a-zA-Z0-9@.]+$/i)
    .withMessage(
      "Email chỉ cho phép các chữ cái (a-z,A-Z) số (0-9) và dấu chấm (.)"
    )
    .matches(/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.(com|vn)$/g)
    .withMessage("Email không hợp lệ")
    .custom(async (value) => {
      const existingUser = await User.find({ Email: value });
      if (existingUser.length > 0) {
        throw new Error("Email đã có người sử dụng!");
      }
    }),
  holderAcc,
  userController.postUserUpdateUserId
);

//người dùng thay đổi mật khẩu
router.post(
  "/user-update-password",
  body("MatKhauMoi")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu tối thiểu 8 ký tự ")
    .isLength({ max: 50 })
    .withMessage("Mật khẩu tối đa 50 ký tự "),
  holderAcc,
  userController.postUpdatePassWordUserId
);

//nhận thông tìn email
////và tên đăng nhập từ người dùng quên mất khẩu gửi lên, tiến hành xác thực và và gửi mã
router.post("/send-maxacnhan", userController.postEmailSendMaXacThuc);
//xác nhận mã xác thực và thực hiện công việc reset password mới
router.post(
  "/user-resetpassword",
  userXacNhanResetPassword,
  userController.UserResetPassword
);

module.exports = router;
