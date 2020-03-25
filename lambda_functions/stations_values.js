/*
this function 
-scan the database
-process the latest values for our stations
-encode in json

*/
exports.handler = (event, context, callback) => {
    let responseBody = '';
    var AWS = require('aws-sdk');
    var today = new Date();
    var dbClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "iot_topic"
    };
    dbClient.scan(params, function(err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            responseBody = data.Items;
            
            //newest two values
            let newest_1 = null;
            let newest_2 = null;
            //compute newest two values for EnvSt1 and EnvSt2
            for (let i = 0; i < responseBody.length; i++) {
                if (responseBody[i].payload.deviceId == "EnvironmentalStation_1"){
                    if(newest_1 == null){
                        newest_1 = responseBody[i]
                    }
                    else if(newest_1.datetime < responseBody[i].datetime){
                        newest_1 = responseBody[i]
                    }
                }
                if (responseBody[i].payload.deviceId == "EnvironmentalStation_2"){
                    if(newest_2 == null){
                        newest_2 = responseBody[i]
                    }
                    else if(newest_2.datetime < responseBody[i].datetime){
                        newest_2 = responseBody[i]
                    }
                }
            }
            //insert in the body the two stations log
            let new_response = []
            new_response.push(newest_1)
            new_response.push(newest_2)
            var response = {
                "statusCode": 200,
                "headers": {
                    'Access-Control-Allow-Origin': "*"
                },
                "body": JSON.stringify(new_response),
                //"body": new_response,
                "isBase64Encoded": false
            };
            callback(null, response);
        }
    });
};
