const express = require('express');

const app = express();

// To run go to terminal and type in : npm run dev
app.get('/', (req, res) => {res.send('<h1>Hello World!</h1>')});

const PORT = process.env.port || 5000;

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));

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
        TableName: "csc2",
        Key: {
            "test": "example"

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