const express = require('express');

const app = express();

// To run go to terminal and type in : npm run dev
app.get('/', (req, res) => {res.send('<h1>Hello World!</h1>')});

const PORT = process.env.port || 5000;

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));


//NoSQL GET
var AWS = require('aws-sdk');
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "",
    "secretAccessKey": ""
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function()
{
    var params = {
        TableName: "",
        Key: {
            "": ""

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
var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "", 
    "secretAccessKey": ""
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let save = function () {

    var input = {
        "": "",
    };
    var params = {
        TableName: "",
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
var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "", 
    "secretAccessKey": ""
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let modify = function () {

    
    var params = {
        TableName: "",
        Key: { "": "" },
        UpdateExpression: "set updated_by = :byUser, is_deleted = :boolValue",
        ExpressionAttributeValues: {
            ":byUser": "updateUser",
            ":boolValue": true
        },
        ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

        if (err) {
            console.log("users::update::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::update::success "+JSON.stringify(data) );
        }
    });
}

modify();

//NoSQL Delete
var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "",
    "accessKeyId": "", 
    "secretAccessKey": ""
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let remove = function () {

    var params = {
        TableName: "users",
        Key: {
            "": ""
        }
    };
    docClient.delete(params, function (err, data) {

        if (err) {
            console.log("users::delete::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::delete::success");
        }
    });
}

remove();

//RDS Connection
var pool  = mysql.createPool({
    host     : '',
    user     : '',
    password : '',
    database : ''
  });
  pool.getConnection(function(err, connection) {
    // connected!
  });

  //Load config
var config = require('./config.json');
var pool  = mysql.createPool({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname
  });

  //Execute Query
  var mysql = require('mysql');
var config = require('./config.json');
var pool  = mysql.createPool({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname
  });
pool.getConnection(function(err, connection) {
  // Use the connection
  connection.query('SELECT  from  where ', function (error, results, fields) {
    // And done with the connection.
    connection.release();
    // Handle error after the release.
    if (error) throw error;
    else console.log(results[0].emp_name);
    process.exit();
  });
});

