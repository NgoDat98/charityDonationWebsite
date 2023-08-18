const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "MaXacThucUpdateEmail");
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
        req.body.Email = decodedToken.Email;
        req.body.SoDienThoai = decodedToken.SoDienThoai;
        req.body.HoVaTen = decodedToken.HoVaTen;
        return next();
      }
    })
    .catch((err) => {
      res
        .status(err.status || 500)
        .json({ errors: [{ msg: err.message, error: err }] });
    });

  //   if (decodedToken.MaXacNhan !== req.body.XacNhanMa) {
  //     return res.status(400).json({
  //       errors: [
  //         {
  //           type: "field",
  //           value: req.body.XacNhanMa,
  //           msg: "Mã xác nhận không đúng!",
  //           path: "XacNhanMa",
  //           location: "body",
  //         },
  //       ],
  //     });
  //   }
};
