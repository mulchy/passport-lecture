var router = require('express').Router();
var passport = require('passport');

router.get('/', function(req, res) {
  res.send(req.isAuthenticated());
});

router.post('/', passport.authenticate('local', {
  successRedirect: 'views/success.html',
  failureRedirect: 'views/failure.html'
}));

module.exports = router;
