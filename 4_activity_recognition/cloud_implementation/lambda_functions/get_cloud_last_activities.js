/*
this function 
-scans the database
-process the latest value of the user activity evaluating the last 10 entries
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
            responseBody = data.Items;
            
            //list of data to be processed 
            let useful = [];
            
            //retrieve raw data
            for (let i = 0; i < responseBody.length; i++) {
                if(responseBody[i].payload.type == "raw"){
                    useful.push([responseBody[i].datetime,responseBody[i].payload.id,responseBody[i].payload.accx, responseBody[i].payload.accy, responseBody[i].payload.accz])
                }
            }
            
            //sort the list on datetime value
            useful = getSorted(useful)
            
            //take the last 10 values
            useful = useful.slice(0, 10);
            
            //accumulator of moving classificatttions
            let moving = 0;
            
            //list of values processed in order to evaluate if the user is moving
            let accelerometer_values = [];
            
            //compute absolute movement value and collect accelerometer values
            for (let i = 0; i < useful.length; i++) {
                //absolute value of the movement in all the axis
                let absolute_movement = Math.abs(useful[i].accx) + Math.abs(useful[i].accy) + Math.abs(useful[i].accz);
                
                //2 is an empirical value, walking the sensor has a value of 3
                if (absolute_movement > 2){
                    moving = moving + 1;
                }
                
                //add the values in the list of processed
                accelerometer_values.push([useful[i].datetime, useful[i].accx, useful[i].accy, useful[i].accz])
            }
            
            
            //compute if last 10 activity logs classify as moving
            let moved = "false";
            
            //I chose to use 8 as a treshold, empirical value, 
            //If the user is moving 8 times over 10, it is actually not still
            if (moving > 8){
                moved = "true";
            }
            
            //create payload
            let result = {}
            result["moving"] = moved;
            result["datetime"] = useful[0].datetime;
            result["id"] = useful[0].id;
            result["array"] = accelerometer_values;
            
            //insert in the body the two stations log
            let new_response = []

            new_response.push(result)

                
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


//this function sorts and return a map, useful in order to pass a corrct json
function getSorted(obj) {
    obj.sort(function(a, b) {if (a[0] > b[0]){
              return -1;   
            }else  {
              return 1   
            }
});  
let obj2 = []
for (let i = 0; i < obj.length; i++){
    let payload = {}
    payload["datetime"] = obj[i][0]
    payload["id"] = obj[i][1]
    payload["accx"] = obj[i][2]
    payload["accy"] = obj[i][3]
    payload["accz"] = obj[i][4]
    obj2.push(payload)
            }
return obj2
}



