function ensureAuthenticated(req, res, next) {
    console.log(req.session)
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
}

module.exports = { ensureAuthenticated };
