const express = require('express');
const morgan = require('morgan');
const mainRoutes = require('./routes/mainRoutes')

const app = express();

app.set('view engine', 'ejs');

// middleware (for logging)
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


const PORT = process.env.port || 5001;

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));


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

//NoSQL Update
// let modify = function () {

    
//     var params = {
//         TableName: "",
//         Key: { "": "" },
//         UpdateExpression: "set updated_by = :byUser, is_deleted = :boolValue",
//         ExpressionAttributeValues: {
//             ":byUser": "updateUser",
//             ":boolValue": true
//         },
//         ReturnValues: "UPDATED_NEW"

//     };
//     docClient.update(params, function (err, data) {

//         if (err) {
//             console.log("users::update::error - " + JSON.stringify(err, null, 2));
//         } else {
//             console.log("users::update::success "+JSON.stringify(data) );
//         }
//     });
// }

// modify();

//NoSQL Delete
// let remove = function () {

//     var params = {
//         TableName: "users",
//         Key: {
//             "": ""
//         }
//     };
//     docClient.delete(params, function (err, data) {

//         if (err) {
//             console.log("users::delete::error - " + JSON.stringify(err, null, 2));
//         } else {
//             console.log("users::delete::success");
//         }
//     });
// }

// remove();

//RDS Connection
var mysql = require('mysql');
var config = require('./config.json');
var pool  = mysql.createPool({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname
  });

  //Execute Query
pool.getConnection(function(err, connection) {
    if (err) throw err;
  // Use the connection
  connection.query('select * from csc2.users where userid = 1', function (error, results, fields) {
    // And done with the connection.
    connection.release();
    // Handle error after the release.
    console.log(results[0].uname);
    //process.exit();
  });
});

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
    

    pool.getConnection(function(err, connection) {
        if (err) throw err;
      // Use the connection
      connection.query('select * from csc2.users where uname = "'+req.body.Username+'"', function (error, results, fields) {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        console.log("USER INPUT "+req.body.Username);
        console.log("DB VALUE "+results[0].uname);

        var InUname = req.body.Username;
        var DbUname = results[0].uname;
        
        if(results[0].uname == req.body.Username && results[0].pword == req.body.Password){
            urlLink = 'pay';
            valid = true;
        }

        console.log("VALID "+valid);

         res.redirect(urlLink+'/?valid=' + valid);
        //process.exit();
      });
    });
});

app.get('/dashboard-free', (req, res) => {
    res.redirect('./views/dashboard.ejs');
});

// main routes
app.use(mainRoutes);

//Error 404 

app.use((req, res) => {
    res.status(404).render('404error', {title:'404 Error'});
});

