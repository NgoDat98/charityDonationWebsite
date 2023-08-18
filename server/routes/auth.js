const express = require("express");

const authController = require("../controller/Auth");

const router = express.Router();

//post dữ liệu đăng nhập
router.post("/signin", authController.postSignin);

//get lấy value từ client và xử lý và trả về thông tin đăng Nhập
router.get("/login", authController.getLogin);

module.exports = router;
