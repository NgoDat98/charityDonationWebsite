const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[0];
  let decodedToken;
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result.array());
      return res.status(400).json({ errors: result.array() });
    } else {
      decodedToken = jwt.verify(token, "MaXacThuc");
    }
  } catch (err) {
    console.log(err);
  }
  if (decodedToken.MaXacNhan !== req.body.values.XacNhanMa) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          value: req.body.values.XacNhanMa,
          msg: "Mã xác nhận không đúng!",
          path: "values.XacNhanMa",
          location: "body",
        },
      ],
    });
  }
  next();
};
