const express = require('express');
const morgan = require('morgan');
const multer = require ('multer');
const AWS = require ('aws-sdk');
const uuid = require ('uuid').v4;
const mainRoutes = require('./routes/mainRoutes');
const { response } = require('express');
const Clarifai = require('clarifai');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const app = express();

app.set('view engine', 'ejs');

// middleware (for logging)
app.use(express.static('public/views'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('method: :method, Basepath: :url, HttpStatus: :status, ResponseLength: :res[content-length], Response Time: - :response-time ms, Date(Time): :date[iso], SourceIp: :remote-addr'));



const PORT = process.env.port || 5001;

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));
// AWS.config.update({region: 'us-east-1'});
//entire part only works if u plug in the access key id and secret access key
const s3 = new AWS.S3 ({
    accessKeyId: 'AKIA6JD57VRT3OR35A4R',
    secretAccessKey: '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',
  });

const storage = multer.memoryStorage ({
    destination: function (req, file, callback) {
      callback (null, '');
    },


//NoSQL GET
var AWS = require('aws-sdk');
let awsConfig = {
    "region": "ap-southeast-1",
    "endpoint": "http://dynamodb.ap-southeast-1.amazonaws.com",
    "accessKeyId": "AKIARGFD5TU67OJZRNXT",
    "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function()
{
    var params = {
        TableName: "test",
        Key: {
            "test": "test2"
        }
    };
    docClient.get(params, function (err, data){
        if(err){
            console.log("users::fetchOneByKey::error - "+JSON.stringify(err, null, 2));
        }
        else{
            console.log("users::fetchOneByKey::success - "+JSON.stringify(data, null, 2));
        }
    })
}

fetchOneByKey();

//NoSQL Post
let save = function () {

    var input = {
        "test": "test2",
        "name": "Ryan",
        "number": "888"
    };
    var params = {
        TableName: "test",
        Item:  input
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("users::save::success" );                      
        }
    });
}

save();

//RDS Connection
var mysql = require('mysql');
var config = require('./config.json');
var pool  = mysql.createPool({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname
  });
  pool.getConnection(function(err, connection) {
    // connected!
  });


  //Execute Query

// pool.getConnection(function(err, connection) {
//   // Use the connection
//   connection.query('SELECT  from  where ', function (error, results, fields) {
//     // And done with the connection.
//     connection.release();
//     // Handle error after the release.
//     if (error) throw error;
//     else console.log(results[0].emp_name);
//     process.exit();
//   });
// });

  const clarifai = new Clarifai.App({
    apiKey: '1ca463c84fc74b7fbdce2a4cea0d3ff3'
    });

  
// To run go to terminal and type in : npm run dev
app.get('/', (req, res) => {
    res.render('index', {title:'Home'});
});

app.get('/dashboard', (req, res) => {
    // loginStatus must be used here as there will be an error on the html if it does not exist
    res.render('dashboard', {title:'Dashboard', loginStatus: true});
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

app.get('/human', (req, res) =>{
    res.render('human', {
        title:'human recognition'
    })
})



app.post('/api/checkimg', jsonParser, (req, res) =>{
  
    var imagelink = req.body.link;
    console.log("image link: "+imagelink);
    var testImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHaZ-vu0hAXPpJH6LhJMoq1PFT3PaUiXGI8w&usqp=CAU'
    var msg = "This image NOT is a human.";
    clarifai.inputs.search({ input: { url: imagelink } }).then(
      
      function (response) {
       response.hits.forEach(hit => {
        if(hit.score > 0.8){
          msg = "This image is a human.";
          console.log("In 3rd func: "+ msgtext);
          //console.log(hit.input.data.image);
          
          return msg;
        }
      });
      console.log(msg);
      res.json(msg);
      },
      function (err) {
      console.log(err);
      }
      );
    
})



// clarifai.inputs.search({ concept: { name: 'human' } }).then(
//     function (response) {
//     response.hits.forEach(hit => {
//     console.log(hit.score);
//     console.log(hit.input.data.image);
//     });
//     },
//     function (err) {
//     console.log(err);
//     }
//     );
// main routes
app.use(mainRoutes);

//Error 404 

app.use((req, res) => {
    res.status(404).render('404error', {title:'404 Error'});
});

