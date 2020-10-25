const router = require("express").Router();
const User = require("../../models/User");
const ResHelper = require("../../helpers/ResHelper");
const AuthHelper = require("../../helpers/AuthHelper");

router.route("/").post((req, res) => {
  const password = req.body.password;
  const email = req.body.email ? req.body.email.toLowerCase() : undefined;

  if (!email || !AuthHelper.validEmail(email)) {
    return ResHelper.fail(res, "Please enter a valid email address");
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return ResHelper.fail(res, "No user found with that email");
      }

      if (user.isValidPassword(password)) {
        const token = AuthHelper.createToken(user);
        ResHelper.success(res, { message: "Login successful!", token });
      } else {
        ResHelper.fail(res, "Wrong password");
      }
    })
    .catch((err) => ResHelper.error(res, err));
});

module.exports = router;
