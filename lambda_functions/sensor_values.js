/*
this function 
-scan the database
-process the latest sensor values of last hour
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
    //ddClient.query(params, function(err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            responseBody = data.Items;
            
            let temperatures = [];
            let humidity = [];
            let windDirection = [];
            let windIntensity = [];
            let rainHeigth = [];
            let dt = getDatetime()
            for (let i = 0; i < responseBody.length; i++) {
                if(responseBody[i].datetime > dt){
                temperatures.push([responseBody[i].datetime,responseBody[i].payload.temperature,responseBody[i].payload.deviceId, "Temperature"])
                humidity.push([responseBody[i].datetime,responseBody[i].payload.humidity,responseBody[i].payload.deviceId, "Humidity"])
                windDirection.push([responseBody[i].datetime,responseBody[i].payload.windDirection,responseBody[i].payload.deviceId,"Wind Direction"])
                windIntensity.push([responseBody[i].datetime,responseBody[i].payload.windIntensity,responseBody[i].payload.deviceId,"Wind Intensity"])
                rainHeigth.push([responseBody[i].datetime,responseBody[i].payload.rainHeigth,responseBody[i].payload.deviceId,"Rain Heigth"])
                }}
            let new_response = []
            temperatures = getSorted(temperatures)
            humidity = getSorted(humidity)
            windDirection = getSorted(windDirection)
            windIntensity = getSorted(windIntensity)
            rainHeigth = getSorted(rainHeigth)
            if(temperatures.length != 0){
                new_response.push(humidity)
                new_response.push(temperatures)
                new_response.push(windDirection)
                new_response.push(windIntensity)
                new_response.push(rainHeigth)
            }
            
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
    payload["value"] = obj[i][1]
    payload["deviceId"] = obj[i][2]
    payload["obj"] = obj[i][3]
    obj2.push(payload)
            }
return obj2
}

//this function return datetime (+0)
function getDatetime(){
    let date_ob = new Date();
            
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours since we are +1
    let hours = date_ob.getHours();

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);

    let our_datetime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    
    console.log(our_datetime)    
    return our_datetime
}