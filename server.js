const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');
const upload = multer({dest: 'images/'});

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));


app.get('/', function(req, res) {
  res.send(`Hello World!`);
});

app.post('/upload', upload.single('productImage'), function(req, res) {
  console.log(req);
  if (req.body) {
    // res.send(
    //   {
    //     message: 'uploaded'
    //   }
    // )
    res.send({
      headers: req.headers,
      route: req.route,
      rawHeaders: req.rawHeaders,
      body: req.body,
      file: req.file
    })
  }
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
