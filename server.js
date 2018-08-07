const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().valueOf() + '_' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use('/images', express.static('images'));

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));


app.get('/', function(req, res) {
  res.send(`Hello World!`);
});

app.get('/images', function(req, res) {
  res.send()
});

app.post('/upload', upload.single('image'), function(req, res) {
  console.log(req);
  if (req.body) {
    // res.send(
    //   {
    //     message: 'uploaded'
    //   }
    // )
    let location = 'http://localhost:3000/images/' + req.file.filename;
    res.send({
      headers: req.headers,
      route: req.route,
      rawHeaders: req.rawHeaders,
      body: req.body,
      file: req.file,
      location: location
    })
  }
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
