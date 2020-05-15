
/*
this function 
-scans the database
-process the latest value of the user activity printing latest db value
-encode it in json
*/
//main function
exports.handler = (event, context, callback) => {
    let responseBody = '';
    var AWS = require('aws-sdk');
    var dbClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "iot_topic"
    };
    //db scan
    dbClient.scan(params, function(err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            //db scan data
            responseBody = data.Items;
            
            //newest activity
            let newest = null;
            
            //compute newest activity
            for (let i = 0; i < responseBody.length; i++) {
                if(responseBody[i].payload.type == "edge") {
                    if(newest == null){
                        newest = responseBody[i]
                    }
                    else if(newest.datetime < responseBody[i].datetime){
                        newest = responseBody[i]
                }
                }
            }
            
            
            let new_response = []
            new_response.push(newest)
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
