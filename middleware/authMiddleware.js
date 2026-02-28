const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {

  const token = req.cookies.adminToken;

  if (!token) {
    return res.redirect("/admin/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.redirect("/admin/login");
  }

};

module.exports = protectAdmin;