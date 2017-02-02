
var multer = require('multer');

var ctrlUpload = {};

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // with pm2
    // cb(null, 'uploads/'); // with node
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});

var upload = multer({ //multer settings
  storage: storage,
  limits: {
    fieldSize: '2MB'
  }
}).single('file');

/** API path that will upload the files */

ctrlUpload.post = function(req, res) {
  upload(req, res, function(err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({error_code:0, file: req.file});
  });
};

module.exports = ctrlUpload;