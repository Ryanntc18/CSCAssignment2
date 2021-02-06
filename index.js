const express = require('express');
const morgan = require('morgan');
const multer = require ('multer');
const AWS = require ('aws-sdk');
const uuid = require ('uuid').v4;
const mainRoutes = require('./routes/mainRoutes');
const { response } = require('express');

const app = express();

app.set('view engine', 'ejs');

// middleware (for logging)
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


const PORT = process.env.port || 5000;

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));
// AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3 ({
    accessKeyId: '',
    secretAccessKey: '',
  });

const storage = multer.memoryStorage ({
    destination: function (req, file, callback) {
      callback (null, '');
    },
  });

  const upload = multer ({storage}).single ('image');

// To run go to terminal and type in : npm run dev
app.get('/', (req, res) => {
    res.render('index', {title:'Home'});
});

app.get('/dashboard', (req, res) => {
    // loginStatus must be used here as there will be an error on the html if it does not exist
    res.render('dashboard', {title:'Dashboard', loginStatus: false});
});

app.get('/login', (req, res) => {
    var isValid = req.query.valid;
    res.render('login', {title:'Login', isValid});
});


// Post method to get login infomation
app.post('/login', (req, res) => {
    console.log(req.body.Username);
    console.log(req.body.Password);

    var urlLink = 'login'
    var valid = false;

    // check if name is admin
    if(req.body.Username == "admin"){
        urlLink = 'pay';
        valid = true;
    }

    res.redirect(urlLink+'/?valid=' + valid);
});

app.get('/dashboard-free', (req, res) => {
    res.redirect('./views/dashboard.ejs');
});



app.get('/upload', (req, res) =>{
    var msg = null;
    if (req.query.msg) msg = req.query.msg;
    res.render('upload', {
        title:'Upload Image',
        message: msg,
      url: null,
    });
});



app.post ('/upload', upload, (req, res) => {
    let myFile = req.file.originalname.split ('.');
    const fileType = myFile[myFile.length - 1];
    const params = {
        Bucket: "zwawsbucket",
        Key: `${uuid()}.${fileType}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data) =>{
        if (error){
            res.render ('upload.ejs', {
                title:'Upload Image',
                message: 'Error in uploading file to S3 Bucket',
                
              });
        } else {
            res.render ('upload.ejs', {
                title:'Upload Image',
                message: 'File Uploaded Successfully',
                
              });

    }
  });
});

// main routes
app.use(mainRoutes);

//Error 404 

app.use((req, res) => {
    res.status(404).render('404error', {title:'404 Error'});
});