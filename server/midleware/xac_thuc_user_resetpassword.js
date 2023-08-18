const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "MaXacThucQuenMatKhau");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: err.message,
          path: "XacNhanMa",
        },
      ],
    });
  }
  return bcryptjs
    .compare(req.body.XacNhanMa, decodedToken.MaXacNhan)
    .then((tk) => {
      if (!tk) {
        return res.status(401).json({
          errors: [
            {
              msg: "Mã xác nhận không đúng!",
              path: "XacNhanMa",
            },
          ],
        });
      } else {
        return next();
      }
    })
    .catch((err) => {
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });
};
