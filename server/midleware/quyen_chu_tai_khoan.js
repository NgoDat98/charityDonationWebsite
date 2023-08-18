const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result.array());
      return res.status(400).json({ errors: result.array() });
    } else {
      if (token !== "null") {
        decodedToken = jwt.verify(token, "DangNhapThanhCong");
      } else
        return res.status(400).json({
          errors: [
            {
              msg: "Thông tin xác thực không hợp lệ!",
            },
          ],
        });
    }
  } catch (err) {
    console.log(err);
  }
  if (
    decodedToken.userId !==
    (req.body.userId ? req.body.userId : req.params.userId)
  ) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          value: "req.body.values.XacNhanMa",
          msg: "Không có quyền thực hiện tác vụ này!",
          path: "values.VaiTro",
          location: "body",
        },
      ],
    });
  }
  next();
  //   }
};
