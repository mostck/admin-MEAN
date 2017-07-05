var express = require('express');
var router = express.Router();
var ctrlAuth = require('./controllers/authentication');
var ctrlUser = require('./controllers/user');
var ctrlUpload = require('./controllers/upload');

// lang section

router.get('/lang', function(req, res) {
  if(!req.query.lang) return res.status(500).send();

  try {
    var lang = require('./config/locales/' + req.query.lang);
    res.status(200).json(lang);
  } catch(err) {
    res.status(404);
  }
});

// uploud section

router.post('/upload', ctrlUpload.post);

// authentication section

router.get('/register', ctrlAuth.getRegister);
router.post('/register', ctrlAuth.postRegister);

router.get('/login', ctrlAuth.getLogin);
router.post('/login', ctrlAuth.postLogin);

router.get('/logout', ctrlAuth.getLogout);
router.get('/ping', ctrlAuth.getPing);

router.get('/reset/:token', ctrlAuth.getResetToken);
router.post('/forgot', ctrlAuth.postForgot);
router.post('/reset/:token', ctrlAuth.postResetToken);

// user section

router.get('/user', ctrlUser.get);
router.get('/users', ctrlUser.getAll);
router.post('/user', ctrlUser.post);
router.put('/user', ctrlUser.put);
router.delete('/user/:id', ctrlUser.delete);

module.exports = router;